import React from 'react';
import { TrendResponse } from '../types';

export const AlertsFeed: React.FC<{ trend: TrendResponse }> = ({ trend }) => {
  const alerts = trend.alerts.slice(0, 5);

  const getIcon = (type: string) => {
    switch(type) {
      case 'MENTION_SPIKE': return '🔥';
      case 'WHALE_SPIKE': return '🐋';
      case 'SENTIMENT_FLIP': return '📉';
      case 'VOLUME_SPIKE': return '📊';
      default: return '⚠️';
    }
  };

  const getColor = (sev: string) => {
    if (sev === 'HIGH') return '#ff3333';
    if (sev === 'MEDIUM') return '#ffd700';
    return '#64748b';
  };

  const getRelativeTime = (ts: string) => {
    const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 60000);
    return diff <= 0 ? 'Just now' : `${diff} mins ago`;
  };

  return (
    <div style={{ background: '#0f1629', border: '1px solid #1e2d4a', borderRadius: '12px', padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ fontSize: '16px', color: '#e2e8f0', marginBottom: '16px', fontWeight: 'bold' }}>LATEST SIGNALS</h2>
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px' }}>
        {alerts.length === 0 ? (
          <div style={{ color: '#64748b', fontSize: '14px', marginTop: 'auto', marginBottom: 'auto', textAlign: 'center' }}>No signals detected in this window</div>
        ) : (
          alerts.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', paddingBottom: '12px', borderBottom: i === alerts.length - 1 ? 'none' : '1px solid #1e2d4a' }}>
              <span style={{ fontSize: '20px' }}>{getIcon(a.alert_type)}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                <span style={{ color: '#e2e8f0', fontSize: '14px', lineHeight: '1.4' }}>
                  {a.message.length > 40 ? a.message.substring(0, 40) + '...' : a.message}
                </span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#64748b', fontSize: '12px' }}>{getRelativeTime(a.timestamp)}</span>
                  <span style={{ color: getColor(a.severity), fontSize: '10px', fontWeight: 'bold', border: `1px solid ${getColor(a.severity)}`, padding: '2px 6px', borderRadius: '4px' }}>
                    {a.severity}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
