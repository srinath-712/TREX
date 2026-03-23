import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, color, icon, trend }) => {
  return (
    <div style={{
      background: '#0f1629',
      border: '1px solid #1e2d4a',
      borderRadius: '12px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#64748b', fontSize: '14px', fontWeight: 600 }}>{title}</span>
        {icon && <span style={{ color: color || '#64748b' }}>{icon}</span>}
      </div>
      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e2e8f0' }}>
        {value}
      </div>
      {subtitle && (
        <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
          {trend === 'up' && <span style={{ color: '#00ff88' }}>↑</span>}
          {trend === 'down' && <span style={{ color: '#ff6b35' }}>↓</span>}
          {trend === 'neutral' && <span style={{ color: '#64748b' }}>-</span>}
          {subtitle}
        </div>
      )}
    </div>
  );
};
