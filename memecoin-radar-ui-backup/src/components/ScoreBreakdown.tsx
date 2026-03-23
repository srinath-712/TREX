import React from 'react';

export const ScoreBreakdown = ({ trend }: any) => {
  if (!trend) return null;

  const socialScore = Math.round((((trend?.social_score || 0) + 1) / 2) * 100);
  const onchainScore = Math.round((trend?.onchain_score || 0) * 100);

  return (
    <div className="rounded-xl border border-[#2a3754] bg-[#131B2F] p-4 h-full flex flex-col shadow-lg overflow-hidden min-h-0">
      <div className="flex justify-between items-center mb-4 shrink-0 border-b border-slate-800 pb-2">
        <h3 className="text-slate-200 text-sm font-bold uppercase tracking-widest">Score Breakdown</h3>
        <div className="flex gap-1"><span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span><span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span><span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span></div>
      </div>

      <div className="flex justify-around items-center mb-4 flex-1">
        <div className="flex flex-col items-center relative">
          <div className="relative w-20 h-20">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <path strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1e293b" strokeWidth="4" />
              <path strokeDasharray={`${socialScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" className="drop-shadow-[0_0_4px_rgba(16,185,129,0.5)]" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold font-mono text-white tracking-tighter">{socialScore}</span>
              <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">High</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center relative">
          <div className="relative w-20 h-20">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <path strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1e293b" strokeWidth="4" />
              <path strokeDasharray={`${onchainScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" className="drop-shadow-[0_0_4px_rgba(59,130,246,0.5)]" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold font-mono text-white tracking-tighter">{onchainScore}</span>
              <span className="text-[9px] text-blue-400 font-bold uppercase tracking-wider">Strong</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 justify-end gap-3 mt-auto shrink-0">
        <div className="flex justify-between items-center text-sm">
          <span className="flex items-center gap-2 text-slate-300"><span className="text-blue-400">🌊</span> Mentions:</span>
          <span className="font-mono text-white font-bold">{trend?.social_features?.curr_mentions?.toLocaleString() || 0}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="flex items-center gap-2 text-slate-300"><span className="text-emerald-400">💳</span> Extrap. Vol:</span>
          <span className="font-mono text-white font-bold">~{Math.round((trend?.onchain_features?.volume_growth || 0)*100)}k</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="flex items-center gap-2 text-slate-300"><span className="text-emerald-500">👥</span> New Holders:</span>
          <span className="font-mono text-white font-bold">{(trend?.onchain_features?.holder_growth || 0) > 0 ? '+' : ''}{((trend?.onchain_features?.holder_growth || 0)*100).toFixed(0)}</span>
        </div>
      </div>
    </div>
  );
};
