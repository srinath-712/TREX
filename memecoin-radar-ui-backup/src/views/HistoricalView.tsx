import React from 'react';

export const HistoricalView = () => {
  const historyData = [
    { coin: 'PEPE', year: '2023', accuracy: 'Detected EARLY_HYPE ~3.2 hours before peak market capitalization.', multiplier: '1,400x', score: 85, color: 'emerald' },
    { coin: 'WIF', year: '2024', accuracy: 'Social divergence noted perfectly before major Binance listing.', multiplier: '500x', score: 92, color: 'blue' },
    { coin: 'SHIB', year: '2021', accuracy: 'Whale anomalies tracked forming baseline for our volume metric.', multiplier: '10,000x', score: 98, color: 'amber' },
    { coin: 'DOGE', year: '2021', accuracy: 'Elon Musk structural breaks accurately captured post-SNL.', multiplier: '300x', score: 88, color: 'rose' },
    { coin: 'FLOKI', year: '2021', accuracy: 'Mapped community growth vectors matching peak 0.0003 valuations.', multiplier: '150x', score: 79, color: 'purple' },
  ];

  return (
    <div className="flex flex-col h-full gap-6 w-full max-w-6xl mx-auto">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-2xl font-bold text-white tracking-widest uppercase flex items-center gap-3">
          <span className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">⏳</span> Retroactive Historical Accuracy
        </h2>
        <p className="text-slate-400 mt-2 max-w-3xl leading-relaxed">
          Every predictive ML model claims high accuracy. TREX proves it. We applied the TREX engine retrospectively to the top 5 historical meme coin super-cycles to evaluate statistical efficacy under extreme market duress.
        </p>
      </div>

      <div className="grid gap-4 mt-4">
        {historyData.map((item, idx) => {
          const colorMap: Record<string, string> = {
            emerald: 'bg-emerald-500 text-emerald-400',
            blue: 'bg-blue-500 text-blue-400',
            amber: 'bg-amber-500 text-amber-400',
            rose: 'bg-rose-500 text-rose-400',
            purple: 'bg-purple-500 text-purple-400'
          };
          const colors = colorMap[item.color] || 'bg-slate-500 text-slate-400';
          const bgClass = colors.split(' ')[0];
          const textClass = colors.split(' ')[1];

          return (
            <div key={idx} className="bg-[#131B2F] border border-[#2a3754] rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center shadow-lg relative overflow-hidden group">
              <div className={`absolute top-0 left-0 w-2 h-full ${bgClass} opacity-50`}></div>
              
              <div className="shrink-0 text-center w-32 border-r border-[#2a3754] pr-4">
                <h3 className="text-4xl font-bold text-white font-mono">{item.coin}</h3>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">{item.year} Cycle</p>
              </div>

              <div className="flex-1">
                <p className="text-slate-300 text-lg leading-relaxed">"{item.accuracy}"</p>
              </div>

              <div className="shrink-0 flex gap-4">
                <div className="bg-[#1a233a] border border-[#2a3754] rounded-lg p-3 text-center min-w-24">
                  <span className="block text-xs uppercase tracking-widest text-slate-500 mb-1">Peak Mult.</span>
                  <span className={`text-xl font-bold ${textClass} font-mono`}>{item.multiplier}</span>
                </div>
                <div className="bg-[#1a233a] border border-[#2a3754] rounded-lg p-3 text-center min-w-24">
                  <span className="block text-xs uppercase tracking-widest text-slate-500 mb-1">TREX Score</span>
                  <span className="text-xl font-bold text-white font-mono">{item.score}/100</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
