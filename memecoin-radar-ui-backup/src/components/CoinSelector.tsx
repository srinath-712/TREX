import React from 'react';

export const CoinSelector = ({ selectedCoin, onSelect, coinsList = [] }: any) => {
  // If API hasn't returned coins yet, use default fallbacks
  const availableCoins = coinsList.length > 0 
    ? coinsList.map((c: any) => c.coin) 
    : ['PEPE', 'SHIB', 'DOGE'];

  // Ensure the selected coin is always in the list even if it drops out of top 5
  if (!availableCoins.includes(selectedCoin)) {
    availableCoins.push(selectedCoin);
  }

  return (
    <div className="flex relative w-80 shrink-0">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <select
        value={selectedCoin}
        onChange={(e) => onSelect(e.target.value)}
        className="block w-full pl-10 pr-10 py-2 border border-[#2a3754] rounded-lg leading-5 bg-[#131B2F] text-slate-100 font-bold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 sm:text-sm transition-colors cursor-pointer appearance-none"
      >
        {availableCoins.map((coin: string) => (
          <option key={coin} value={coin}>
            {coin} (Top Radar Match)
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};
