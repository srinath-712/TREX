import React, { useState } from 'react';
import { DashboardView } from './views/DashboardView';
import { WatchlistView } from './views/WatchlistView';
import { VelocityView } from './views/VelocityView';
import { HistoricalView } from './views/HistoricalView';

export default function App() {
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  
  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0c1220] flex text-slate-300 font-sans text-sm selection:bg-emerald-500/30">
      
      {/* Sidebar Navigation */}
      <div className="w-16 md:w-64 bg-[#0f1629] border-r border-slate-800/50 flex flex-col shrink-0 transition-all duration-300 z-50">
        <div className="h-16 flex items-center justify-center md:justify-start md:px-6 shrink-0 border-b border-slate-800/50">
           <span className="text-2xl">🦖</span>
           <span className="ml-3 text-lg font-bold tracking-widest text-[#e2e8f0] hidden md:block">TREX</span>
        </div>
        <nav className="flex-1 py-6 flex flex-col gap-2 px-2 md:px-4">
           {['DASHBOARD', 'WATCHLIST', 'VELOCITY', 'HISTORICAL'].map(tab => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === tab ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
             >
               <span className="text-xl">
                 {tab === 'DASHBOARD' ? '📊' : tab === 'WATCHLIST' ? '⭐' : tab === 'VELOCITY' ? '🚀' : '⏳'}
               </span>
               <span className="font-semibold tracking-wide hidden md:block">{tab}</span>
             </button>
           ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-[#0c1220] p-3 xl:p-6 overflow-y-auto xl:overflow-hidden">
        {activeTab === 'DASHBOARD' && <DashboardView />}
        {activeTab === 'WATCHLIST' && <WatchlistView />}
        {activeTab === 'VELOCITY' && <VelocityView />}
        {activeTab === 'HISTORICAL' && <HistoricalView />}
      </div>
    </div>
  );
}
