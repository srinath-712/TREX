import React from 'react';

export const AlertsFeed = ({ alerts }: any) => {
  return (
    <div className="rounded-xl border border-[#2a3754] bg-[#131B2F] p-4 h-full flex flex-col shadow-lg overflow-hidden relative">
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h3 className="text-slate-200 text-sm font-bold uppercase tracking-widest">Latest Signals</h3>
        <div className="flex gap-1"><span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span><span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span><span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span></div>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-slate-700">
        {!alerts || alerts.length === 0 ? (
          <div className="text-slate-500 text-sm italic text-center py-4">No recent signals. 100% organic behavior.</div>
        ) : (
          alerts.map((alert: any, idx: number) => {
            const isWhale = alert.alert_type === 'WHALE_SPIKE';
            const isMention = alert.alert_type === 'MENTION_SPIKE';
            
            const isNewest = idx === 0;
            
            return (
              <div 
                key={idx + alert.timestamp} 
                className={`bg-[#1a233a] border border-slate-700/50 p-3 rounded-lg flex items-center justify-between group hover:border-slate-500 transition-all ${isNewest ? 'animate-[bounce_0.5s_ease-out]' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{isWhale ? '🐋' : isMention ? '🔥' : '📉'}</span>
                  <span className={`text-sm font-medium ${isWhale ? 'text-blue-400' : isMention ? 'text-amber-400' : 'text-rose-400'}`}>
                    {alert.message}
                  </span>
                </div>
                {alert.timestamp && (
                  <span className="text-xs text-slate-500 font-mono">
                    {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
