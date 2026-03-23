import { useState, useEffect, useCallback } from 'react';
import { fetchTrend, fetchHistory, fetchCoins } from '../api';
import { TrendResponse, HistoryResponse, CoinsListResponse } from '../types';

export function useCoinData(coin: string) {
  const [trend, setTrend] = useState<TrendResponse | null>(null);
  const [history, setHistory] = useState<HistoryResponse | null>(null);
  const [coins, setCoins] = useState<CoinsListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!coin) return;
    setLoading(true);
    setError(null);
    try {
      const [t, h, c] = await Promise.all([
        fetchTrend(coin),
        fetchHistory(coin),
        fetchCoins(),
      ]);
      setTrend(t);
      setHistory(h);
      setCoins(c);
    } catch (e: any) {
      setError(e?.response?.data?.detail || e.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [coin]);

  useEffect(() => { load(); }, [load]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, [load]);

  return { trend, history, coins, loading, error, refresh: load };
}
