from memecoin_radar.config import (
    HYPE_DEAD_MAX_MENTIONS, HYPE_DEAD_MAX_SENTIMENT,
    HYPE_COOLING_MAX_SENTIMENT_MOMENTUM,
    HYPE_PEAK_MIN_MENTIONS, HYPE_PEAK_MAX_SENTIMENT_DELTA,
    HYPE_EARLY_MIN_GROWTH, HYPE_EARLY_MIN_SENTIMENT
)
from memecoin_radar.models.schemas import SocialFeatures, HypeCycle

def classify_hype_cycle(features: SocialFeatures) -> HypeCycle:
    g = features.mention_growth
    s = features.avg_sentiment
    m = features.sentiment_momentum
    curr = features.curr_mentions

    # Rule 1 — DEAD (check first)
    if curr <= HYPE_DEAD_MAX_MENTIONS and s <= HYPE_DEAD_MAX_SENTIMENT:
        return HypeCycle(coin=features.coin, phase='DEAD')

    # Rule 2 — COOLING
    if m <= HYPE_COOLING_MAX_SENTIMENT_MOMENTUM:
        return HypeCycle(coin=features.coin, phase='COOLING')

    # Rule 3 — PEAK_HYPE
    if curr >= HYPE_PEAK_MIN_MENTIONS and abs(m) < HYPE_PEAK_MAX_SENTIMENT_DELTA:
        return HypeCycle(coin=features.coin, phase='PEAK_HYPE')

    # Rule 4 — EARLY_HYPE
    if g >= HYPE_EARLY_MIN_GROWTH and s >= HYPE_EARLY_MIN_SENTIMENT:
        return HypeCycle(coin=features.coin, phase='EARLY_HYPE')

    return HypeCycle(coin=features.coin, phase='UNKNOWN')
