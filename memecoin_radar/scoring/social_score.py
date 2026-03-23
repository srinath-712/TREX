from memecoin_radar.config import (
    SOCIAL_WEIGHT_GROWTH,
    SOCIAL_WEIGHT_SENTIMENT,
    SOCIAL_WEIGHT_ENGAGEMENT,
    SOCIAL_WEIGHT_MOMENTUM
)
from memecoin_radar.models.schemas import SocialFeatures, SocialTrendScore

def compute_social_trend_score(features: SocialFeatures) -> SocialTrendScore:
    score = (
        SOCIAL_WEIGHT_GROWTH     * features.mention_growth     +
        SOCIAL_WEIGHT_SENTIMENT  * features.avg_sentiment      +
        SOCIAL_WEIGHT_ENGAGEMENT * features.engagement_score   +
        SOCIAL_WEIGHT_MOMENTUM   * features.sentiment_momentum
    )
    # mention_growth and momentum can be negative → result can be < 0
    score = max(-1.0, min(1.0, score))  # clamp to [-1, 1]
    return SocialTrendScore(coin=features.coin, score=score)
