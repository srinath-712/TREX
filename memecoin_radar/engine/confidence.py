import statistics
from typing import List
from memecoin_radar.config import (
    CONFIDENCE_HIGH_MIN_POSTS, CONFIDENCE_HIGH_MAX_SENTIMENT_VAR,
    CONFIDENCE_HIGH_MIN_ENGAGEMENT,
    CONFIDENCE_MEDIUM_MIN_POSTS, CONFIDENCE_MEDIUM_MAX_SENTIMENT_VAR,
    CONFIDENCE_MEDIUM_MIN_ENGAGEMENT
)
from memecoin_radar.models.schemas import (
    SocialFeatures, FinalScore, OnChainFeatures, CleanPost, ConfidenceLevel
)

def compute_confidence(
    features: SocialFeatures,
    final_score: FinalScore,
    onchain_features: OnChainFeatures,
    current_posts: List[CleanPost],
) -> ConfidenceLevel:
    coin = features.coin
    n = features.total_posts
    engagement = features.engagement_score

    # Sentiment variance — worst-case 1.0 if insufficient data
    if len(current_posts) >= 2:
        sentiment_var = statistics.variance(
            [p.compound_score for p in current_posts]
        )
    else:
        sentiment_var = 1.0

    # Social/on-chain alignment check
    social_norm = (features.avg_sentiment + 1.0) / 2.0
    alignment_delta = abs(social_norm - onchain_features.whale_activity)
    aligned = alignment_delta < 0.3

    # HIGH — all four conditions must be true
    if (n >= CONFIDENCE_HIGH_MIN_POSTS
            and sentiment_var <= CONFIDENCE_HIGH_MAX_SENTIMENT_VAR
            and engagement >= CONFIDENCE_HIGH_MIN_ENGAGEMENT
            and aligned):
        return ConfidenceLevel(
            coin=coin, level='HIGH',
            reason=f'Posts={n}, sentiment_var={sentiment_var:.3f}, '
                   f'engagement={engagement:.2f}, social/onchain aligned'
        )

    # MEDIUM — all three conditions must be true
    if (n >= CONFIDENCE_MEDIUM_MIN_POSTS
            and sentiment_var <= CONFIDENCE_MEDIUM_MAX_SENTIMENT_VAR
            and engagement >= CONFIDENCE_MEDIUM_MIN_ENGAGEMENT):
        return ConfidenceLevel(
            coin=coin, level='MEDIUM',
            reason=f'Posts={n}, sentiment_var={sentiment_var:.3f}, '
                   f'engagement={engagement:.2f}'
        )

    # LOW — default, build reason string from failed conditions
    reasons = []
    if n < CONFIDENCE_MEDIUM_MIN_POSTS:
        reasons.append(f'low post count ({n})')
    if sentiment_var > CONFIDENCE_MEDIUM_MAX_SENTIMENT_VAR:
        reasons.append(f'high sentiment variance ({sentiment_var:.3f})')
    if engagement < CONFIDENCE_MEDIUM_MIN_ENGAGEMENT:
        reasons.append(f'low engagement ({engagement:.2f})')
    if not aligned:
        reasons.append('social/onchain misaligned')
    return ConfidenceLevel(
        coin=coin, level='LOW',
        reason=', '.join(reasons) or 'insufficient data'
    )
