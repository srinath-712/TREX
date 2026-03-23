import re
from typing import List, Dict
from memecoin_radar.config import TOP_N_COINS, MIN_MENTIONS_TO_TRACK
from memecoin_radar.models.schemas import RawPost

TICKER_PATTERN = re.compile(r'\$([A-Z]{2,10})\b')
KEYWORD_BLOCKLIST = {
    'THE', 'AND', 'FOR', 'NOT', 'BUT', 'USD',
    'ETH', 'BTC', 'NFT', 'API', 'URL'
}

def extract_coins_from_posts(posts: List[RawPost]) -> Dict[str, int]:
    """Returns {ticker: mention_count}"""
    counts: Dict[str, int] = {}
    for post in posts:
        text_upper = post.text.upper()
        matches = TICKER_PATTERN.findall(text_upper)
        for match in matches:
            if match in KEYWORD_BLOCKLIST:
                continue
            counts[match] = counts.get(match, 0) + 1
    return counts

def get_top_coins(mention_counts: Dict[str, int]) -> List[str]:
    """Filter by MIN_MENTIONS_TO_TRACK, sort desc, return top TOP_N_COINS."""
    filtered = {k: v for k, v in mention_counts.items()
                if v >= MIN_MENTIONS_TO_TRACK}
    ranked = sorted(filtered.keys(),
                    key=lambda k: filtered[k], reverse=True)
    return ranked[:TOP_N_COINS]
