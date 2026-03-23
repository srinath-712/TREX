import React, { useState } from 'react';
import { Clock, Zap, TrendingUp, History, ShieldCheck } from 'lucide-react';

export const HistoricalView = () => {
  const [activeTab, setActiveTab] = useState<'5YEAR' | 'CYCLES'>('5YEAR');

  const fiveYearData = [
    { coin: 'DOGE', high: '$0.73', growth: '36,500%', range: '$0.002 - $0.73', info: 'The original meme coin catalyst. Established the multi-billion dollar meme economy.' },
    { coin: 'SHIB', high: '$0.000088', growth: '1,000,000%+', range: '$0.0000000001 - $0.000088', info: 'Proven ecosystem play with L2 (Shibarium). The first major "Doge Killer".' },
    { coin: 'PEPE', high: '$0.000017', growth: '65,000%', range: '$0.00000002 - $0.000017', info: 'Revitalized Ethereum meme culture. Set new standards for organic community launches.' },
    { coin: 'WIF', high: '$4.85', growth: '485,000%', range: '$0.001 - $4.85', info: 'Leading the Solana meme revolution. Unprecedented speed to $1B market cap.' },
    { coin: 'FLOKI', high: '$0.00034', growth: '17,000%', range: '$0.00000002 - $0.00034', info: 'Transitioned from meme to utility-focused project with FlokiFi and Valhalla.' },
  ];

  const cycleData = [
    { 
      period: '2021: The Doge Era', 
      title: 'Elon\'s Parabola', 
      desc: 'Driven by retail frenzy and billionaire endorsements, DOGE hit $0.73. This cycle birthed SHIB and the concept of "Meme Seasons".',
      impact: 'High social dominance, mainstream awareness.'
    },
    { 
      period: '2023: The Frog Summer', 
      title: 'Pepe\'s Awakening', 
      desc: 'PEPE reached $1B+ in 19 days, proving that large-cap memes could still launch on ETH with zero taxes and no VCs.',
      impact: 'Pure organic momentum, high trading volume.'
    },
    { 
      period: '2023-2024: Solana Surge', 
      title: 'The Hat Cycle', 
      desc: 'WIF and BONK leveraged Solanas low fees to create hyper-active trading communities, rotating liquidity from ETH.',
      impact: 'Ecosystem growth, rapid valuation spikes.'
    },
  ];

  return (
    <div className="flex flex-col h-full gap-6 w-full max-w-6xl mx-auto">
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#e2e8f0] tracking-widest uppercase flex items-center gap-3">
            <ShieldCheck className="text-blue-400 w-6 h-6" /> HISTORICAL PROOF TERMINAL
          </h2>
          <p className="text-slate-500 mt-1 font-medium tracking-wide text-xs">Retroactive Performance & Cycle Analysis</p>
        </div>
        
        <div className="flex bg-[#131B2F] p-1 rounded-xl border border-[#2a3754]">
           <button 
             onClick={() => setActiveTab('5YEAR')}
             className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === '5YEAR' ? 'bg-[#1e293b] text-blue-400 border border-blue-500/30' : 'text-slate-500 hover:text-slate-300'}`}
           >
             5-YEAR PERFORMANCE
           </button>
           <button 
             onClick={() => setActiveTab('CYCLES')}
             className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'CYCLES' ? 'bg-[#1e293b] text-blue-400 border border-blue-500/30' : 'text-slate-500 hover:text-slate-300'}`}
           >
             SUPER CYCLES
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 min-h-0">
        {activeTab === '5YEAR' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {fiveYearData.map((d, i) => (
              <div key={i} className="bg-[#131B2F] border border-[#2a3754] rounded-2xl p-6 flex flex-col gap-4 shadow-xl hover:border-blue-500/20 transition-all group overflow-hidden relative">
                 <div className="absolute -right-4 -top-4 text-blue-500/5 rotate-12 transition-transform group-hover:scale-110">
                    <TrendingUp size={120} />
                 </div>
                 <div className="flex justify-between items-start z-10">
                   <div>
                     <h3 className="text-4xl font-black text-white font-mono">{d.coin}</h3>
                     <span className="text-[10px] uppercase font-bold text-blue-400 tracking-widest px-2 py-0.5 bg-blue-500/10 rounded">Apex Tier</span>
                   </div>
                   <div className="text-right">
                     <div className="text-emerald-400 font-black text-xl">{d.growth}</div>
                     <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Growth Peak</div>
                   </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 mt-2 z-10">
                    <div className="bg-[#1a233a] rounded-xl p-3 border border-[#2a3754]">
                       <span className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Historical High</span>
                       <span className="text-white font-mono font-bold text-lg">{d.high}</span>
                    </div>
                    <div className="bg-[#1a233a] rounded-xl p-3 border border-[#2a3754]">
                       <span className="block text-[10px] text-slate-500 font-bold uppercase mb-1">5-Year Range</span>
                       <span className="text-slate-400 font-mono text-xs">{d.range}</span>
                    </div>
                 </div>
                 <p className="text-slate-400 text-sm italic z-10 leading-relaxed">"{d.info}"</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4 max-w-4xl">
            {cycleData.map((c, i) => (
              <div key={i} className="bg-[#131B2F] border border-[#2a3754] rounded-2xl p-8 flex gap-8 items-start relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 bg-blue-500/10 rounded-bl-3xl">
                   <Zap className="text-blue-400" size={24} />
                </div>
                <div className="shrink-0 pt-2 border-r border-slate-800 pr-8 hidden md:block">
                   <Clock className="text-slate-600 mb-2" />
                   <div className="text-sm font-black text-slate-500 rotate-180 [writing-mode:vertical-lr]">{c.period}</div>
                </div>
                <div className="flex-1">
                   <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2 underline decoration-blue-500/40">{c.title}</h3>
                   <div className="md:hidden text-blue-400 font-bold text-xs mb-3 italic">{c.period}</div>
                   <p className="text-slate-400 text-lg mb-6 leading-relaxed italic">"{c.desc}"</p>
                   <div className="flex items-center gap-3">
                      <span className="text-[10px] text-slate-500 uppercase font-black px-2 py-1 bg-slate-800 rounded">Market Impact</span>
                      <span className="text-xs font-bold text-emerald-400 italic font-mono">{c.impact}</span>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
