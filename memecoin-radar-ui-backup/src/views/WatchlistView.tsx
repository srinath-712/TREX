import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const WatchlistView = () => {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [newCoin, setNewCoin] = useState('');
  const [coinData, setCoinData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const fetchWatchlist = async () => {
    try {
      const { data } = await axios.get('/api/watchlist');
      setWatchlist(data.watchlist || []);
      
      const responses = await Promise.all(
        (data.watchlist || []).map((coin: string) => 
          axios.get(`/api/trend?coin=${coin}`).catch(() => null)
        )
      );
      
      const newData: any = {};
      responses.forEach((r, i) => {
         if (r && r.data) {
             newData[data.watchlist[i]] = r.data;
         }
      });
      setCoinData(newData);
    } catch (e) {
      console.error('Failed to fetch watchlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWatchlist(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoin.trim()) return;
    setLoading(true);
    await axios.post(`/api/watchlist/${newCoin.trim().toUpperCase()}`);
    setNewCoin('');
    fetchWatchlist();
  };

  const handleRemove = async (coin: string) => {
    setLoading(true);
    await axios.delete(`/api/watchlist/${coin}`);
    fetchWatchlist();
  };

  return (
    <div className="flex flex-col h-full gap-6 max-w-6xl mx-auto w-full">
      <div className="flex justify-between items-end border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-widest uppercase">Personal Watchlist</h2>
          <p className="text-slate-400 mt-1">Track high-priority assets persistently (Backed by TREX Core).</p>
        </div>
        <form onSubmit={handleAdd} className="flex gap-2">
          <input 
            type="text" 
            value={newCoin}
            onChange={(e) => setNewCoin(e.target.value)}
            placeholder="Add Coin Ticker" 
            className="px-4 py-2 bg-[#131B2F] border border-[#2a3754] rounded-lg focus:outline-none focus:border-emerald-500 min-w-48 text-white uppercase"
          />
          <button type="submit" className="px-6 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 rounded-lg hover:bg-emerald-500/30 transition-colors font-bold">
            Add
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex-1 flex justify-center items-center"><div className="w-8 h-8 rounded-full border-2 border-slate-600 border-t-emerald-500 animate-spin"></div></div>
      ) : watchlist.length === 0 ? (
        <div className="flex-1 flex flex-col justify-center items-center text-slate-500 border border-dashed border-slate-800 rounded-2xl h-64">
           <span className="text-4xl mb-4">⭐</span>
           <p>Your watchlist is empty.</p>
           <p className="text-xs mt-2">Add a coin ticker above to pin it to your dashboard.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {watchlist.map(coin => (
            <div key={coin} className="bg-[#131B2F] border border-[#2a3754] rounded-xl p-5 flex flex-col shadow-lg relative group">
              <button onClick={() => handleRemove(coin)} className="absolute top-4 right-4 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity">
                 ✕ Remove
              </button>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold font-mono text-white flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs border border-slate-600">{coin[0]}</div>
                   {coin}
                </h3>
                {coinData[coin] && (
                   <div className="px-3 py-1 rounded bg-[#1a233a] border border-slate-700 text-sm font-mono">
                     Score: <span className="text-emerald-400 font-bold">{Math.round(coinData[coin].final_score * 100)}</span>
                   </div>
                )}
              </div>
              
              {coinData[coin] ? (
                 <div className="grid grid-cols-2 gap-2 text-sm text-slate-300">
                    <div className="bg-[#1a233a] p-2 rounded">Phase: <span className="text-amber-400 block font-bold">{coinData[coin].hype_phase.replace('_', ' ')}</span></div>
                    <div className="bg-[#1a233a] p-2 rounded">Confidence: <span className="text-blue-400 block font-bold">{coinData[coin].confidence}</span></div>
                    <div className="bg-[#1a233a] p-2 rounded">Trajectory: <span className="text-emerald-400 block font-bold text-lg">{coinData[coin].velocity > 0.05 ? '↑↑' : coinData[coin].velocity > 0 ? '↑' : coinData[coin].velocity < -0.05 ? '↓↓' : coinData[coin].velocity < 0 ? '↓' : '→'}</span></div>
                    <div className="bg-[#1a233a] p-2 rounded">Last Updated: <span className="text-slate-400 block font-mono">Just Now</span></div>
                 </div>
              ) : (
                 <div className="flex-1 flex items-center justify-center text-slate-500 text-sm py-4">Pipeline generating intel...</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
