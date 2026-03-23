import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const VelocityView = () => {
  const [coins, setCoins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVelocity = async () => {
      try {
        const { data } = await axios.get('/api/coins');
        // Sort explicitly by trajectory logic
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
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-2xl font-bold text-white tracking-widest uppercase flex items-center gap-3">
          <span className="p-2 bg-rose-500/20 text-rose-500 rounded-lg">🚀</span> Score Velocity Indicator
        </h2>
        <p className="text-slate-400 mt-2 max-w-3xl leading-relaxed">
          Velocity measures the rate of change per time-window: <code className="text-emerald-400 bg-emerald-400/10 px-1 rounded">(score_now - score_3_windows_ago) / 3</code>.
          This turns a static score into a predictive trajectory layout. Coins in EARLY_HYPE with strong velocity (↑↑) represent the highest priority alerts.
        </p>
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
