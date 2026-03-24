import React from 'react';

export const RecentPosts = ({ trend }: any) => {
  const coin = trend?.coin || 'COIN';
  
  const fallbackPosts = [
    { username: 'AltcoinGordon', handle: '@AltcoinGordon', text: `The volume on ${coin} is insane right now. We are seeing a major trend reversal.`, user_avatar: 'bg-emerald-600' },
    { username: 'honey_xbdt', handle: '@honey_xbdt', text: `Analyzing the social momentum for ${coin}. Technical indicators suggest a local bottom.`, user_avatar: 'bg-amber-600' },
    { username: 'CryptoGuru', handle: '@CryptoGuru', text: `Is this just a pump? Be careful, folks!`, user_avatar: 'bg-blue-600' }
  ];

  // Map API fields (username, user_avatar) to the component's internal format
  const apiPosts = (trend?.current_posts || []).map((p: any) => ({
    user: p.username || 'Anonymous',
    handle: p.username ? `@${p.username}` : '@user',
    text: p.text,
    avatar: p.user_avatar || 'bg-slate-600'
  }));

  const posts = apiPosts.length > 0 ? apiPosts.slice(0, 3) : fallbackPosts.map(p => ({
    user: p.username,
    handle: p.handle,
    text: p.text,
    avatar: p.user_avatar
  }));

  return (
    <div className="rounded-xl border border-[#2a3754] bg-[#131B2F] p-4 flex flex-col shadow-lg overflow-hidden flex-1 min-h-0">
      <div className="flex justify-between items-center mb-4 shrink-0 border-b border-slate-800 pb-2">
        <h3 className="text-slate-200 text-sm font-bold uppercase tracking-widest">Recent Feed</h3>
        <div className="flex gap-2 items-center">
            <span className="text-slate-500 text-[10px] uppercase">Source:</span>
            <span className="text-blue-400 text-xs">𝕏</span>
            <span className="text-emerald-500 text-[10px] font-mono">LIVE</span>
        </div>
      </div>
      <div className="flex flex-col gap-5 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700">
        {posts.map((post: any, i: number) => (
          <div key={i} className="flex gap-3 items-start group">
            <div className={`w-9 h-9 rounded-xl ${post.avatar} shrink-0 flex items-center justify-center text-white text-xs font-black shadow-lg border border-white/10 group-hover:scale-105 transition-transform duration-300`}>
              {post.user ? post.user.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="text-sm leading-snug">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-black text-slate-100 uppercase tracking-tighter text-[11px]">{post.user}</span>
                <span className="text-slate-500 text-[10px] font-mono">{post.handle}</span>
              </div>
              <span className="text-slate-400 group-hover:text-slate-300 transition-colors duration-200">"{post.text}"</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
