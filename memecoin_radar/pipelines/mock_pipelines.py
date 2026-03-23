import random
from datetime import datetime, timedelta, timezone
from typing import List
from memecoin_radar.models.schemas import CleanPost, SocialFeatures

def fetch_mock_social_data(coin: str) -> dict:
    now = datetime.now(timezone.utc)
    
    curr_mentions = random.randint(500, 2000)
    prev_mentions = random.randint(400, 1800)
    
    sentiment = random.uniform(30.0, 80.0)
    normalized_sentiment = (sentiment - 50) / 50.0
    
    engagement = random.randint(1000, 50000)
    engagement_score = min(engagement / 10000.0, 1.0)
    
    growth = 0.0
    if prev_mentions > 0:
        growth = (curr_mentions - prev_mentions) / prev_mentions
        growth = max(-1.0, min(1.0, growth))
        
    features = SocialFeatures(
        coin=coin,
        mention_growth=growth,
        avg_sentiment=normalized_sentiment,
        engagement_score=engagement_score,
        sentiment_momentum=0.0,
        curr_mentions=curr_mentions,
        prev_mentions=prev_mentions,
        curr_sentiment=normalized_sentiment,
        prev_sentiment=normalized_sentiment,
        total_posts=curr_mentions,
        noise_filtered_count=0,
        duplicate_removed_count=0,
    )

    placeholder_post = CleanPost(
        text=f"Mock LunarCrush Data: ${coin} has a social volume of {curr_mentions} and average sentiment of {sentiment:.1f}/100.",
        timestamp=now,
        likes=int(engagement * 0.1),
        comments=int(engagement * 0.05),
        reposts=int(engagement * 0.02),
        source="lunarcrush_mock",
        post_id=f"mock_{coin}_{int(now.timestamp())}",
        compound_score=normalized_sentiment
    )
    
    return {
        'posts': [placeholder_post],
        'features': features,
        'total_volume': curr_mentions
    }

async def fetch_mock_onchain_data(token_address: str, coin: str) -> dict:
    return {
        'curr_whale_count': random.randint(5, 15),
        'prev_whale_count': random.randint(1, 5),
        'curr_volume_usd': random.uniform(500000, 2000000),
        'prev_volume_usd': random.uniform(100000, 500000),
        'curr_holder_count': random.randint(5000, 10000),
        'prev_holder_count': random.randint(4500, 5000),
        'buy_sell_ratio': random.uniform(1.1, 2.5),
        'source': 'mock'
    }
