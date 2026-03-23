import React, { useState } from 'react';
import { useCoinData } from './hooks/useCoinData';
import { Header } from './components/Header';
import { CoinSelector } from './components/CoinSelector';
import { TrendChart } from './components/TrendChart';
import { ScoreBreakdown } from './components/ScoreBreakdown';
import { HypeAnalysis } from './components/HypeAnalysis';
import { InsightSummary } from './components/InsightSummary';
import { AlertsFeed } from './components/AlertsFeed';
import { RecentPosts } from './components/RecentPosts';

export default function App() {
  const [selectedCoin, setSelectedCoin] = useState('PEPE');
  const { trend, history, coins, loading, error, refresh } = useCoinData(selectedCoin);

  if (loading && !trend) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0e1a' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid #1e2d4a', borderTopColor: '#00ff88', borderRadius: '50%', animation: 'spin 1s linear infinite' }}>
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header alerts={trend ? trend.alerts : []} />
      
      {error && (
        <div style={{ background: '#ff3333', color: '#ffffff', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Error loading data: {error}</span>
          <button onClick={refresh} style={{ background: 'transparent', border: '1px solid #ffffff', color: '#ffffff', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Retry</button>
        </div>
      )}

      <CoinSelector 
        selectedCoin={selectedCoin} 
        onSelect={setSelectedCoin} 
        coinsList={coins ? coins.coins : []} 
      />

      {trend && (
        <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'stretch' }}>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <div style={{ flex: '3 1 600px', minWidth: 0 }}>
                <TrendChart history={history} alerts={trend.alerts} />
              </div>
              <div style={{ flex: '2 1 400px', minWidth: 0 }}>
                <HypeAnalysis trend={trend} />
              </div>
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              <ScoreBreakdown trend={trend} />
              <InsightSummary trend={trend} />
              <AlertsFeed trend={trend} />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <RecentPosts trend={trend} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
