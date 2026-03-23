from memecoin_radar.config import FINAL_WEIGHT_SOCIAL, FINAL_WEIGHT_ONCHAIN
from memecoin_radar.models.schemas import SocialTrendScore, OnChainScore, FinalScore

def compute_final_score(
    social: SocialTrendScore,
    onchain: OnChainScore
) -> FinalScore:
    # Normalize social from [-1, 1] → [0, 1] before combining
    social_normalized = (social.score + 1.0) / 2.0

    final = (
        FINAL_WEIGHT_SOCIAL  * social_normalized +
        FINAL_WEIGHT_ONCHAIN * onchain.score
    )
    final = max(0.0, min(1.0, final))  # clamp to [0, 1]

    return FinalScore(
        coin=social.coin,
        score=final,
        social_score=social.score,
        onchain_score=onchain.score
    )
