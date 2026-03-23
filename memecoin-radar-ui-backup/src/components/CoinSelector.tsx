import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { CoinSummary } from '../types';

interface Props {
  selectedCoin: string;
  onSelect: (coin: string) => void;
  coinsList: CoinSummary[];
}

export const CoinSelector: React.FC<Props> = ({ selectedCoin, onSelect, coinsList }) => {
  const [inputVal, setInputVal] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onSelect(inputVal.trim().toUpperCase());
      setInputVal('');
    }
  };

  const getHypeColor = (phase: string) => {
    switch (phase) {
      case 'PEAK_HYPE': return '#00ff88';
      case 'EARLY_HYPE': return '#00cccc';
      case 'COOLING': return '#ff6b35';
      case 'DEAD': return '#ff3333';
      default: return '#64748b';
    }
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', maxWidth: '400px' }}>
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          background: '#0f1629',
          border: '1px solid #1e2d4a',
          borderRadius: '8px',
          padding: '8px 12px'
        }}>
          <Search size={18} color="#64748b" style={{ marginRight: '8px' }} />
          <input
            type="text"
            placeholder="Select Coin: e.g. PEPE"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#e2e8f0',
              outline: 'none',
              width: '100%',
              fontSize: '16px'
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            background: '#1e2d4a',
            color: '#e2e8f0',
            border: 'none',
            borderRadius: '8px',
            padding: '0 16px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Search
        </button>
      </form>

      {coinsList.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {coinsList.map(c => (
            <button
              key={c.coin}
              onClick={() => onSelect(c.coin)}
              style={{
                background: selectedCoin === c.coin ? '#1e2d4a' : '#0f1629',
                border: selectedCoin === c.coin ? '1px solid #00ff88' : '1px solid #1e2d4a',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#e2e8f0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span style={{ fontWeight: 'bold' }}>${c.coin}</span>
              <span style={{
                background: getHypeColor(c.hype_phase),
                color: '#1a1a1a',
                fontSize: '12px',
                padding: '2px 6px',
                borderRadius: '4px',
                fontWeight: 'bold'
              }}>
                {c.hype_phase.replace('_', ' ')}
              </span>
              <span style={{ color: '#00ff88', fontSize: '14px', fontWeight: 'bold' }}>
                {(c.final_score * 100).toFixed(0)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
