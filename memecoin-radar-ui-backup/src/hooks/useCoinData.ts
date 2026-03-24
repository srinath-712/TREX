import { useState, useEffect, useCallback } from 'react';
import { fetchTrend, fetchHistory, fetchCoins } from '../api';
import { TrendResponse, HistoryResponse, CoinsListResponse } from '../types';

export function useCoinData(coin: string) {
  const [trend, setTrend] = useState<TrendResponse | null>(null);
  const [history, setHistory] = useState<HistoryResponse | null>(null);
  const [coins, setCoins] = useState<CoinsListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wsStatus, setWsStatus] = useState<string>('Connecting...');
  const [rotationTimer, setRotationTimer] = useState(0);

  // REST fallback for initial load
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
      setError(e?.response?.data?.detail || e.message || 'Failed to fetch REST data');
    } finally {
      setLoading(false);
    }
  }, [coin]);

  useEffect(() => { load(); }, [load]);

  // Rotation Timer & Data Refresh
  useEffect(() => {
    const ticker = setInterval(() => {
      setRotationTimer(prev => {
        if (prev >= 59) {
          // Trigger refresh on overflow
          fetchCoins().then(c => setCoins(c)).catch(console.error);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(ticker);
  }, []);

  // WebSocket Live Feed System
  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimer: any;
    let backoff = 1000;
    let isMounted = true;
    
    const connect = () => {
      if (!isMounted) return;
      // Fixed: WebSocket should connect to backend port 8000, not frontend 5173
      ws = new WebSocket('ws://localhost:8000/api/ws/feed');
      
      ws.onopen = () => {
        if (!isMounted) return;
        setWsStatus('Connected');
        backoff = 1000;
        console.log('WebSocket connected');
      };
      
      ws.onmessage = (event) => {
        if (!isMounted) return;
        try {
          const msg = JSON.parse(event.data);
          
          if (msg.coin !== coin) return;

          if (msg.type === 'score_update') {
            setTrend(prev => {
              if (!prev) return prev;
              return {
                ...prev,
                final_score: msg.data.final_score,
                social_score: msg.data.social_score,
                onchain_score: msg.data.onchain_score,
                hype_phase: msg.data.hype_phase,
                confidence: msg.data.confidence,
                gemini_analysis: msg.data.gemini_analysis,
                _flash: Date.now()
              } as any;
            });
            // Append to history for real-time chart growth
            setHistory(prev => {
              if (!prev) return prev;
              const newPoint = {
                timestamp: new Date().toISOString(),
                final_score: msg.data.final_score as number,
                social_score: (msg.data.social_score || 0) as number,
                mentions: (msg.data.social_score || 0) as number,
                onchain_score: (msg.data.onchain_score || 0) as number,
                hype_phase: (msg.data.hype_phase || 'STABLE') as string,
                confidence: (msg.data.confidence || 'LOW') as string,
                avg_sentiment: 0.5
              } as any;
              return {
                ...prev,
                history: [...prev.history, newPoint].slice(-100)
              };
            });
          } else if (msg.type === 'new_alert') {
            setTrend(prev => {
              if (!prev) return prev;
              return {
                ...prev,
                alerts: [msg.data, ...(prev.alerts || [])].slice(0, 50),
                _flashAlert: Date.now()
              } as any;
            });
          } else if (msg.type === 'phase_change') {
            setTrend(prev => {
              if (!prev) return prev;
              return { 
                ...prev, 
                hype_phase: msg.data.new_phase, 
                _flashPhase: Date.now()
              } as any;
            });
          }
        } catch (e) {
          console.error("WebSocket parsing error", e);
        }
      };
      
      ws.onclose = () => {
        if (!isMounted) return;
        const seconds = backoff / 1000;
        setWsStatus(`Reconnecting in ${seconds}s`);
        reconnectTimer = setTimeout(connect, backoff);
        backoff = Math.min(backoff * 2, 60000); // Increased backoff to 60s to match rotation cycle if needed
      };
      
      ws.onerror = () => {
        ws.close();
      };
    };
    
    connect();
    
    return () => {
      isMounted = false;
      clearTimeout(reconnectTimer);
      if (ws) {
        ws.onclose = null;
        ws.close();
      }
    };
  }, [coin]);

  return { trend, history, coins, loading, error, refresh: load, wsStatus, rotationTimer };
}
