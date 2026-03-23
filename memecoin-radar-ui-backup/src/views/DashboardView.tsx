import React, { useState } from 'react';
import { useCoinData } from '../hooks/useCoinData';
import { Header } from '../components/Header';
import { CoinSelector } from '../components/CoinSelector';
import { TopScores } from '../components/TopScores';
import { TrendChart } from '../components/TrendChart';
import { HypeAnalysis } from '../components/HypeAnalysis';
import { ScoreBreakdown } from '../components/ScoreBreakdown';
import { InsightSummary } from '../components/InsightSummary';
import { AlertsFeed } from '../components/AlertsFeed';
import { RecentPosts } from '../components/RecentPosts';

export const DashboardView = () => {
  const [selectedCoin, setSelectedCoin] = useState('PEPE');
  const { trend, history, coins, loading, error, refresh, wsStatus } = useCoinData(selectedCoin);

  return (
    <div className="h-full w-full flex flex-col gap-4 font-sans text-sm">
      {/* Top Header */}
      <Header alerts={trend?.alerts} wsStatus={wsStatus} />

      {/* Search & Top Scores */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between shrink-0 bg-[#0f1629]/50 p-2 rounded-xl border border-slate-800/50">
        <CoinSelector selectedCoin={selectedCoin} onSelect={setSelectedCoin} coinsList={coins?.coins || []} />
        {trend && (
          <div className="flex gap-4 items-center">
            {/* Velocity Indicator Injection inside Dashboard Top Scores */}
            {trend.velocity !== undefined && (
               <div className="flex items-center gap-2 bg-[#131B2F] border border-[#2a3754] rounded-lg px-4 py-2">
                 <span className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Trajectory</span>
                 <span className={`text-lg font-bold ${trend.velocity > 0.05 ? 'text-emerald-400' : trend.velocity > 0 ? 'text-emerald-500' : trend.velocity < 0 ? 'text-rose-500' : 'text-slate-400'}`}>
                   {trend.velocity > 0.05 ? '↑↑' : trend.velocity > 0 ? '↑' : trend.velocity < -0.05 ? '↓↓' : trend.velocity < 0 ? '↓' : '→'}
                 </span>
               </div>
            )}
            <TopScores trend={trend} />
          </div>
        )}
      </div>

      {/* Main Dashboard Grid */}
      {loading && !trend ? (
        <div className="flex-1 flex justify-center items-center">
            <div className="w-8 h-8 rounded-full border-2 border-slate-600 border-t-emerald-500 animate-spin"></div>
        </div>
      ) : error && !trend ? (
        <div className="flex-1 flex justify-center items-center text-rose-500 flex-col gap-4">
           <div>{error}</div>
           <button onClick={refresh} className="px-4 py-2 bg-slate-800 text-white rounded">Retry</button>
        </div>
      ) : trend ? (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0 pb-2">
          {/* Left Column */}
          <div className="col-span-12 xl:col-span-8 flex flex-col gap-4 min-h-0">
            <div className="flex-[4_4_0%] min-h-0">
              <TrendChart history={history?.history || []} />
            </div>
            <div className="flex-[5_5_0%] grid grid-cols-1 md:grid-cols-5 gap-4 min-h-0">
              <div className="col-span-2 min-h-0 h-full">
                <ScoreBreakdown trend={trend} />
              </div>
              <div className="col-span-3 flex flex-col gap-4 min-h-0">
                <div className="shrink-0">
                  <InsightSummary trend={trend} />
                </div>
                <div className="flex-1 min-h-0">
                  <RecentPosts trend={trend} />
                </div>
              </div>
            </div>
          </div>
          {/* Right Column */}
          <div className="col-span-12 xl:col-span-4 flex flex-col gap-4 min-h-0">
             <div className="shrink-0">
                <HypeAnalysis trend={trend} />
             </div>
             <div className="flex-1 min-h-0">
                <AlertsFeed alerts={trend.alerts} />
             </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
