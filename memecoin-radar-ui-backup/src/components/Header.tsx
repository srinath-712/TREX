import React from 'react';

interface HeaderProps {
  alerts?: any[];
  wsStatus?: string;
  rotationTimer?: number;
}

export const Header = ({ alerts, wsStatus, rotationTimer }: HeaderProps) => {
  const latestAlert = alerts?.length && alerts.length > 0 ? alerts[0] : null;
  const isConnected = wsStatus === 'Connected';
  // If undefined, start at 1
  const displayTimer = rotationTimer !== undefined ? rotationTimer + 1 : 1;

  return (
    <header className="flex items-center justify-between shrink-0 h-10">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold tracking-widest text-[#e2e8f0]">TREX RADAR</h1>
        
        {/* Sync Status - counts from 1 to 59 every second */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-2 ${isConnected ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'} border px-3 py-1 rounded-lg`}>
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`}></span>
            <span className={`${isConnected ? 'text-emerald-400' : 'text-rose-400'} text-[10px] font-bold uppercase tracking-wider`}>
              {isConnected ? 'Live Fed' : 'Syncing'}
            </span>
            <div className={`w-[1px] h-3 ${isConnected ? 'bg-emerald-500/30' : 'bg-rose-500/30'} mx-1`}></div>
            <span className={`${isConnected ? 'text-emerald-500/70' : 'text-rose-500/70'} text-[10px] font-mono font-bold uppercase tracking-tight`}>
              {displayTimer.toString().padStart(2, '0')}s
            </span>
          </div>
        </div>
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
