import os
import re
from datetime import datetime, timedelta, timezone
from typing import List

import tweepy
import praw
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

from memecoin_radar.config import WINDOW_MINUTES
from memecoin_radar.models.schemas import CleanPost

analyzer = SentimentIntensityAnalyzer()  # instantiated ONCE at module level, never inside a function
_seen_post_ids: set = set()              # module-level dedup tracker

def clean_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r'http\S+|www\S+', '', text)
    text = re.sub(r'[^a-z0-9\$\# ]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def _fetch_from_twitter(coin: str) -> List[dict]:
    try:
        try:
            bearer_token = os.environ['TWITTER_BEARER_TOKEN']
        except KeyError:
            print("[WARNING] Twitter: TWITTER_BEARER_TOKEN environment variable not set.")
            return []
        
        client = tweepy.Client(bearer_token=bearer_token)
        query = f'${coin} -is:retweet lang:en'
        
        response = client.search_recent_tweets(
            query=query,
            tweet_fields=['created_at', 'public_metrics', 'text', 'id']
        )
        
        if not response or not response.data:
            return []
            
        results = []
        for tweet in response.data:
            metrics = tweet.public_metrics
            results.append({
                'text': tweet.text,
                'timestamp': tweet.created_at,
                'likes': metrics['like_count'],
                'comments': metrics['reply_count'],
                'reposts': metrics['retweet_count'],
                'source': 'twitter',
                'post_id': str(tweet.id)
            })
        return results
    except Exception as e:
        print(f'[ERROR] Twitter: {e}')
        return []

def _fetch_from_reddit(coin: str) -> List[dict]:
    try:
        try:
            client_id = os.environ['REDDIT_CLIENT_ID']
            client_secret = os.environ['REDDIT_CLIENT_SECRET']
        except KeyError:
            print("[WARNING] Reddit: REDDIT_CLIENT_ID or REDDIT_CLIENT_SECRET environment variable not set.")
            return []
            
        reddit = praw.Reddit(
            client_id=client_id,
            client_secret=client_secret,
            user_agent='TREX/1.0'
        )
        subreddits = ['CryptoMoonShots', 'SatoshiStreetBets', 'dogecoin', 'shitcoinmoonshots']
        
        results = []
        for sub in subreddits:
            try:
                subreddit = reddit.subreddit(sub)
                for submission in subreddit.search(coin, sort='new', time_filter='hour', limit=100):
                    dt = datetime.fromtimestamp(submission.created_utc, tz=timezone.utc)
                    results.append({
                        'text': f"{submission.title} {submission.selftext}",
                        'timestamp': dt,
                        'likes': submission.score,
                        'comments': submission.num_comments,
                        'reposts': 0,
                        'source': 'reddit',
                        'post_id': str(submission.id)
                    })
            except Exception as inner_e:
                print(f'[ERROR] Reddit Subreddit {sub}: {inner_e}')
        return results
    except Exception as e:
        print(f'[ERROR] Reddit: {e}')
        return []

def fetch_social_data(coin: str) -> dict:
    """
    Returns:
    {
        'current':                List[CleanPost],
        'previous':               List[CleanPost],
        'noise_filtered_count':   int,
        'duplicate_removed_count': int,
        'total_fetched':          int   # raw count before any filtering
    }
    """
    global _seen_post_ids
    _seen_post_ids = set()
    
    combined = _fetch_from_twitter(coin) + _fetch_from_reddit(coin)
    total_fetched = len(combined)
    
    noise_filtered_count = 0
    duplicate_removed_count = 0
    all_clean_posts = []
    
    for post in combined:
        post_id = post['post_id']
        if post_id in _seen_post_ids:
            duplicate_removed_count += 1
            continue
        else:
            _seen_post_ids.add(post_id)
            
        if post['likes'] + post['comments'] + post['reposts'] == 0:
            noise_filtered_count += 1
            continue
            
        cleaned_text = clean_text(post['text'])
        compound_score = analyzer.polarity_scores(cleaned_text)['compound']
        
        clean_post = CleanPost(
            text=cleaned_text,
            timestamp=post['timestamp'],
            likes=post['likes'],
            comments=post['comments'],
            reposts=post['reposts'],
            source=post['source'],
            post_id=post_id,
            compound_score=compound_score
        )
        all_clean_posts.append(clean_post)
        
    now = datetime.now(timezone.utc)
    current_start = now - timedelta(minutes=WINDOW_MINUTES)
    prev_start = now - timedelta(minutes=2 * WINDOW_MINUTES)

    current = [p for p in all_clean_posts if p.timestamp >= current_start]
    previous = [p for p in all_clean_posts if prev_start <= p.timestamp < current_start]

    return {
        'current': current,
        'previous': previous,
        'noise_filtered_count': noise_filtered_count,
        'duplicate_removed_count': duplicate_removed_count,
        'total_fetched': total_fetched
    }
