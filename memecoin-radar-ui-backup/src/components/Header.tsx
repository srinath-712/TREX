import React from 'react';

export const Header = ({ alerts, wsStatus }: { alerts?: any[], wsStatus?: string }) => {
  const latestAlert = alerts?.length && alerts.length > 0 ? alerts[0] : null;

  return (
    <header className="flex items-center justify-between shrink-0 h-10">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold tracking-widest text-[#e2e8f0]">TREX RADAR</h1>
        {wsStatus && wsStatus !== 'Connected' && (
           <span className="bg-rose-500/20 text-rose-400 border border-rose-500/50 px-3 py-1 rounded text-xs font-bold animate-pulse">
             🔴 {wsStatus}
           </span>
        )}
        {wsStatus === 'Connected' && (
           <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 px-3 py-1 rounded text-xs font-bold">
             🟢 LIVE FED
           </span>
        )}
      </div>

      {latestAlert && (
        <div className="flex items-center gap-2 px-5 py-2 rounded-lg bg-amber-500/90 text-slate-900 border border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
          <span className="font-bold">⚠️</span>
          <span className="text-sm font-bold tracking-wide">ALERT: {latestAlert.message}</span>
        </div>
      )}
    </header>
  );
};
