import React, { useState } from 'react';

export const AlertsFeed = ({ alerts }: any) => {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const toggleExpand = (idx: number) => {
    setExpandedIdx(expandedIdx === idx ? null : idx);
  };

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
            const isExpanded = expandedIdx === idx;
            
            // Determine "Real" vs "Fake" status
            const hasVerification = alert.is_real !== undefined && alert.is_real !== null;
            const statusLabel = alert.is_real ? 'REAL' : 'FAKE';
            const statusColor = alert.is_real ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-rose-400 bg-rose-400/10 border-rose-400/20';

            return (
              <div 
                key={idx + alert.timestamp} 
                onClick={() => toggleExpand(idx)}
                className={`bg-[#1a233a] border p-3 rounded-lg flex flex-col group cursor-pointer transition-all ${isNewest ? 'animate-[bounce_0.5s_ease-out]' : ''} ${isExpanded ? 'border-slate-400' : 'border-slate-700/50 hover:border-slate-500'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{isWhale ? '🐋' : isMention ? '🔥' : '📈'}</span>
                    <span className={`text-sm font-medium ${isWhale ? 'text-blue-400' : isMention ? 'text-amber-400' : 'text-rose-400'}`}>
                      {alert.message}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {alert.timestamp && (
                      <span className="text-xs text-slate-500 font-mono">
                        {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                </div>
                
                {isExpanded && alert.reasoning && (
                  <div className="mt-3 pt-3 border-t border-slate-700/50 text-xs text-slate-300 leading-relaxed animate-in fade-in slide-in-from-top-1">
                    <div className="font-bold text-slate-400 mb-1 flex justify-between">
                      <span>VERIFICATION DETAILS</span>
                      <span className="text-[10px] text-slate-500">M: {alert.social_multiplier?.toFixed(1)}x | OC: {alert.onchain_multiplier?.toFixed(1)}x</span>
                    </div>
                    {alert.reasoning}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
