import React from 'react';

export const RecentPosts = ({ trend }: any) => {
  const coin = trend?.coin || 'COIN';
  
  const fallbackPosts = [
    { user: 'CryptoKing', handle: '@CryptoKing', text: `${coin} is going to the moon! 🚀🚀 #${coin}Coin`, avatar: 'bg-emerald-500' },
    { user: 'TraderJoe', handle: '@TraderJoe', text: `Buy now before it's too late! 😍`, avatar: 'bg-blue-500' },
    { user: 'CryptoGuru', handle: '@CryptoGuru', text: `Is this just a pump? Be careful, folks!`, avatar: 'bg-amber-500' }
  ];

  // In this tier of LunarCrush, we only get aggregate limits, so we show the aesthetic fallback design from the ref image.
  const posts = trend?.current_posts?.length > 0 ? trend.current_posts.slice(0, 3) : fallbackPosts;

  return (
    <div className="rounded-xl border border-[#2a3754] bg-[#131B2F] p-4 flex flex-col shadow-lg overflow-hidden flex-1 min-h-0">
      <div className="flex justify-between items-center mb-4 shrink-0 border-b border-slate-800 pb-2">
        <h3 className="text-slate-200 text-sm font-bold uppercase tracking-widest">Recent Posts</h3>
        <div className="flex gap-2 items-center">
            <span className="text-slate-500 text-[10px] uppercase">Data Source:</span>
            <span className="text-blue-400 text-xs">🐦</span>
            <span className="text-blue-600 text-xs">📘</span>
        </div>
      </div>
      <div className="flex flex-col gap-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700">
        {posts.map((post: any, i: number) => (
          <div key={i} className="flex gap-3 items-start group">
            <div className={`w-8 h-8 rounded-full ${post.avatar || 'bg-slate-600'} shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-md`}>
              {post.user ? post.user.charAt(0) : 'U'}
            </div>
            <div className="text-sm leading-snug">
              <span className="font-bold text-slate-300 mr-2">{post.handle || '@user'}:</span>
              <span className="text-slate-400 group-hover:text-slate-300 transition-colors">"{post.text}"</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
