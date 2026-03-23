import React from 'react';

export const TrendChart = ({ history }: any) => {
  if (!history || history.length === 0) return (
    <div className="rounded-xl border border-[#2a3754] bg-[#131B2F] p-4 h-full flex flex-col justify-center items-center text-slate-500 shadow-lg">
      <div className="animate-pulse flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-600"></div>Gathering Signal...</div>
    </div>
  );

  const scores = history.map((entry: any) => entry.final_score);
  const min = Math.max(0, Math.min(...scores) - 0.2); // Add padding
  const max = Math.min(1, Math.max(...scores) + 0.2);
  const range = max - min || 1;

  const points = history.map((entry: any, i: number) => {
    const x = history.length > 1 ? (i / (history.length - 1)) * 100 : 50;
    const y = 100 - (((entry?.final_score || 0) - min) / range) * 100;
    return { x, y, isAlert: entry?.alerts && entry?.alerts.length > 0 };
  });

  const pathD = `M 0,${points[0] ? points[0].y : 50} L ${points.map((p: any) => `${p.x},${p.y}`).join(' L ')}`;
  const areaD = `${pathD} L 100,100 L 0,100 Z`;

  return (
    <div className="rounded-xl border border-[#2a3754] bg-[#131B2F] p-4 h-full flex flex-col shadow-lg overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <h3 className="text-slate-200 text-sm font-bold uppercase tracking-widest">Trend Overview</h3>
        <div className="h-4 w-[1px] bg-slate-600"></div>
        <span className="text-xs text-slate-400">Last 24 Hours</span>
      </div>

      {/* Embedded Chart */}
      <div className="flex-1 relative w-full h-full min-h-0">
        <svg viewBox="-2 -5 104 110" preserveAspectRatio="none" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(16, 185, 129, 0.2)" />
              <stop offset="100%" stopColor="rgba(16, 185, 129, 0.0)" />
            </linearGradient>
            <filter id="glowChart" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid Lines */}
          {[0, 25, 50, 75, 100].map(y => (
            <line key={`grid-${y}`} x1="0" y1={y} x2="100" y2={y} stroke="#1e293b" strokeWidth="0.5" />
          ))}

          {/* Area Fill */}
          <path d={areaD} fill="url(#chartGradient)" />

          {/* Line Path */}
          <path d={pathD} fill="none" stroke="#10b981" strokeWidth="1.5" vectorEffect="non-scaling-stroke" filter="url(#glowChart)" className="drop-shadow-lg" />

          {/* Alert Spikes */}
          {points.filter((p: any) => p.isAlert).map((p: any, i: number) => (
             <g key={i}>
                <line x1={p.x} y1="100" x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" strokeDasharray="1,1" />
                <circle cx={p.x} cy={p.y} r="2.5" fill="#f8fafc" filter="url(#glowChart)" />
             </g>
          ))}
        </svg>

        {/* Mock X-Axis Labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[9px] text-slate-500 px-1 transform translate-y-4">
          <span>10:00</span><span>15:00</span><span>23:00</span><span>8:00</span><span>11:00</span><span>12:00</span><span className="text-emerald-400 font-bold">LIVE</span>
        </div>
      </div>
    </div>
  );
};
