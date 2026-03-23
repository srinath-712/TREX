from fastapi import APIRouter, Query, HTTPException
from datetime import datetime, timezone
import re, asyncio

from memecoin_radar.config import WINDOW_MINUTES, TOP_N_COINS
from memecoin_radar.models.schemas import (
    CoinsListResponse, TrendResponse, HistoryResponse,
    CoinSummary, HistoryEntry
)
from memecoin_radar.pipelines.social_pipeline import fetch_social_data
from memecoin_radar.pipelines.blockchain_pipeline import fetch_onchain_data
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
    """
    Full pipeline for a single coin. Returns all data needed
    for both /trend and /coins endpoints.
    """
    # 1. Fetch social data
    social_raw = fetch_social_data(coin)
    current_posts  = social_raw['current']
    previous_posts = social_raw['previous']
    noise_count    = social_raw['noise_filtered_count']
    dup_count      = social_raw['duplicate_removed_count']
    total_fetched  = social_raw['total_fetched']

    # 2. Store posts in time window store
    store.add_posts(coin, current_posts)

    # 3. Extract social features
    soc_features = extract_social_features(
        current_posts, previous_posts, coin, noise_count, dup_count
    )

    # 4. Fetch on-chain data
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

    # 11. Noise metrics as percentages
    noise_pct = (noise_count / max(total_fetched, 1)) * 100.0
    dup_pct   = (dup_count   / max(total_fetched, 1)) * 100.0

    # 12. Record history snapshot
    store.record_snapshot(coin, HistoryEntry(
        timestamp=datetime.now(timezone.utc),
        final_score=final.score,
        hype_phase=hype.phase,
        confidence=confidence.level,
        mentions=soc_features.curr_mentions,
        avg_sentiment=soc_features.avg_sentiment
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
    )

@router.get('/history', response_model=HistoryResponse)
async def get_history(coin: str = Query(...)):
    coin = validate_coin(coin)
    history = store.get_history(coin, limit=100)
    return HistoryResponse(coin=coin, history=history)
