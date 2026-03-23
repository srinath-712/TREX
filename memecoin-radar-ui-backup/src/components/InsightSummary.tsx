import React from 'react';
import { TrendResponse } from '../types';

export const InsightSummary: React.FC<{ trend: TrendResponse }> = ({ trend }) => {
  let warning = null;
  if (trend.hype_phase === 'PEAK_HYPE' && trend.onchain_score < 0.4) {
    warning = "Warning: High Hype, Weak On-Chain Support!";
  }

  let risk = "Low 🟢";
  if (trend.final_score > 0.7) risk = "High 🔴";
  else if (trend.final_score >= 0.4) risk = "Moderate ⚠";

  let rec = "No unusual activity detected";
  let recColor = "#64748b";
  if (trend.influencer_signal.detected) {
    rec = "Caution: Likely Pump & Dump Activity";
    recColor = "#ff3333";
  } else if (trend.hype_phase === 'EARLY_HYPE') {
    rec = "Early opportunity — monitor closely";
    recColor = "#00ff88";
  }

  return (
    <div style={{ background: '#0f1629', border: '1px solid #1e2d4a', borderRadius: '12px', padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '16px', color: '#e2e8f0', fontWeight: 'bold' }}>INSIGHT SUMMARY</h2>
        <span style={{ color: '#00ff88', fontSize: '12px', fontWeight: 'bold' }}>● Active Status: LIVE</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'center' }}>
        {warning && (
          <div style={{ color: '#ff6b35', fontSize: '14px', fontWeight: 'bold' }}>🚀 {warning}</div>
        )}
        <div style={{ color: '#e2e8f0', fontSize: '14px', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#64748b' }}>Risk Level</span>
          <span style={{ fontWeight: 'bold' }}>{risk}</span>
        </div>
        <div style={{ color: recColor, fontSize: '14px', fontWeight: 'bold', borderLeft: `3px solid ${recColor}`, paddingLeft: '12px' }}>
          {rec}
        </div>
      </div>
    </div>
  );
};
