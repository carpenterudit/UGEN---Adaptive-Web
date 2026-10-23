import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles, Paperclip } from 'lucide-react';

export function ChatInput({ onSendMessage, isLoading, placeholder = "Describe the interface or changes you want..." }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!text.trim() || isLoading) return;
    onSendMessage(text.trim());
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [text]);

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative flex items-end gap-2 bg-surface-card border border-border-charcoal rounded-2xl p-2.5 focus-within:border-neon-rose/80 focus-within:ring-2 focus-within:ring-neon-rose/20 transition-all duration-200 shadow-xl">
        {/* Attachment Icon for visual aesthetic */}
        <button
          type="button"
          title="Context / Reference"
          className="p-2 text-slate-500 hover:text-cerulean-300 transition-colors rounded-xl flex-shrink-0"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          disabled={isLoading}
          className="flex-1 max-h-36 bg-transparent text-sm text-slate-100 placeholder-slate-500 py-1.5 resize-none focus:outline-none leading-relaxed"
        />

        <button
          type="submit"
          disabled={!text.trim() || isLoading}
          className="p-2.5 rounded-xl bg-neon-rose hover:bg-neon-rose-600 disabled:opacity-40 disabled:hover:bg-neon-rose text-white transition-all duration-150 flex-shrink-0 cursor-pointer shadow-md shadow-neon-rose/25 active:scale-95 flex items-center justify-center"
          title="Send message (Enter)"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 px-3 mt-2">
        <span>Press <kbd className="px-1.5 py-0.5 bg-surface-panel border border-border-charcoal rounded text-slate-400 font-mono text-[10px]">Enter</kbd> to generate, <kbd className="px-1.5 py-0.5 bg-surface-panel border border-border-charcoal rounded text-slate-400 font-mono text-[10px]">Shift+Enter</kbd> for newline</span>
        <span className="flex items-center gap-1.5 text-cerulean-400 font-semibold text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-cerulean animate-pulse" />
          <Sparkles className="w-3 h-3 text-cerulean-400" />
          AI Engine Demo
        </span>
      </div>
    </form>
  );
}
