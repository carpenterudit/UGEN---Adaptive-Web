import React from 'react';
import { Bot, User, CheckCircle2 } from 'lucide-react';

export function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 my-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-surface-card border border-cerulean/40 flex items-center justify-center text-cerulean-300 flex-shrink-0 shadow-sm shadow-cerulean/10 mt-0.5">
          <Bot className="w-4 h-4 text-cerulean-300" />
        </div>
      )}

      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-md transition-all duration-150 ${
          isUser
            ? 'bg-gradient-to-r from-neon-rose to-[#D91B77] text-white rounded-tr-sm ml-8 shadow-glow-rose/20'
            : 'bg-surface-card border border-border-charcoal hover:border-cerulean/40 text-slate-200 rounded-tl-sm mr-8'
        }`}
      >
        {/* Operation Tag */}
        {message.operation_type && !isUser && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-cerulean/15 text-cerulean-300 border border-cerulean/30 mb-2 shadow-sm">
            <CheckCircle2 className="w-3 h-3 text-cerulean-400" />
            <span>{message.operation_type}</span>
          </div>
        )}

        <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>

        <div className={`text-[10px] mt-2 font-medium ${isUser ? 'text-pink-100/80 text-right' : 'text-slate-500'}`}>
          {message.created_at ? new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-surface-card border border-neon-rose/40 flex items-center justify-center text-neon-rose-300 flex-shrink-0 shadow-sm shadow-neon-rose/10 mt-0.5">
          <User className="w-4 h-4 text-neon-rose-300" />
        </div>
      )}
    </div>
  );
}
