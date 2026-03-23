import React from 'react';

export const TopScores = ({ trend }: any) => {
  const socialScore = Math.round((((trend?.social_score || 0) + 1) / 2) * 100);
  const onchainScore = Math.round((trend?.onchain_score || 0) * 100);

  return (
    <div key={(trend as any)?._flash || 'base'} className="flex gap-4 animate-[pulse_2s_ease-out]">
      <div className="flex items-center gap-3 bg-[#131B2F] border border-[#2a3754] rounded-lg px-6 py-2 transition-all shadow-[0_0_10px_rgba(16,185,129,0.1)]">
        <span className="text-xl">🔥</span>
        <span className="text-slate-300 text-sm font-medium">Social Score:</span>
        <span className="text-amber-500 text-lg font-bold font-mono">{socialScore}</span>
      </div>

      <div className="flex items-center gap-3 bg-[#131B2F] border border-[#2a3754] rounded-lg px-6 py-2">
        <span className="text-xl">🧊</span>
        <span className="text-slate-300 text-sm font-medium">On-Chain Score:</span>
        <span className="text-emerald-400 text-lg font-bold font-mono">{onchainScore}</span>
      </div>
    </div>
  );
};
