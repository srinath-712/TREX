import React from 'react';
import { Radio } from 'lucide-react';
import { Alert } from '../types';

interface HeaderProps {
  alerts: Alert[];
}

export const Header: React.FC<HeaderProps> = ({ alerts }) => {
  const hasHighAlert = alerts.some((a) => a.severity === 'HIGH');
  
  return (
    <header style={{
      width: '100%',
      background: '#0f1629',
      borderBottom: '1px solid #1e2d4a',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 24px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Radio size={24} color="#00ff88" />
        <h1 style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '20px' }}>AI MEME COIN RADAR</h1>
      </div>
      {hasHighAlert && (
        <div style={{
          background: '#ffd700',
          color: '#000000',
          padding: '6px 12px',
          borderRadius: '4px',
          fontWeight: 'bold',
          fontSize: '14px',
          animation: 'pulse 2s infinite'
        }}>
          <style>{`
            @keyframes pulse {
              0% { opacity: 1; }
              50% { opacity: 0.7; }
              100% { opacity: 1; }
            }
          `}</style>
          ⚠ ALERT: Potential Fake Hype Detected!
        </div>
      )}
    </header>
  );
};
