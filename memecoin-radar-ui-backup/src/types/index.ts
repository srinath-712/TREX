export interface SocialFeatures {
  coin: string;
  mention_growth: number;
  avg_sentiment: number;
  engagement_score: number;
  sentiment_momentum: number;
  curr_mentions: number;
  prev_mentions: number;
  total_posts: number;
  noise_filtered_count: number;
  duplicate_removed_count: number;
}

export interface OnChainFeatures {
  coin: string;
  whale_activity: number;
  volume_growth: number;
  holder_growth: number;
  buy_sell_ratio: number | null;
}

export interface Alert {
  coin: string;
  alert_type: 'MENTION_SPIKE' | 'SENTIMENT_FLIP' | 'WHALE_SPIKE' | 'VOLUME_SPIKE';
  message: string;
  timestamp: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface InfluencerSignal {
  coin: string;
  detected: boolean;
  message: string;
  spike_post_id: string | null;
  spike_engagement: number | null;
  mean_engagement: number | null;
}

export interface TrendResponse {
  coin: string;
  final_score: number;
  social_score: number;
  onchain_score: number;
  hype_phase: 'EARLY_HYPE' | 'PEAK_HYPE' | 'COOLING' | 'DEAD' | 'UNKNOWN';
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  confidence_reason: string;
  social_features: SocialFeatures;
  onchain_features: OnChainFeatures;
  alerts: Alert[];
  influencer_signal: InfluencerSignal;
  noise_filtered_pct: number;
  duplicate_removed_pct: number;
}

export interface CoinSummary {
  coin: string;
  final_score: number;
  hype_phase: string;
  confidence: string;
  alerts: Alert[];
  influencer_signal: InfluencerSignal;
  noise_filtered_pct: number;
  duplicate_removed_pct: number;
}

export interface CoinsListResponse {
  coins: CoinSummary[];
  total: number;
  window_minutes: number;
}

export interface HistoryEntry {
  timestamp: string;
  final_score: number;
  hype_phase: string;
  confidence: string;
  mentions: number;
  avg_sentiment: number;
}

export interface HistoryResponse {
  coin: string;
  history: HistoryEntry[];
}
