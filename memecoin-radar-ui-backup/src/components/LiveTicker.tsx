import React from 'react';

export const LiveTicker = ({ alerts }: { alerts?: any[] }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="w-full bg-rose-500/10 border-y border-rose-500/20 overflow-hidden relative flex items-center h-10">
      <div className="flex animate-[marquee_20s_linear_infinite] whitespace-nowrap">
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(100vw); }
            100% { transform: translateX(-100%); }
          }
        `}</style>
        {alerts.map((alert: any, idx: number) => (
          <span key={idx} className="mx-8 text-sm font-medium text-rose-400 tracking-wide flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shadow-[0_0_8px_#f43f5e]"></span>
            CRITICAL SIGNAL: {alert.message}
          </span>
        ))}
      </div>
    </div>
  );
};
