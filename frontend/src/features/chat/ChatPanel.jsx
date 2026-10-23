import React, { useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { QuickPrompts } from './QuickPrompts';
import { Sparkles, MessageSquare, Plus, Loader2 } from 'lucide-react';

export function ChatPanel({
  messages = [],
  onSendMessage,
  isLoading,
  project,
  onNewProject,
  isHeroMode = false
}) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full bg-jet-black border-r border-border-charcoal overflow-hidden">
      {/* Header */}
      {!isHeroMode && (
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-charcoal bg-surface-panel/90 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-cerulean/20 border border-cerulean/40 text-cerulean-300 flex items-center justify-center font-bold text-xs shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cerulean-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100 truncate max-w-[180px]">
                {project?.name || 'Chat with AI'}
              </h2>
              <span className="text-[10px] text-slate-400 block font-medium">
                {messages.length} message(s)
              </span>
            </div>
          </div>
          <button
            onClick={onNewProject}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-surface-card border border-border-charcoal text-slate-300 hover:text-white hover:bg-surface-hover hover:border-cerulean/50 transition-colors shadow-sm cursor-pointer"
            title="Start new project"
          >
            <Plus className="w-3.5 h-3.5 text-neon-rose" />
            <span>New</span>
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2 bg-jet-black">
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cerulean/10 text-cerulean-400 border border-cerulean/30 flex items-center justify-center shadow-inner">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-slate-200">How can I help you build?</h3>
              <p className="text-xs text-slate-400 max-w-xs">
                Ask to build any interface, add fields, or switch colors. The UI renders instantly beside you.
              </p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage key={msg.id || msg.created_at} message={msg} />
        ))}

        {isLoading && (
          <div className="flex gap-3 my-3">
            <div className="w-8 h-8 rounded-xl bg-surface-card border border-neon-rose/40 flex items-center justify-center text-neon-rose-400 flex-shrink-0 animate-pulse shadow-sm shadow-neon-rose/20">
              <Loader2 className="w-4 h-4 animate-spin text-neon-rose" />
            </div>
            <div className="bg-surface-card border border-border-charcoal text-slate-300 rounded-2xl rounded-tl-sm px-4 py-3 text-xs flex items-center gap-2.5 shadow-md">
              <span className="w-2 h-2 rounded-full bg-neon-rose animate-ping" />
              <span>Generating interface and updating specification...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-5 py-2.5 border-t border-border-charcoal bg-surface-panel/60">
        <QuickPrompts onSelectPrompt={onSendMessage} />
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-border-charcoal bg-surface-panel">
        <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
