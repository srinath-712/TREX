import React from 'react';

export const HypeAnalysis = ({ trend }: any) => {
  if (!trend) return null;

  const phase = (trend?.hype_phase || 'UNKNOWN').replace('_', ' ');
  const confidence = trend?.confidence || 'UNKNOWN';
  const isWhale = trend?.onchain_features?.whale_activity > 0;
  const isInfluencer = trend?.influencer_signal?.detected;

  return (
    <div className="rounded-xl border border-[#2a3754] bg-[#131B2F] p-4 h-full flex flex-col shadow-lg overflow-hidden">
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h3 className="text-slate-200 text-sm font-bold uppercase tracking-widest">Hype Analysis</h3>
        <div className="flex gap-1"><span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span><span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span><span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span></div>
      </div>

      <div className="flex flex-col flex-1 justify-center gap-2">
        {/* Phase Row */}
        <div key={(trend as any)?._flashPhase || 'b1'} className="flex justify-between items-center bg-[#1a233a] rounded-lg p-3 border border-slate-700/50 animate-[pulse_2s_ease-out]">
          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs shadow-inner">✓</span>
                <span className="text-slate-300 text-sm">Current Phase:</span>
                <span className="font-bold text-amber-500">{phase}</span>
              </div>
              <span className="text-xl">🚀</span>
            </div>
            {trend.gemini_analysis && (
              <p className="text-xs text-slate-400 pl-8 mt-1 border-l-2 border-amber-500/30 ml-3 italic">
                {trend.gemini_analysis.hype_analysis?.phase_explanation}
              </p>
            )}
          </div>
        </div>

        {/* Confidence Row */}
        <div className="flex justify-between items-center bg-[#1a233a] rounded-lg p-3 border border-slate-700/50">
          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs">✓</span>
                <span className="text-slate-300 text-sm">Confidence Level:</span>
                <span className={`font-bold ${confidence === 'HIGH' ? 'text-emerald-400' : confidence === 'MEDIUM' ? 'text-amber-400' : 'text-slate-400'}`}>
                  {confidence}
                </span>
              </div>
              <span className="text-xl">🛡️</span>
            </div>
            {trend.gemini_analysis && (
              <p className="text-xs text-slate-400 pl-8 mt-1 border-l-2 border-amber-500/30 ml-3 italic">
                {trend.gemini_analysis.hype_analysis?.confidence_notes}
              </p>
            )}
          </div>
        </div>

        {/* Whale Row */}
        <div className="flex justify-between items-center bg-[#1a233a] rounded-lg p-3 border border-slate-700/50">
          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs">🌊</span>
                <span className="text-slate-300 text-sm">Whale Activity:</span>
                <span className={`font-bold ${isWhale ? 'text-blue-400' : 'text-slate-500'}`}>{isWhale ? 'HIGH' : 'LOW'}</span>
              </div>
              <span className="text-xl">🐋</span>
            </div>
            {trend.gemini_analysis && (
              <p className="text-xs text-slate-400 pl-8 mt-1 border-l-2 border-blue-500/30 ml-3 italic">
                {trend.gemini_analysis.hype_analysis?.whale_notes}
              </p>
            )}
          </div>
        </div>

        {/* Influencer Row */}
        <div className="flex justify-between items-center bg-[#1a233a] rounded-lg p-3 border border-slate-700/50">
          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 text-xs">📣</span>
                <span className="text-slate-300 text-sm">Influencer Impact:</span>
                <span className={`font-bold ${isInfluencer ? 'text-rose-400' : 'text-slate-500'}`}>{isInfluencer ? 'STRONG' : 'WEAK'}</span>
              </div>
              <span className="text-xl">📢</span>
            </div>
            {trend.gemini_analysis && (
              <p className="text-xs text-slate-400 pl-8 mt-1 border-l-2 border-rose-500/30 ml-3 italic">
                {trend.gemini_analysis.hype_analysis?.influencer_notes}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
