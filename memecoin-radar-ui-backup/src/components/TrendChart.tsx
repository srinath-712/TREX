import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { HistoryResponse, Alert } from '../types';

interface Props {
  history: HistoryResponse | null;
  alerts: Alert[];
}

export const TrendChart: React.FC<Props> = ({ history, alerts }) => {
  if (!history || history.history.length === 0) {
    return <div style={{ height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>No history data available</div>;
  }

  const data = history.history.map(entry => {
    const d = new Date(entry.timestamp);
    const timeLabel = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    return {
      time: timeLabel,
      finalScore: entry.final_score * 100,
      sentiment: ((entry.avg_sentiment + 1) / 2) * 100, // Normalize -1..1 to 0..100
      mentions: entry.mentions > 0 ? (entry.mentions / 100) * 100 : 0, // Roughly normalized for visual scale
      rawTimestamp: entry.timestamp
    };
  });

  const spikeAlerts = alerts.filter(a => a.alert_type === 'MENTION_SPIKE' || a.alert_type === 'WHALE_SPIKE');
  let referenceLineTime = null;
  if (spikeAlerts.length > 0) {
    const alertTime = new Date(spikeAlerts[0].timestamp);
    referenceLineTime = `${alertTime.getHours().toString().padStart(2, '0')}:${alertTime.getMinutes().toString().padStart(2, '0')}`;
  }

  return (
    <div style={{ background: '#0f1629', border: '1px solid #1e2d4a', borderRadius: '12px', padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ fontSize: '16px', color: '#e2e8f0', marginBottom: '16px', fontWeight: 'bold' }}>TREND OVERVIEW | Last 24 Hours</h2>
      <div style={{ flex: 1, width: '100%', minHeight: '220px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4a" vertical={false} />
            <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
            <Tooltip
              contentStyle={{ background: '#0f1629', border: '1px solid #1e2d4a', borderRadius: '8px' }}
              itemStyle={{ fontSize: '14px' }}
              labelStyle={{ color: '#e2e8f0', marginBottom: '8px' }}
            />
            {referenceLineTime && (
              <ReferenceLine x={referenceLineTime} stroke="#ffffff" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Hype Surge Detected', fill: '#ffffff', fontSize: 12 }} />
            )}
            <Line type="monotone" dataKey="finalScore" name="Final Score" stroke="#00ff88" strokeWidth={2} dot={false} isAnimationActive={true} />
            <Line type="monotone" dataKey="sentiment" name="Sentiment" stroke="#4a9eff" strokeWidth={2} dot={false} isAnimationActive={true} />
            <Line type="monotone" dataKey="mentions" name="Mentions (norm)" stroke="#ff6b35" strokeWidth={2} dot={false} isAnimationActive={true} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
