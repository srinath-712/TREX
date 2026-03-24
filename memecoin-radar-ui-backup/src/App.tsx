import React, { useState } from 'react';
import { DashboardView } from './views/DashboardView';
import { WatchlistView } from './views/WatchlistView';
import { VelocityView } from './views/VelocityView';
import { HistoricalView } from './views/HistoricalView';
import { ChatView } from './views/ChatView';
import { LayoutGrid, Eye, Gauge, ShieldCheck, Settings, HelpCircle, User, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [supportOpen, setSupportOpen] = useState(false);
  
  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0c1220] flex text-slate-300 font-sans text-sm selection:bg-emerald-500/30">
      
      {/* Sidebar Navigation */}
      <div className="w-16 md:w-64 bg-[#111822] border-r border-slate-800/50 flex flex-col shrink-0 transition-all duration-300 z-50">
        <div className="h-20 flex items-center justify-center md:justify-start md:px-6 shrink-0 border-b border-slate-800/50">
           <span className="text-3xl">🦖</span>
           <div className="ml-3 hidden md:flex flex-col">
             <span className="text-lg font-bold tracking-widest text-[#e2e8f0]">TREX Analytics</span>
             <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Terminal V2.4.0</span>
           </div>
        </div>
        
        <nav className="flex-1 py-4 flex flex-col gap-1 w-full">
           <button onClick={() => setActiveTab('DASHBOARD')} className={`flex items-center gap-3 px-6 py-3 w-full transition-colors ${activeTab === 'DASHBOARD' ? 'bg-[#1e293b]/70 border-r-[3px] border-[#6a9bf6] text-slate-200' : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border-r-[3px] border-transparent'}`}>
             <LayoutGrid className="w-5 h-5" />
             <span className="font-medium text-sm hidden md:block">Dashboard</span>
           </button>
           
           <button onClick={() => setActiveTab('WATCHLIST')} className={`flex items-center gap-3 px-6 py-3 w-full transition-colors ${activeTab === 'WATCHLIST' ? 'bg-[#1e293b]/70 border-r-[3px] border-[#6a9bf6] text-slate-200' : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border-r-[3px] border-transparent'}`}>
             <Eye className="w-5 h-5" />
             <span className="font-medium text-sm hidden md:block">Watchlist</span>
           </button>
           
           <button onClick={() => setActiveTab('VELOCITY')} className={`flex items-center gap-3 px-6 py-3 w-full transition-colors ${activeTab === 'VELOCITY' ? 'bg-[#1e293b]/70 border-r-[3px] border-[#6a9bf6] text-slate-200' : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border-r-[3px] border-transparent'}`}>
             <Gauge className="w-5 h-5" />
             <span className="font-medium text-sm hidden md:block">Velocity Tracker</span>
           </button>
           
           <button onClick={() => setActiveTab('HISTORICAL')} className={`flex items-center gap-3 px-6 py-3 w-full transition-colors ${activeTab === 'HISTORICAL' ? 'bg-[#1e293b]/70 border-r-[3px] border-[#6a9bf6] text-slate-200' : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border-r-[3px] border-transparent'}`}>
             <ShieldCheck className="w-5 h-5" />
             <span className="font-medium text-sm hidden md:block">Historical Proof</span>
           </button>
           
           <button onClick={() => setActiveTab('AI_CHAT')} className={`flex items-center gap-3 px-6 py-3 w-full transition-colors ${activeTab === 'AI_CHAT' ? 'bg-[#1e293b]/70 border-r-[3px] border-[#818cf8] text-indigo-400' : 'text-slate-400 hover:bg-slate-800/40 hover:text-indigo-400 border-r-[3px] border-transparent'}`}>
             <Sparkles className="w-5 h-5 text-indigo-500" />
             <span className="font-bold text-sm hidden md:block uppercase tracking-widest text-indigo-400">TREX AI</span>
           </button>
        </nav>

        <div className="mt-auto flex flex-col px-4 pb-6 w-full hidden md:flex">
            <button 
              onClick={() => setActiveTab('UPGRADE')}
              className="w-full bg-[#6a9bf6] hover:bg-[#5b8ae6] text-slate-900 font-semibold py-2 rounded-md transition-colors mb-6 text-sm shadow-[0_0_15px_rgba(106,155,246,0.2)]"
            >
              Upgrade to Pro
            </button>
            
            <div className="flex flex-col gap-1 mb-6">
               <button className="flex items-center gap-3 px-2 py-2 text-slate-400 hover:text-slate-200 transition-colors w-full text-left">
                 <Settings className="w-4 h-4" />
                 <span className="font-medium text-sm">Settings</span>
               </button>
               
               <div className="flex flex-col w-full relative">
                 <button onClick={() => setSupportOpen(!supportOpen)} className="flex items-center gap-3 px-2 py-2 text-slate-400 hover:text-slate-200 transition-colors w-full text-left">
                   <HelpCircle className="w-4 h-4" />
                   <span className="font-medium text-sm">Support</span>
                 </button>
                 {supportOpen && (
                   <div className="flex flex-col rounded-md overflow-hidden bg-[#1a2333] border border-slate-700/50 mt-1 mx-2">
                      <button className="text-xs text-left px-3 py-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors border-b border-slate-700/50">Call the Developer</button>
                      <button className="text-xs text-left px-3 py-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors">Ask for Help</button>
                   </div>
                 )}
               </div>
            </div>
            
            {/* User Profile */}
            <div className="flex items-center gap-3 px-2 pt-2">
               <div className="w-8 h-8 rounded-full bg-[#1e293b] flex items-center justify-center shrink-0 border border-slate-700/50">
                  <User className="w-4 h-4 text-[#e2e8f0]" />
               </div>
               <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-200">Srinath</span>
                  <span className="text-[10px] text-slate-500">Pro Tier</span>
               </div>
            </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-[#0c1220] p-3 xl:p-6 overflow-y-auto">
        {activeTab === 'DASHBOARD' && <DashboardView />}
        {activeTab === 'WATCHLIST' && <WatchlistView />}
        {activeTab === 'VELOCITY' && <VelocityView />}
        {activeTab === 'HISTORICAL' && <HistoricalView />}
        {activeTab === 'AI_CHAT' && <ChatView />}
        {activeTab === 'UPGRADE' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
            <div className="text-8xl mb-8 animate-bounce">🦖🎉</div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-cyan-400 tracking-tight leading-loose">
               JuSt kIdDiNg hAhAhA EvErYtHiNg iS FrEe
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}
