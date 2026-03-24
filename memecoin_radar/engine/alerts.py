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

    # Calculate ratios first for cross-verification
    curr_w = onchain_raw.get('curr_whale_count', 0)
    prev_w = onchain_raw.get('prev_whale_count', 0)
    whale_ratio = curr_w / prev_w if prev_w > 0 else float(curr_w)

    curr_v = onchain_raw.get('curr_volume_usd', 0.0)
    prev_v = onchain_raw.get('prev_volume_usd', 0.0)
    vol_ratio = curr_v / prev_v if prev_v > 0 else (1.0 if curr_v > 0 else 0.0)

    # Social Verification metrics
    onchain_multiplier = max(whale_ratio, vol_ratio)

    # Alert 1: Mention Spike
    if social_features.prev_mentions > 0:
        mention_ratio = social_features.curr_mentions / social_features.prev_mentions
    else:
        mention_ratio = float(social_features.curr_mentions)
    
    if mention_ratio >= ALERT_MENTION_SPIKE_RATIO:
        is_real = onchain_multiplier >= 1.5
        status_tag = "[REAL]" if is_real else "[FAKE]"
        reasoning = (
            f"Social mentions jumped {mention_ratio:.1f}x. "
            f"On-chain activity (Volume/Whales) also grew by {onchain_multiplier:.1f}x, confirming real interest."
            if is_real else
            f"Social volume surged {mention_ratio:.1f}x, but on-chain metrics only grew {onchain_multiplier:.1f}x. "
            "This mismatch often indicates bot-driven hype or inorganic 'shilling'."
        )
        alerts.append(Alert(
            coin=coin, alert_type='MENTION_SPIKE',
            message=f'{status_tag} Social Hype: {mention_ratio:.1f}x increase',
            timestamp=now,
            severity='HIGH' if mention_ratio >= 5.0 else 'MEDIUM',
            is_real=is_real,
            reasoning=reasoning,
            social_multiplier=mention_ratio,
            onchain_multiplier=onchain_multiplier
        ))

    # Alert 2: Sentiment Flip
    sentiment_delta = abs(
        social_features.curr_sentiment - social_features.prev_sentiment
    )
    if sentiment_delta >= ALERT_SENTIMENT_FLIP_DELTA:
        direction = ('bullish flip' if social_features.curr_sentiment > social_features.prev_sentiment else 'bearish flip')
        is_real = onchain_multiplier >= 1.2
        status_tag = "[REAL]" if is_real else "[FAKE]"
        reasoning = (
            f"Sentiment shows a major {direction}. "
            f"On-chain data confirms this shift with {onchain_multiplier:.1f}x activity growth."
            if is_real else
            f"Sentiment flipped {direction}, but hasn't translated to on-chain transactions yet ({onchain_multiplier:.1f}x growth)."
        )
        alerts.append(Alert(
            coin=coin, alert_type='SENTIMENT_FLIP',
            message=f'{status_tag} Sentiment Flip: {direction}',
            timestamp=now, severity='HIGH',
            is_real=is_real,
            reasoning=reasoning,
            social_multiplier=1.0 + sentiment_delta,
            onchain_multiplier=onchain_multiplier
        ))

    # Alert 3: Volume Spike
    if vol_ratio >= ALERT_VOLUME_SPIKE_RATIO:
        alerts.append(Alert(
            coin=coin, alert_type='VOLUME_SPIKE',
            message='[REAL] On-Chain Volume Spike',
            timestamp=now,
            severity='HIGH' if vol_ratio >= 5.0 else 'MEDIUM',
            is_real=True,
            reasoning=f"Trading volume surged {vol_ratio:.1f}x. Real market demand detected.",
            social_multiplier=mention_ratio,
            onchain_multiplier=vol_ratio
        ))

    return alerts
