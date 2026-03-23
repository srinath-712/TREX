from typing import List
from memecoin_radar.config import INFLUENCER_ENGAGEMENT_MULTIPLIER
from memecoin_radar.models.schemas import CleanPost, InfluencerSignal

def detect_influencer_signal(
    coin: str,
    current_posts: List[CleanPost]
) -> InfluencerSignal:
    if len(current_posts) < 2:
        return InfluencerSignal(
            coin=coin, detected=False,
            message='Insufficient data for influencer detection.'
        )

    engagements = [p.likes + p.comments + p.reposts for p in current_posts]
    mean_eng = sum(engagements) / len(engagements)

    spike_value, spike_id, spike_post = 0, None, None
    for post, eng in zip(current_posts, engagements):
        if mean_eng > 0 and eng >= INFLUENCER_ENGAGEMENT_MULTIPLIER * mean_eng:
            if eng > spike_value:
                spike_value, spike_id, spike_post = eng, post.post_id, post

    if spike_post:
        return InfluencerSignal(
            coin=coin, detected=True,
            message=(
                f'Abnormal engagement spike on post {spike_id}: '
                f'{spike_value} interactions vs mean {mean_eng:.1f} '
                f'({spike_value/mean_eng:.1f}x). Possible influencer activity.'
            ),
            spike_post_id=spike_id,
            spike_engagement=spike_value,
            mean_engagement=mean_eng
        )

    return InfluencerSignal(
        coin=coin, detected=False,
        message=f'No influencer spike detected. Mean engagement: {mean_eng:.1f}.'
    )
