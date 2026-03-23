from typing import List
from memecoin_radar.models.schemas import CleanPost, SocialFeatures
from memecoin_radar.config import ENGAGEMENT_NORMALIZATION_CAP

def extract_social_features(
    current_posts: List[CleanPost],
    previous_posts: List[CleanPost],
    coin: str,
    noise_filtered_count: int,
    duplicate_removed_count: int,
) -> SocialFeatures:
    curr_mentions = len(current_posts)
    prev_mentions = len(previous_posts)
    growth = (curr_mentions - prev_mentions) / max(prev_mentions, 1)
    growth = max(-1.0, min(1.0, growth))  # clamp to [-1, 1]

    if len(current_posts) == 0:
        avg_sentiment = 0.0
    else:
        avg_sentiment = sum(p.compound_score for p in current_posts) / len(current_posts)

    if len(current_posts) == 0:
        engagement_score = 0.0
    else:
        raw_per_post = [(p.likes + p.comments + p.reposts) for p in current_posts]
        mean_raw = sum(raw_per_post) / len(current_posts)
        engagement_score = min(mean_raw / ENGAGEMENT_NORMALIZATION_CAP, 1.0)

    if len(previous_posts) == 0:
        prev_sentiment = 0.0
    else:
        prev_sentiment = sum(p.compound_score for p in previous_posts) / len(previous_posts)

    curr_sentiment = avg_sentiment  # reuse value from Feature 2
    momentum = curr_sentiment - prev_sentiment
    momentum = max(-1.0, min(1.0, momentum))  # clamp to [-1, 1]

    return SocialFeatures(
        coin=coin,
        mention_growth=growth,
        avg_sentiment=avg_sentiment,
        engagement_score=engagement_score,
        sentiment_momentum=momentum,
        curr_mentions=curr_mentions,
        prev_mentions=prev_mentions,
        curr_sentiment=curr_sentiment,
        prev_sentiment=prev_sentiment,
        total_posts=len(current_posts),
        noise_filtered_count=noise_filtered_count,
        duplicate_removed_count=duplicate_removed_count,
    )
