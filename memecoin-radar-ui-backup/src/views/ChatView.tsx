import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Loader2, AlertCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export const ChatView = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: 'msg-welcome',
    role: 'assistant',
    content: "Greetings. I am TREX AI. Ask me about current memecoin trends, anomalies, or get specific analysis on a token."
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMsg.content, active_coin: null })
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response
      };
      
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
       const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Error: Could not connect to the TREX AI engine. Please ensure the backend and Gemini API are configured."
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0c1220] rounded-2xl border border-slate-800/60 overflow-hidden relative">
      {/* Header */}
      <div className="shrink-0 h-16 border-b border-slate-800/60 bg-[#131B2F]/80 backdrop-blur flex items-center px-6 justify-between">
         <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
             <Sparkles className="w-4 h-4 text-indigo-400" />
           </div>
           <div>
             <h2 className="text-slate-200 font-bold tracking-widest text-sm uppercase">TREX Intelligence</h2>
             <p className="text-[10px] text-indigo-400/80 uppercase tracking-widest font-bold">Powered by Gemini</p>
           </div>
         </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 w-full max-w-4xl mx-auto custom-scrollbar">
        {messages.map(msg => (
          <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`relative max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-4 ${
              msg.role === 'user' 
                ? 'bg-emerald-500/20 text-emerald-100 border border-emerald-500/30 rounded-br-sm' 
                : 'bg-[#1e293b]/70 text-slate-300 border border-slate-700/50 rounded-bl-sm shadow-xl'
            }`}>
               {msg.role === 'assistant' && (
                  <div className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-[#0c1220] flex items-center justify-center border border-slate-700/50">
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                  </div>
               )}
               <p className="whitespace-pre-wrap leading-relaxed text-sm font-medium tracking-wide">
                 {msg.content}
               </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex w-full justify-start">
            <div className="relative max-w-[85%] rounded-2xl p-4 bg-[#1e293b]/50 border border-slate-700/30 rounded-bl-sm flex items-center gap-3">
              <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
              <span className="text-slate-400 text-xs tracking-widest uppercase font-bold animate-pulse">Computing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 p-4 bg-[#131B2F]/80 backdrop-blur border-t border-slate-800/60 flex justify-center">
         <div className="w-full max-w-4xl relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Query the network..."
              className="w-full bg-[#0c1220] border border-slate-700/50 rounded-xl py-4 pl-5 pr-14 text-slate-200 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-inner"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 w-10 h-10 flex items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
         </div>
      </div>
    </div>
  );
};
