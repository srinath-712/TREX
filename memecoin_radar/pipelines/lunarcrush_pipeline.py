import os
import httpx
import asyncio
from datetime import datetime, timezone, timedelta
from memecoin_radar.models.schemas import CleanPost, SocialFeatures

LUNARCRUSH_API_KEY = os.getenv("LUNARCRUSH_API_KEY")

# Simple in-memory cache to avoid rate limits (429)
# Maps coin -> {"data": dict, "timestamp": datetime}
_cache = {}
CACHE_TTL_MINUTES = 5

async def fetch_lunarcrush_data(coin: str) -> dict:
    """
    Fetches real-time social metrics for a coin from LunarCrush API.
    Returns a dictionary containing synthesized 'current' posts (if available)
    and directly computed 'features'.
    """
    now = datetime.now(timezone.utc)
    
    # Check cache first
    cached = _cache.get(coin)
    if cached and (now - cached['timestamp']) < timedelta(minutes=CACHE_TTL_MINUTES):
        return cached['data']

    def _fallback_data():
        return {
            "posts": [],
            "features": SocialFeatures(
                coin=coin, mention_growth=0.0, avg_sentiment=0.0,
                engagement_score=0.0, sentiment_momentum=0.0,
                curr_mentions=0, prev_mentions=0, curr_sentiment=0.0,
                prev_sentiment=0.0, total_posts=0, noise_filtered_count=0,
                duplicate_removed_count=0
            ),
            "total_volume": 0
        }

    if not LUNARCRUSH_API_KEY:
        print(f"[WARNING] LunarCrush: LUNARCRUSH_API_KEY environment variable not set. Falling back to empty data for {coin}.")
        return _fallback_data()

    headers = {"Authorization": f"Bearer {LUNARCRUSH_API_KEY}"}
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(f"https://lunarcrush.com/api4/public/coins/{coin}/v1", headers=headers)
        
        if response.status_code != 200:
            print(f"[ERROR] LunarCrush API returned {response.status_code}: {response.text}")
            return _fallback_data()
            
        data = response.json().get("data", {})
        
        # LunarCrush provides various metrics:
        # e.g., social_volume_24h, average_sentiment, social_score, interactions_24h
        curr_mentions = data.get("social_volume_24h", 0)
        prev_mentions = data.get("social_volume_24h_previous", curr_mentions) # Mocking previous if not available
        
        sentiment = data.get("average_sentiment", 50) # Assuming 0-100 scale, normalize to -1 to 1
        normalized_sentiment = (sentiment - 50) / 50.0
        
        engagement = data.get("interactions_24h", 0)
        engagement_score = min(engagement / 10000.0, 1.0) # Normalize
        
        growth = 0.0
        if prev_mentions > 0:
            growth = (curr_mentions - prev_mentions) / prev_mentions
            growth = max(-1.0, min(1.0, growth))
            
        features = SocialFeatures(
            coin=coin,
            mention_growth=growth,
            avg_sentiment=normalized_sentiment,
            engagement_score=engagement_score,
            sentiment_momentum=0.0, # Hard to get momentum without historical endpoint, defaulting to 0
            curr_mentions=curr_mentions,
            prev_mentions=prev_mentions,
            curr_sentiment=normalized_sentiment,
            prev_sentiment=normalized_sentiment,
            total_posts=curr_mentions,
            noise_filtered_count=0,
            duplicate_removed_count=0,
        )
        
        # Synthesize a few posts for the UI, as LunarCrush v4 requires separate specific endpoints for feeds
        # which might be premium. We'll generate a generic post to show API integration is live.
        now = datetime.now(timezone.utc)
        placeholder_post = CleanPost(
            text=f"Live LunarCrush Data: ${coin} has a social volume of {curr_mentions} and average sentiment of {sentiment}/100.",
            timestamp=now,
            likes=int(engagement * 0.1),
            comments=int(engagement * 0.05),
            reposts=int(engagement * 0.02),
            source="lunarcrush",
            post_id=f"lc_{coin}_{int(now.timestamp())}",
            compound_score=normalized_sentiment
        )
        
        result = {
            "posts": [placeholder_post],
            "features": features,
            "total_volume": curr_mentions
        }
        
        _cache[coin] = {"data": result, "timestamp": now}
        return result
        
    except Exception as e:
        print(f"[ERROR] LunarCrush Pipeline: {e}")
        return _fallback_data()

async def fetch_top_trending_coins() -> list:
    """
    Fetches the top 4 trending meme coins from LunarCrush.
    """
    if not LUNARCRUSH_API_KEY:
        # Fallback to a rotation of popular memes if no API key
        return ["DOGE", "SHIB", "PEPE", "WIF"]

    headers = {"Authorization": f"Bearer {LUNARCRUSH_API_KEY}"}
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # Fetching top 4 coins by social_score (trending)
            response = await client.get("https://lunarcrush.com/api4/public/coins/list/v1?limit=4&sort=social_score", headers=headers)
            if response.status_code == 200:
                data = response.json().get("data", [])
                return [coin.get("symbol", "").upper() for coin in data if coin.get("symbol")]
    except Exception as e:
        print(f"[ERROR] fetch_top_trending_coins: {e}")
    
    return ["DOGE", "SHIB", "PEPE", "WIF"] # Final fallback
