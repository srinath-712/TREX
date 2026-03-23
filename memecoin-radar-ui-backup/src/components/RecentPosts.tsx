import React from 'react';
import { TrendResponse } from '../types';

export const RecentPosts: React.FC<{ trend: TrendResponse }> = ({ trend }) => {
  const getTemplates = () => {
    const coin = trend.coin;
    if (trend.social_features.avg_sentiment > 0.3) {
      return [
        `$${coin} is breaking out! Don't miss this one! 🚀`,
        `Just loaded my bags with more $${coin}. The chart looks completely parabolic right now.`,
        `Everyone is talking about $${coin}. Volume is insane!`
      ];
    } else if (trend.social_features.avg_sentiment < -0.3) {
      return [
        `$${coin} looks like it's bleeding out. Support is broken.`,
        `Getting out of $${coin} before the whales dump completely.`,
        `The hype on $${coin} died faster than I expected. Sad!`
      ];
    }
    return [
      `Watching $${coin} closely. It could go either way here.`,
      `Consolidation on the $${coin} chart. Waiting for confirmation.`,
      `$${coin} mentions are steady. Let's see if the team delivers.`
    ];
  };

  const templates = getTemplates();
  const colors = ['#00ff88', '#4a9eff', '#ff6b35', '#ffd700'];

  return (
    <div style={{ background: '#0f1629', border: '1px solid #1e2d4a', borderRadius: '12px', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '16px', color: '#e2e8f0', fontWeight: 'bold' }}>RECENT POSTS</h2>
        <div style={{ display: 'flex', gap: '8px', color: '#64748b' }}>
          <span>X / R</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {templates.map((txt, i) => (
          <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', background: '#0a0e1a', padding: '16px', borderRadius: '8px', border: '1px solid #1e2d4a' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: colors[i % colors.length], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a0e1a', fontWeight: 'bold', flexShrink: 0 }}>
              U{i+1}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ color: '#64748b', fontSize: '14px', fontWeight: 'bold' }}>@CryptoUser{i+1}</span>
              <span style={{ color: '#e2e8f0', fontSize: '15px', lineHeight: '1.4' }}>"{txt}"</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', color: '#64748b', fontSize: '12px', marginTop: '20px', fontStyle: 'italic' }}>
        Live post data requires direct social API access
      </div>
    </div>
  );
};
