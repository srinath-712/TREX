from memecoin_radar.models.schemas import OnChainFeatures

def extract_onchain_features(raw: dict, coin: str) -> OnChainFeatures:
    if raw.get('source') == 'unavailable':
        return OnChainFeatures(
            coin=coin,
            whale_activity=0.0,
            volume_growth=0.0,
            holder_growth=0.0,
            buy_sell_ratio=None
        )

    curr_whale = raw['curr_whale_count']
    prev_whale = raw['prev_whale_count']
    if curr_whale == 0 and prev_whale == 0:
        whale_activity = 0.0
    else:
        whale_activity = curr_whale / max(curr_whale + prev_whale, 1)
        whale_activity = min(whale_activity, 1.0)  # always in [0, 1]

    curr_vol = raw['curr_volume_usd']
    prev_vol = raw['prev_volume_usd']
    volume_growth = (curr_vol - prev_vol) / max(prev_vol, 1.0)
    volume_growth = max(-1.0, min(1.0, volume_growth))  # clamp to [-1, 1]

    curr_holders = raw['curr_holder_count']
    prev_holders = raw['prev_holder_count']
    holder_growth = (curr_holders - prev_holders) / max(prev_holders, 1)
    holder_growth = max(-1.0, min(1.0, holder_growth))  # clamp to [-1, 1]

    bsr = raw['buy_sell_ratio']
    if bsr is None:
        buy_sell_ratio_normalized = None
    else:
        # Maps: 0 → 0.0, 1.0 → 0.5, ∞ → 1.0
        buy_sell_ratio_normalized = bsr / (bsr + 1.0)  # always in (0, 1)

    return OnChainFeatures(
        coin=coin,
        whale_activity=whale_activity,
        volume_growth=volume_growth,
        holder_growth=holder_growth,
        buy_sell_ratio=buy_sell_ratio_normalized
    )
