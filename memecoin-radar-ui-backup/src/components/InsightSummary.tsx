import React from 'react';

export const InsightSummary = ({ trend }: any) => {
  if (!trend) return null;

  const isLive = trend?.onchain_features?.source !== 'unavailable';
  const hasAlerts = trend?.alerts?.length > 0;
  
  return (
    <div className="rounded-xl border border-[#2a3754] bg-[#131B2F] p-4 flex flex-col shadow-lg overflow-hidden shrink-0 h-40">
      <div className="flex justify-between items-center mb-4 shrink-0 border-b border-slate-800 pb-2">
        <h3 className="text-slate-200 text-sm font-bold uppercase tracking-widest">Insight Summary</h3>
        <span className={`text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 ${isLive ? 'text-emerald-400' : 'text-slate-500'}`}>
          <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`}></span>
          Active Status: {isLive ? 'LIVE' : 'MOCK'}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-amber-400 font-semibold text-sm flex items-center gap-2">
          <span>🚀</span> {hasAlerts ? 'Warning: High Hype, Irregular Network Activity!' : 'Notice: Organic Sentiment Flow Detected'}
        </div>
        <div className="text-slate-300 text-sm">
          <span className="text-slate-500">• Risk Level:</span> {hasAlerts ? <span className="text-amber-500 font-bold">Moderate ⚠️</span> : <span className="text-emerald-400 font-bold">Low ✓</span>}
        </div>
        <div className="text-slate-300 text-sm truncate">
          <span className="text-slate-500">• Recommendation:</span> "{hasAlerts ? 'Caution: Likely Pump & Dump Activity' : 'Stable: Social trend aligns with on-chain metrics'}"
        </div>
      </div>
    </div>
  );
};
