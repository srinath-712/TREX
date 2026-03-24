import React, { useState, useMemo } from 'react';

export const TrendChart = ({ history }: any) => {
  const [activeTimeframe, setActiveTimeframe] = useState<'15M' | '30M'>('30M');

  const filteredHistory = useMemo(() => {
    if (!history || history.length === 0) return [];
    
    const now = new Date().getTime();
    const limitMs = activeTimeframe === '15M' ? 15 * 60 * 1000 : 30 * 60 * 1000;
    const startTimeBoundary = now - limitMs;

    const filtered = history.filter((entry: any) => {
      const entryTime = new Date(entry.timestamp).getTime();
      return entryTime >= startTimeBoundary;
    });

    return filtered.length > 0 ? filtered : [history[history.length - 1]];
  }, [history, activeTimeframe]);

  if (!filteredHistory || filteredHistory.length === 0) return (
    <div className="rounded-xl border border-[#2a3754] bg-[#131B2F] p-4 h-full flex flex-col justify-center items-center text-slate-500 shadow-lg font-mono uppercase tracking-widest text-xs">
      <div className="animate-pulse flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
        Syncing Neural Feed...
      </div>
    </div>
  );

  const scores = filteredHistory.map((entry: any) => entry.mentions || entry.final_score || 0);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  const range = (maxScore - minScore) || 1;
  const padding = range * 0.15;
  const min = Math.max(0, minScore - padding);
  const max = maxScore + padding;
  const currentRange = max - min;

  const points = filteredHistory.map((entry: any, i: number) => {
    // STRETCH: Use index based X to fill the container regardless of density
    const x = filteredHistory.length > 1 ? (i / (filteredHistory.length - 1)) * 100 : 50;
    const val = entry.mentions || entry.final_score || 0;
    const y = 100 - ((val - min) / currentRange) * 100;
    return { x, y, isAlert: entry?.alerts && entry?.alerts.length > 0 };
  });

  const pathD = points.length > 0 
    ? `M ${points[0].x},${points[0].y} L ${points.map((p: any) => `${p.x},${p.y}`).join(' L ')}`
    : '';
  const areaD = points.length > 0 
    ? `${pathD} L ${points[points.length-1].x},100 L ${points[0].x},100 Z`
    : '';

  const generateLabels = () => {
    if (filteredHistory.length < 2) return [<span key="live" className="text-emerald-400 font-bold">LIVE-FEED</span>];
    const labels = [];
    const count = 4;
    for (let i = 0; i <= count; i++) {
        const entry = filteredHistory[Math.floor((filteredHistory.length - 1) * (i / count))];
        const time = new Date(entry.timestamp);
        const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        labels.push(
            <span key={i} className={i === count ? "text-emerald-400 font-bold" : ""}>
                {i === count ? "LIVE" : timeString}
            </span>
        );
    }
    return labels;
  };

  return (
    <div className="rounded-xl border border-[#2a3754] bg-[#131B2F] p-4 h-full flex flex-col shadow-lg overflow-hidden relative group">
      {/* Header with Axis Titles */}
      <div className="flex items-center justify-between mb-4 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <h3 className="text-slate-200 text-xs font-black uppercase tracking-[0.2em] whitespace-nowrap">Trend Evolution</h3>
            <span className="text-[9px] text-emerald-500/70 font-bold uppercase tracking-widest mt-0.5">Y-Axis: Mentions / X-Axis: Time</span>
          </div>
        </div>
        
        <div className="flex gap-1 bg-[#0c1220] p-1 rounded-lg border border-slate-800/50">
           {(['15M', '30M'] as const).map(tf => (
               <button 
                 key={tf} 
                 onClick={() => setActiveTimeframe(tf)}
                 className={`text-[9px] font-black px-2.5 py-1 rounded-md transition-all uppercase tracking-tighter ${activeTimeframe === tf ? 'bg-emerald-500 text-[#0c1220] shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'text-slate-500 hover:text-slate-300'}`}
               >
                 {tf}
               </button>
           ))}
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="flex-1 w-full relative mt-2 pt-2">
        {/* Internal Y Axis Label */}
        <div className="absolute left-[-20px] top-1/2 -rotate-90 -translate-y-1/2 text-[8px] font-bold text-slate-600 tracking-[0.3em] pointer-events-none uppercase">Mentions</div>
        {/* Internal X Axis Label */}
        <div className="absolute bottom-[-15px] right-2 text-[8px] font-bold text-slate-600 tracking-[0.3em] pointer-events-none uppercase">Time Sequence</div>

        <svg viewBox="-2 -5 104 110" preserveAspectRatio="none" className="w-full h-[85%] overflow-visible absolute inset-0">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(16, 185, 129, 0.25)" />
              <stop offset="100%" stopColor="rgba(16, 185, 129, 0.0)" />
            </linearGradient>
            <filter id="glowChart" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid System */}
          {[0, 25, 50, 75, 100].map(y => (
            <line key={`grid-${y}`} x1="0" y1={y} x2="100" y2={y} stroke="#1e293b" strokeWidth="0.3" strokeDasharray="2,2" />
          ))}

          {filteredHistory.length > 1 && pathD && (
            <>
              <path d={areaD} fill="url(#chartGradient)" />
              <path d={pathD} fill="none" stroke="#10b981" strokeWidth="2.5" vectorEffect="non-scaling-stroke" filter="url(#glowChart)" className="drop-shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
              
              {/* Data Points */}
              {points.map((p: any, i: number) => (
                (i === 0 || i === points.length - 1 || i % Math.max(1, Math.floor(points.length/10)) === 0) && (
                   <circle key={i} cx={p.x} cy={p.y} r="1.2" fill="#10b981" />
                )
              ))}
            </>
          )}

          {/* Critical Alerts */}
          {points.filter((p: any) => p.isAlert).map((p: any, i: number) => (
             <g key={i}>
                <line x1={p.x} y1="100" x2={p.x} y2={p.y} stroke="#f8fafc" strokeWidth="0.5" strokeDasharray="1,1" opacity="0.3" />
                <circle cx={p.x} cy={p.y} r="3" fill="#f8fafc" filter="url(#glowChart)" />
             </g>
          ))}
        </svg>

        {/* X-Axis Timeline */}
        <div className="absolute bottom-[5%] left-0 right-0 flex justify-between text-[8px] text-slate-500 px-1 py-1.5 border-t border-slate-800/50 bg-[#0c1220]/40 font-mono">
          {generateLabels()}
        </div>
      </div>
    </div>
  );
};
