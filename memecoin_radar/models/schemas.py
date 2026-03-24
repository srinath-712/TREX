from pydantic import BaseModel
from typing import Optional, List, Literal
from datetime import datetime

class RawPost(BaseModel):
    text: str
    timestamp: datetime
    likes: int
    comments: int
    reposts: int
    source: Literal['twitter', 'reddit']
    post_id: str

class CleanPost(BaseModel):
    text: str
    timestamp: datetime
    likes: int
    comments: int
    reposts: int
    source: str
    post_id: str
    compound_score: float
    username: Optional[str] = None
    user_avatar: Optional[str] = None

class SocialWindow(BaseModel):
    coin: str
    window_start: datetime
    window_end: datetime
    posts: List[CleanPost]

class SocialFeatures(BaseModel):
    coin: str
    mention_growth: float
    avg_sentiment: float
    engagement_score: float
    sentiment_momentum: float
    curr_mentions: int
    prev_mentions: int
    curr_sentiment: float
    prev_sentiment: float
    total_posts: int
    noise_filtered_count: int
    duplicate_removed_count: int

class OnChainFeatures(BaseModel):
    coin: str
    whale_activity: float
    volume_growth: float
    holder_growth: float
    buy_sell_ratio: Optional[float] = None

class SocialTrendScore(BaseModel):
    coin: str
    score: float

class OnChainScore(BaseModel):
    coin: str
    score: float

class FinalScore(BaseModel):
    coin: str
    score: float
    social_score: float
    onchain_score: float

class HypeCycle(BaseModel):
    coin: str
    phase: Literal['EARLY_HYPE','PEAK_HYPE','COOLING','DEAD','UNKNOWN']

class ConfidenceLevel(BaseModel):
    coin: str
    level: Literal['HIGH','MEDIUM','LOW']
    reason: str

class Alert(BaseModel):
    coin: str
    alert_type: Literal['MENTION_SPIKE','SENTIMENT_FLIP','WHALE_SPIKE','VOLUME_SPIKE']
    message: str
    timestamp: datetime
    severity: Literal['HIGH','MEDIUM','LOW']
    is_real: Optional[bool] = None
    reasoning: Optional[str] = None
    social_multiplier: Optional[float] = None
    onchain_multiplier: Optional[float] = None

class InfluencerSignal(BaseModel):
    coin: str
    detected: bool
    message: str
    spike_post_id: Optional[str] = None
    spike_engagement: Optional[int] = None
    mean_engagement: Optional[float] = None

class CoinSummary(BaseModel):
    coin: str
    final_score: float
    hype_phase: str
    confidence: str
    alerts: List[Alert]
    influencer_signal: InfluencerSignal
    noise_filtered_pct: float
    duplicate_removed_pct: float
    velocity: float = 0.0

class TrendResponse(BaseModel):
    coin: str
    final_score: float
    social_score: float
    onchain_score: float
    hype_phase: str
    confidence: str
    confidence_reason: str
    social_features: SocialFeatures
    onchain_features: OnChainFeatures
    alerts: List[Alert]
    influencer_signal: InfluencerSignal
    noise_filtered_pct: float
    duplicate_removed_pct: float
    velocity: float = 0.0

class HistoryEntry(BaseModel):
    timestamp: datetime
    final_score: float
    hype_phase: str
    confidence: str
    mentions: int
    avg_sentiment: float

class HistoryResponse(BaseModel):
    coin: str
    history: List[HistoryEntry]

class CoinsListResponse(BaseModel):
    coins: List[CoinSummary]
    total: int
    window_minutes: int
