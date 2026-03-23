from datetime import datetime, timezone
from typing import List
from memecoin_radar.config import (
    ALERT_MENTION_SPIKE_RATIO, ALERT_SENTIMENT_FLIP_DELTA,
    ALERT_WHALE_SPIKE_RATIO, ALERT_VOLUME_SPIKE_RATIO
)
from memecoin_radar.models.schemas import SocialFeatures, Alert

def detect_alerts(
    coin: str,
    social_features: SocialFeatures,
    onchain_raw: dict,
) -> List[Alert]:
    alerts = []
    now = datetime.now(timezone.utc)

    # Alert 1: Mention Spike
    if social_features.prev_mentions > 0:
        mention_ratio = social_features.curr_mentions / social_features.prev_mentions
    else:
        mention_ratio = float(social_features.curr_mentions)
    if mention_ratio >= ALERT_MENTION_SPIKE_RATIO:
        alerts.append(Alert(
            coin=coin, alert_type='MENTION_SPIKE',
            message=f'Mention spike: {social_features.curr_mentions} this window vs '
                    f'{social_features.prev_mentions} previous ({mention_ratio:.1f}x).',
            timestamp=now,
            severity='HIGH' if mention_ratio >= 5.0 else 'MEDIUM'
        ))

    # Alert 2: Sentiment Flip
    sentiment_delta = abs(
        social_features.curr_sentiment - social_features.prev_sentiment
    )
    if sentiment_delta >= ALERT_SENTIMENT_FLIP_DELTA:
        direction = ('positive to negative'
                     if social_features.curr_sentiment < social_features.prev_sentiment
                     else 'negative to positive')
        alerts.append(Alert(
            coin=coin, alert_type='SENTIMENT_FLIP',
            message=f'Sentiment flip ({direction}): delta={sentiment_delta:.2f}.',
            timestamp=now, severity='HIGH'
        ))

    # Alert 3: Whale Spike
    curr_w = onchain_raw.get('curr_whale_count', 0)
    prev_w = onchain_raw.get('prev_whale_count', 0)
    whale_ratio = curr_w / prev_w if prev_w > 0 else float(curr_w)
    if whale_ratio >= ALERT_WHALE_SPIKE_RATIO:
        alerts.append(Alert(
            coin=coin, alert_type='WHALE_SPIKE',
            message=f'Whale spike: {curr_w} txs vs {prev_w} previous ({whale_ratio:.1f}x).',
            timestamp=now,
            severity='HIGH' if whale_ratio >= 4.0 else 'MEDIUM'
        ))

    # Alert 4: Volume Spike
    curr_v = onchain_raw.get('curr_volume_usd', 0.0)
    prev_v = onchain_raw.get('prev_volume_usd', 0.0)
    vol_ratio = curr_v / prev_v if prev_v > 0 else float(curr_v > 0)
    if vol_ratio >= ALERT_VOLUME_SPIKE_RATIO:
        alerts.append(Alert(
            coin=coin, alert_type='VOLUME_SPIKE',
            message=f'Volume spike: ${curr_v:,.0f} vs ${prev_v:,.0f} ({vol_ratio:.1f}x).',
            timestamp=now,
            severity='HIGH' if vol_ratio >= 5.0 else 'MEDIUM'
        ))

    return alerts
