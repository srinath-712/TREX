from memecoin_radar.config import (
    ONCHAIN_WEIGHT_WHALE,
    ONCHAIN_WEIGHT_VOLUME,
    ONCHAIN_WEIGHT_HOLDER
)
from memecoin_radar.models.schemas import OnChainFeatures, OnChainScore

def compute_onchain_score(features: OnChainFeatures) -> OnChainScore:
    score = (
        ONCHAIN_WEIGHT_WHALE  * features.whale_activity             +
        ONCHAIN_WEIGHT_VOLUME * max(features.volume_growth, 0.0)    +
        ONCHAIN_WEIGHT_HOLDER * max(features.holder_growth, 0.0)
    )
    # volume_growth and holder_growth are floored at 0 —
    # negative growth must NOT penalize the on-chain score

    # Buy/sell ratio modifier (only applied if available)
    if features.buy_sell_ratio is not None:
        score = 0.9 * score + 0.1 * features.buy_sell_ratio

    score = max(0.0, min(1.0, score))  # clamp to [0, 1]
    return OnChainScore(coin=features.coin, score=score)
