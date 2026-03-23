import React from 'react';
import { TrendResponse } from '../types';

export const HypeAnalysis: React.FC<{ trend: TrendResponse }> = ({ trend }) => {
  const getPhaseColor = () => {
    switch (trend.hype_phase) {
      case 'PEAK_HYPE':
      case 'EARLY_HYPE': return '#00ff88';
      case 'COOLING': return '#ff6b35';
      case 'DEAD': return '#ff3333';
      default: return '#64748b';
    }
  };

  const phaseEmoji = (trend.hype_phase === 'PEAK_HYPE' || trend.hype_phase === 'EARLY_HYPE') ? '🚀' :
                     (trend.hype_phase === 'COOLING' || trend.hype_phase === 'DEAD') ? '↓' : '';

  let confValue = '25%';
  if (trend.confidence === 'HIGH') confValue = '85%+';
  if (trend.confidence === 'MEDIUM') confValue = '50%';

  const whaleStr = trend.onchain_features.whale_activity > 0.6 ? 'HIGH' :
                   trend.onchain_features.whale_activity > 0.3 ? 'MODERATE' : 'LOW';

  const infStr = trend.influencer_signal.detected ? 'STRONG' : 'NONE';

  const Row = ({ label, value, color, emoji }: { label: string, value: string, color: string, emoji?: string }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #1e2d4a' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }}></div>
        <span style={{ color: '#64748b', fontSize: '14px' }}>{label}</span>
      </div>
      <span style={{ color: '#e2e8f0', fontWeight: 'bold', fontSize: '14px' }}>{value} {emoji}</span>
    </div>
  );

  return (
    <div style={{ background: '#0f1629', border: '1px solid #1e2d4a', borderRadius: '12px', padding: '24px', height: '100%' }}>
      <h2 style={{ fontSize: '16px', color: '#e2e8f0', marginBottom: '16px', fontWeight: 'bold' }}>HYPE ANALYSIS</h2>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Row label="Current Phase" value={trend.hype_phase.replace('_', ' ')} color={getPhaseColor()} emoji={phaseEmoji} />
        <Row label="Confidence Level" value={confValue} color="#4a9eff" emoji="🛡️" />
        <Row label="Whale Activity" value={whaleStr} color="#00ff88" emoji="🐋" />
        <Row label="Influencer Impact" value={infStr} color="#ffd700" emoji="📣" />
      </div>
    </div>
  );
};
