import React from 'react';

export const TopSummaryGrid = ({ trend }: any) => {
  if (!trend) return null;

  const score = Math.round((trend?.final_score || 0) * 100);
  const phase = (trend?.hype_phase || 'UNKNOWN').replace('_', ' ');
  const whaleActive = trend?.onchain_features?.whale_activity > 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 mt-8">
      {/* Score Card */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-800/60 bg-gray-900/80 p-6 backdrop-blur-md group">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl transition-opacity group-hover:bg-emerald-500/20"></div>
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2">Trend Score</p>
        <div className="flex items-end gap-2 relative z-10">
          <span className="text-4xl font-mono font-bold text-white tracking-tighter drop-shadow-md">{score}</span>
          <span className="text-emerald-400 text-sm font-medium mb-1">/ 100</span>
        </div>
      </div>

      {/* Hype Phase Card */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-800/60 bg-gray-900/80 p-6 backdrop-blur-md">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl"></div>
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2">Hype Phase</p>
        <span className="text-2xl font-bold text-amber-400 tracking-tight relative z-10">{phase}</span>
      </div>

      {/* Confidence Card */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-800/60 bg-gray-900/80 p-6 backdrop-blur-md">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2">Confidence</p>
        <span className={`text-2xl font-bold tracking-tight relative z-10 ${trend.confidence === 'HIGH' ? 'text-emerald-400' : trend.confidence === 'MEDIUM' ? 'text-amber-400' : 'text-gray-400'}`}>
          {trend.confidence}
        </span>
      </div>

      {/* Whale Activity Card */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-800/60 bg-gray-900/80 p-6 backdrop-blur-md">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2">Whale Activity</p>
        <span className={`text-2xl font-bold tracking-tight relative z-10 ${whaleActive ? 'text-purple-400' : 'text-gray-500'}`}>
          {whaleActive ? 'SURGING' : 'DORMANT'}
        </span>
      </div>
    </div>
  );
};
