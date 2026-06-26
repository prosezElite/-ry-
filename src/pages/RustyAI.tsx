import React, { useState, useRef, useEffect } from 'react';
import { Brain, Send, Bot, User, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function RustyAI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'I am **Rusty AI**, powered by Gemini 3.1 Pro with High Thinking mode. Ask me to analyze player stats, suggest map veto strategies based on opponent history, or provide general Critical Ops insights.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userText,
          context: {
            player: { ign: 'RustyKing', elo: 2450, favoriteMap: 'Plaza' },
            recentMatch: { opponent: 'AimBotV2', map: 'Grounded', result: 'Loss' }
          }
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: `*Error: ${data.error}*` }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: '*Error connecting to Rusty AI.*' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-amber-500/20 rounded-lg">
          <Brain className="w-6 h-6 text-amber-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Ask Rusty AI</h1>
          <p className="text-sm text-zinc-400">Advanced match analysis and strategy</p>
        </div>
      </div>

      <div className="flex-1 bg-[#121212] border border-zinc-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={idx} 
              className={cn("flex gap-4 max-w-[85%]", msg.role === 'user' ? "ml-auto flex-row-reverse" : "")}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                msg.role === 'user' ? "bg-zinc-800" : "bg-amber-500/20 text-amber-500 border border-amber-500/30"
              )}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-zinc-400" /> : <Bot className="w-6 h-6" />}
              </div>
              <div className={cn(
                "p-4 rounded-2xl",
                msg.role === 'user' 
                  ? "bg-amber-500 text-black rounded-tr-sm font-medium" 
                  : "bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-tl-sm prose prose-invert max-w-none"
              )}>
                {msg.role === 'user' ? (
                  msg.content
                ) : (
                  <div className="markdown-body text-sm leading-relaxed">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                <Brain className="w-5 h-5 text-amber-500 animate-pulse" />
              </div>
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl rounded-tl-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                <span className="text-zinc-400 text-sm">Thinking (High Mode)...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-zinc-900/50 border-t border-zinc-800 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for veto advice, player stats, or match analysis..."
              className="w-full bg-[#0a0a0a] border border-zinc-700 focus:border-amber-500 rounded-xl pl-4 pr-14 py-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors shadow-inner"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 p-2 bg-amber-500 text-black rounded-lg disabled:opacity-50 disabled:bg-zinc-700 disabled:text-zinc-500 hover:bg-amber-400 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
