from fastapi import APIRouter, Query, HTTPException
from datetime import datetime, timezone
import re, asyncio, os
from fastapi import WebSocket, WebSocketDisconnect
from memecoin_radar.api.ws_manager import manager

from memecoin_radar.config import WINDOW_MINUTES, TOP_N_COINS
from memecoin_radar.models.schemas import (
    CoinsListResponse, TrendResponse, HistoryResponse,
    CoinSummary, HistoryEntry, CleanPost
)
from memecoin_radar.pipelines.lunarcrush_pipeline import fetch_lunarcrush_data
from memecoin_radar.pipelines.blockchain_pipeline import fetch_onchain_data
from memecoin_radar.pipelines.mock_pipelines import fetch_mock_social_data, fetch_mock_onchain_data
from memecoin_radar.features.social_features import extract_social_features
from memecoin_radar.features.onchain_features import extract_onchain_features
from memecoin_radar.scoring.social_score import compute_social_trend_score
from memecoin_radar.scoring.onchain_score import compute_onchain_score
from memecoin_radar.scoring.final_score import compute_final_score
from memecoin_radar.engine.classification import classify_hype_cycle
from memecoin_radar.engine.confidence import compute_confidence
from memecoin_radar.engine.alerts import detect_alerts
from memecoin_radar.engine.influencer import detect_influencer_signal
from memecoin_radar.detection.coin_detector import extract_coins_from_posts, get_top_coins
from memecoin_radar.storage.time_window_store import store

router = APIRouter()

VALID_TICKER = re.compile(r'^[A-Z0-9]{2,10}$')

def validate_coin(coin: str) -> str:
    coin = coin.upper().strip()
    if not VALID_TICKER.match(coin):
        raise HTTPException(status_code=422,
            detail='Invalid coin ticker format')
    return coin

async def _run_pipeline(coin: str) -> dict:
    USE_MOCKS = os.getenv('USE_MOCKS', 'true').lower() == 'true'
    
    # 1. Fetch social data
    if USE_MOCKS:
        lunarcrush_data = fetch_mock_social_data(coin)
    else:
        lunarcrush_data = await fetch_lunarcrush_data(coin)
        
    current_posts  = lunarcrush_data['posts']
    soc_features   = lunarcrush_data['features']
    total_fetched  = lunarcrush_data['total_volume']

    # 2. Store synthesized posts in time window store for UI
    store.add_posts(coin, current_posts)

    # 3. Fetch on-chain data
    if USE_MOCKS:
        onchain_raw = await fetch_mock_onchain_data(coin, coin)
    else:
        # token_address lookup not in scope — coin ticker used as placeholder
        onchain_raw = await fetch_onchain_data(coin, coin)

    # 5. Extract on-chain features
    oc_features = extract_onchain_features(onchain_raw, coin)

    # Flag unavailable on-chain data
    unavailable_onchain = onchain_raw.get('source') == 'unavailable'

    # 6. Compute scores
    soc_score = compute_social_trend_score(soc_features)
    oc_score  = compute_onchain_score(oc_features)
    final     = compute_final_score(soc_score, oc_score)

    # 7. Classify hype cycle
    hype = classify_hype_cycle(soc_features)

    # 8. Confidence — fallback to LOW if on-chain unavailable
    if unavailable_onchain:
        from memecoin_radar.models.schemas import ConfidenceLevel
        confidence = ConfidenceLevel(
            coin=coin, level='LOW',
            reason='on-chain data unavailable'
        )
    else:
        confidence = compute_confidence(
            soc_features, final, oc_features, current_posts
        )

    # 9. Alerts
    alerts = detect_alerts(coin, soc_features, onchain_raw)

    # 10. Influencer signal
    influencer = detect_influencer_signal(coin, current_posts)

    # 11. Noise metrics as percentages (mocked to 0 for LunarCrush data)
    noise_pct = 0.0
    dup_pct   = 0.0

    # 12. Calculate velocity
    history = store.get_history(coin)
    velocity = 0.0
    if len(history) >= 4:
        velocity = (final.score - history[-4].final_score) / 3
    elif len(history) > 0:
        velocity = (final.score - history[0].final_score) / len(history)

    # 13. Broadcast WebSocket updates
    await manager.broadcast({
        'type': 'score_update',
        'coin': coin,
        'data': {
            'final_score': final.score,
            'social_score': final.social_score,
            'onchain_score': final.onchain_score,
            'hype_phase': hype.phase,
            'confidence': confidence.level
        },
        'timestamp': datetime.now(timezone.utc).isoformat()
    })
    
    for alert in alerts:
        await manager.broadcast({
            'type': 'new_alert',
            'coin': coin,
            'data': alert.model_dump() if hasattr(alert, 'model_dump') else alert.dict(),
            'timestamp': datetime.now(timezone.utc).isoformat()
        })
        
    phase_change = store.check_and_update_phase(coin, hype.phase)
    if phase_change:
        new_phase, old_phase = phase_change
        await manager.broadcast({
            'type': 'phase_change',
            'coin': coin,
            'data': {
                'old_phase': old_phase,
                'new_phase': new_phase,
                'final_score': final.score
            },
            'timestamp': datetime.now(timezone.utc).isoformat()
        })

    # 14. Record history snapshot
    store.record_snapshot(coin, HistoryEntry(
        timestamp=datetime.now(timezone.utc),
        final_score=final.score,
        hype_phase=hype.phase,
        confidence=confidence.level,
        mentions=soc_features.curr_mentions,
        avg_sentiment=soc_features.avg_sentiment,
        velocity=velocity
    ))

    return {
        'coin': coin,
        'final': final,
        'soc_features': soc_features,
        'oc_features': oc_features,
        'hype': hype,
        'confidence': confidence,
        'alerts': alerts,
        'influencer': influencer,
        'noise_pct': noise_pct,
        'dup_pct': dup_pct,
        'velocity': velocity,
    }

@router.get('/coins', response_model=CoinsListResponse)
async def get_coins():
    tracked = store.get_tracked_coins()
    if not tracked:
        return CoinsListResponse(coins=[], total=0,
                                 window_minutes=WINDOW_MINUTES)

    results = []
    for coin in tracked[:TOP_N_COINS]:
        try:
            data = await _run_pipeline(coin)
            results.append(CoinSummary(
                coin=data['coin'],
                final_score=data['final'].score,
                hype_phase=data['hype'].phase,
                confidence=data['confidence'].level,
                alerts=data['alerts'],
                influencer_signal=data['influencer'],
                noise_filtered_pct=data['noise_pct'],
                duplicate_removed_pct=data['dup_pct'],
                velocity=data['velocity'],
            ))
        except Exception as e:
            print(f'[ERROR] pipeline failed for {coin}: {e}')

    results.sort(key=lambda x: x.final_score, reverse=True)
    return CoinsListResponse(
        coins=results, total=len(results),
        window_minutes=WINDOW_MINUTES
    )

@router.get('/trend', response_model=TrendResponse)
async def get_trend(coin: str = Query(...,
        description='Coin ticker, e.g. PEPE')):
    coin = validate_coin(coin)
    data = await _run_pipeline(coin)
    return TrendResponse(
        coin=data['coin'],
        final_score=data['final'].score,
        social_score=data['final'].social_score,
        onchain_score=data['final'].onchain_score,
        hype_phase=data['hype'].phase,
        confidence=data['confidence'].level,
        confidence_reason=data['confidence'].reason,
        social_features=data['soc_features'],
        onchain_features=data['oc_features'],
        alerts=data['alerts'],
        influencer_signal=data['influencer'],
        noise_filtered_pct=data['noise_pct'],
        duplicate_removed_pct=data['dup_pct'],
        velocity=data['velocity'],
    )

@router.get('/history', response_model=HistoryResponse)
async def get_history(coin: str = Query(...)):
    coin = validate_coin(coin)
    history = store.get_history(coin, limit=100)
    return HistoryResponse(coin=coin, history=history)

@router.get('/watchlist')
async def get_watchlist():
    return {"watchlist": store.get_watchlist()}

@router.post('/watchlist/{coin}')
async def add_watchlist(coin: str):
    coin = validate_coin(coin)
    store.add_to_watchlist(coin)
    return {"status": "success", "coin": coin}

@router.delete('/watchlist/{coin}')
async def remove_watchlist(coin: str):
    coin = validate_coin(coin)
    store.remove_from_watchlist(coin)
    return {"status": "success", "coin": coin}

@router.websocket('/ws/feed')
async def websocket_feed(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
