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
    # 20% chance of a "fake hype" scenario (low on-chain activity despite high social)
    is_fake = random.random() < 0.2
    
    if is_fake:
        curr_w = random.randint(1, 3)
        prev_w = random.randint(1, 3)
        curr_v = random.uniform(10000, 50000)
        prev_v = random.uniform(10000, 50000)
    else:
        curr_w = random.randint(10, 30)
        prev_w = random.randint(2, 8)
        curr_v = random.uniform(500000, 5000000)
        prev_v = random.uniform(50000, 200000)

    return {
        'curr_whale_count': curr_w,
        'prev_whale_count': prev_w,
        'curr_volume_usd': curr_v,
        'prev_volume_usd': prev_v,
        'curr_holder_count': random.randint(5000, 10000),
        'prev_holder_count': random.randint(4500, 5000),
        'buy_sell_ratio': random.uniform(1.1, 2.5),
        'source': 'mock'
    }
