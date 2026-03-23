import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Gauge } from 'lucide-react';

export const VelocityView = () => {
  const [coins, setCoins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVelocity = async () => {
      try {
        const { data } = await axios.get('/api/coins');
        const sorted = (data.coins || []).sort((a: any, b: any) => (b.velocity || 0) - (a.velocity || 0));
        setCoins(sorted);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchVelocity();
  }, []);

  return (
    <div className="flex flex-col h-full gap-6 w-full max-w-6xl mx-auto">
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-[#e2e8f0] tracking-widest uppercase flex items-center gap-3">
              <Gauge className="text-emerald-500 w-6 h-6" /> CORE VELOCITY MATRIX
            </h2>
            <p className="text-slate-500 mt-1 font-medium tracking-wide text-xs">Technical Momentum & Trend Acceleration Analysis</p>
          </div>
          <div className="hidden md:flex flex-col items-end">
             <span className="text-[10px] text-slate-500 uppercase tracking-widest">Update Frequency</span>
             <span className="text-xs font-mono text-emerald-400 font-bold">1-Minute Refresh Cycle</span>
          </div>
        </div>

        {/* Indicator Glossary / Hints */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
           <div className="bg-[#131B2F] border border-[#2a3754] p-3 rounded-xl">
              <div className="text-emerald-400 font-black text-xl mb-1">↑↑</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Supermassive</div>
              <div className="text-[9px] text-slate-400 leading-tight mt-1">Extreme acceleration. Usually precedes massive breakout.</div>
           </div>
           <div className="bg-[#131B2F] border border-[#2a3754] p-3 rounded-xl">
              <div className="text-emerald-500 font-black text-xl mb-1">↑</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Steady Ascent</div>
              <div className="text-[9px] text-slate-400 leading-tight mt-1">Healthy organic growth in mentions & score.</div>
           </div>
           <div className="bg-[#131B2F] border border-[#2a3754] p-3 rounded-xl">
              <div className="text-slate-500 font-black text-xl mb-1">→</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Base Consolidation</div>
              <div className="text-[9px] text-slate-400 leading-tight mt-1">Neutral momentum. Typical during accumulation phases.</div>
           </div>
           <div className="bg-[#131B2F] border border-[#2a3754] p-3 rounded-xl">
              <div className="text-rose-400 font-black text-xl mb-1">↓</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Correction</div>
              <div className="text-[9px] text-slate-400 leading-tight mt-1">Minor pull-back in social dominance or pricing.</div>
           </div>
           <div className="bg-[#131B2F] border border-[#2a3754] p-3 rounded-xl">
              <div className="text-rose-600 font-black text-xl mb-1">↓↓</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Freefall</div>
              <div className="text-[9px] text-slate-400 leading-tight mt-1">Severe exhaustion. Indicates a possible trend reversal.</div>
           </div>
        </div>
      </div>

      <div className="flex-1">
        {loading ? (
           <div className="flex justify-center items-center py-20"><div className="w-8 h-8 rounded-full border-2 border-slate-600 border-t-emerald-500 animate-spin"></div></div>
        ) : (
           <div className="grid gap-4">
             {/* Header Row */}
             <div className="grid grid-cols-12 gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest px-4">
                <div className="col-span-2">Asset</div>
                <div className="col-span-2 text-center">Score</div>
                <div className="col-span-3">Hype State</div>
                <div className="col-span-3">Velocity Matrix</div>
                <div className="col-span-2 text-right">Raw Delta</div>
             </div>

             {/* Coins Rows */}
             {coins.map((coin: any, i: number) => {
               const vel = coin.velocity || 0;
               const isStrongRising = vel > 0.05;
               const isRising = vel > 0 && vel <= 0.05;
               const isStrongFalling = vel < -0.05;
               const isFalling = vel < 0 && vel >= -0.05;

               return (
                 <div key={coin.coin} className="bg-[#131B2F] border border-[#2a3754] rounded-lg p-4 grid grid-cols-12 gap-4 items-center shadow-md hover:border-emerald-500/30 transition-colors">
                   <div className="col-span-2 text-xl font-bold text-white font-mono tracking-wider">{coin.coin}</div>
                   <div className="col-span-2 text-center font-mono text-lg text-slate-300">{Math.round(coin.final_score * 100)}</div>
                   <div className="col-span-3">
                     <span className={`px-3 py-1 rounded text-xs font-bold ${coin.hype_phase === 'EARLY HYPE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-amber-400'}`}>
                       {coin.hype_phase.replace('_', ' ')}
                     </span>
                   </div>
                   <div className="col-span-3 flex items-center gap-3">
                     <div className={`flex items-center justify-center w-12 h-12 rounded-lg text-2xl shadow-inner
                       ${isStrongRising ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                         isRising ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                         isStrongFalling ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30' : 
                         isFalling ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 
                         'bg-slate-800 text-slate-500 border border-slate-700'}`}>
                        {isStrongRising ? '↑↑' : isRising ? '↑' : isStrongFalling ? '↓↓' : isFalling ? '↓' : '→'}
                     </div>
                     <div className="text-sm font-medium text-slate-400">
                        {isStrongRising ? 'Strong Rising' : isRising ? 'Rising' : isStrongFalling ? 'Strong Falling' : isFalling ? 'Falling' : 'Flat'}
                     </div>
                   </div>
                   <div className="col-span-2 text-right font-mono text-sm text-slate-400">
                     {vel > 0 ? '+' : ''}{(vel * 100).toFixed(2)} pts/w
                   </div>
                 </div>
               );
             })}
           </div>
        )}
      </div>
    </div>
  );
};
