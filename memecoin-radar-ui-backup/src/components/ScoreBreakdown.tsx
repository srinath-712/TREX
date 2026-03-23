import React from 'react';
import { TrendResponse } from '../types';

interface Props {
  trend: TrendResponse;
}

const Donut: React.FC<{ score: number; color: string; label: string }> = ({ score, color, label }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <svg width="80" height="80" viewBox="0 0 36 36">
        <path fill="none" stroke="#1e2d4a" strokeWidth="3" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
        <path fill="none" stroke={color} strokeWidth="3" strokeDasharray={`${score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          style={{ transition: 'stroke-dasharray 1s ease-out' }} />
        <text x="18" y="22" fill="#e2e8f0" fontSize="10" textAnchor="middle" fontWeight="bold">{score}</text>
      </svg>
      <span style={{ fontSize: '12px', color, fontWeight: 'bold' }}>{label}</span>
      <span style={{ fontSize: '10px', color: '#64748b' }}>Score</span>
    </div>
  );
};

export const ScoreBreakdown: React.FC<Props> = ({ trend }) => {
  const soc = Math.round(trend.social_score * 100);
  const onc = Math.round(trend.onchain_score * 100);
  
  const socLabel = soc > 66 ? 'HIGH' : soc > 33 ? 'MEDIUM' : 'LOW';
  const oncLabel = onc > 66 ? 'STRONG' : onc > 33 ? 'MODERATE' : 'WEAK';

  const formatMentions = (m: number) => m > 1000 ? `${(m / 1000).toFixed(1)}k` : m;

  return (
    <div style={{ background: '#0f1629', border: '1px solid #1e2d4a', borderRadius: '12px', padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Donut score={soc} color="#00ff88" label={socLabel} />
        <Donut score={onc} color="#4a9eff" label={oncLabel} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#64748b', fontSize: '14px' }}>🎯 Mentions</span>
          <span style={{ color: '#e2e8f0', fontWeight: 'bold' }}>{formatMentions(trend.social_features.curr_mentions)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#64748b', fontSize: '14px' }}>🐋 Transactions</span>
          <span style={{ color: '#e2e8f0', fontWeight: 'bold' }}>{(trend.onchain_features.whale_activity * 100).toFixed(0)}%</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#64748b', fontSize: '14px' }}>👥 New Holders</span>
          <span style={{ color: '#00ff88', fontWeight: 'bold' }}>+{(trend.onchain_features.holder_growth * 100).toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
};
