import hashlib
from memecoin_radar.config import (
    HYPE_DEAD_MAX_MENTIONS, HYPE_DEAD_MAX_SENTIMENT,
    HYPE_COOLING_MAX_SENTIMENT_MOMENTUM,
    HYPE_PEAK_MIN_MENTIONS, HYPE_PEAK_MAX_SENTIMENT_DELTA,
    HYPE_EARLY_MIN_GROWTH, HYPE_EARLY_MIN_SENTIMENT
)
from memecoin_radar.models.schemas import SocialFeatures, HypeCycle

def _get_ticker_offset(ticker: str, max_offset_magnitude: float = 0.05) -> float:
    """
    Generates a consistent, small offset based on the coin ticker's hash.
    The offset is normalized to a range of [-max_offset_magnitude, +max_offset_magnitude].
    """
    hash_object = hashlib.sha256(ticker.encode())
    hex_dig = hash_object.hexdigest()
    # Use a portion of the hash to create a reproducible integer
    # Taking the first 4 hex digits gives a range from 0 to 65535
    hash_int = int(hex_dig[:4], 16)
    # Normalize to a float between 0 and 1
    normalized_hash = hash_int / 65535.0
    # Scale to the desired offset range
    offset = (normalized_hash * 2 * max_offset_magnitude) - max_offset_magnitude
    return offset

def classify_hype_cycle(features: SocialFeatures) -> HypeCycle:
    g = features.mention_growth
    s = features.avg_sentiment
    m = features.sentiment_momentum
    curr = features.curr_mentions
    coin_ticker = features.coin

    # Generate a unique offset for this coin based on its ticker
    # This offset will slightly adjust thresholds, making classification dynamic per coin
    ticker_offset = _get_ticker_offset(coin_ticker, max_offset_magnitude=0.1) # Up to 10% adjustment

    # Rule 1 — DEAD (check first)
    adj_dead_mentions = HYPE_DEAD_MAX_MENTIONS * (1 + ticker_offset)
    adj_dead_sentiment = HYPE_DEAD_MAX_SENTIMENT * (1 + ticker_offset)
    if curr <= adj_dead_mentions and s <= adj_dead_sentiment:
        return HypeCycle(coin=coin_ticker, phase='DEAD')

    # Rule 2 — COOLING
    adj_cooling_momentum = HYPE_COOLING_MAX_SENTIMENT_MOMENTUM * (1 + ticker_offset)
    if m <= adj_cooling_momentum:
        return HypeCycle(coin=coin_ticker, phase='COOLING')

    # Rule 3 — PEAK_HYPE
    adj_peak_mentions = HYPE_PEAK_MIN_MENTIONS * (1 + ticker_offset)
    adj_peak_sentiment_delta = HYPE_PEAK_MAX_SENTIMENT_DELTA * (1 + ticker_offset)
    if curr >= adj_peak_mentions and abs(m) < adj_peak_sentiment_delta:
        return HypeCycle(coin=coin_ticker, phase='PEAK_HYPE')

    # Rule 4 — EARLY_HYPE
    adj_early_growth = HYPE_EARLY_MIN_GROWTH * (1 + ticker_offset)
    adj_early_sentiment = HYPE_EARLY_MIN_SENTIMENT * (1 + ticker_offset)
    if g >= adj_early_growth and s >= adj_early_sentiment:
        return HypeCycle(coin=coin_ticker, phase='EARLY_HYPE')

    return HypeCycle(coin=coin_ticker, phase='UNKNOWN')
