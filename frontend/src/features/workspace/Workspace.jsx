import React, { useState } from 'react';
import { UIRenderer } from '../ui-renderer/UIRenderer';
import {
  Monitor, Tablet, Smartphone, Maximize2, Minimize2,
  Code2, Eye, History, Sliders, Download, Layers
} from 'lucide-react';

export function Workspace({
  spec,
  currentPageId,
  onNavigate,
  onAction,
  onOpenRevisions,
  onOpenPreferences,
  toastMessage
}) {
  const [viewMode, setViewMode] = useState('preview'); // 'preview' | 'json'
  const [device, setDevice] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [isFullscreen, setIsFullscreen] = useState(false);

  const activePageId = currentPageId || spec?.current_page_id || spec?.pages?.[0]?.id;
  const pages = spec?.pages || [];

  const handleDownloadJSON = () => {
    if (!spec) return;
    const blob = new Blob([JSON.stringify(spec, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${spec.title?.toLowerCase().replace(/\s+/g, '-') || 'ui-spec'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getDeviceWidthClass = () => {
    switch (device) {
      case 'mobile':
        return 'w-[375px] max-w-[375px] min-h-[667px] shadow-2xl border-8 border-surface-card rounded-[36px] my-6 overflow-hidden ring-1 ring-border-charcoal';
      case 'tablet':
        return 'w-[768px] max-w-[768px] min-h-[800px] shadow-2xl border-8 border-surface-card rounded-[28px] my-6 overflow-hidden ring-1 ring-border-charcoal';
      default:
        return 'w-full h-full';
    }
  };

  return (
    <div className={`flex flex-col h-full bg-jet-black overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : 'relative'}`}>
      {/* Workspace Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border-charcoal bg-surface-panel/90 backdrop-blur-md z-10">
        {/* Left: View Mode Switcher */}
        <div className="flex items-center gap-1 bg-surface-card p-1 rounded-xl border border-border-charcoal">
          <button
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'preview'
                ? 'bg-[#EAAA00] text-[#100D12] font-bold shadow-sm shadow-[#EAAA00]/25'
                : 'text-[#BDB3C1] hover:text-white hover:bg-[#2D2333]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
          <button
            onClick={() => setViewMode('json')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'json'
                ? 'bg-[#3A0F34] text-[#DDE3E8] border border-[#DDE3E8]/20 font-bold shadow-sm'
                : 'text-[#BDB3C1] hover:text-white hover:bg-[#2D2333]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>
        </div>

        {/* Center: Multi-page selector if multiple pages exist */}
        {pages.length > 1 && (
          <div className="flex items-center gap-1 bg-surface-card/90 px-2.5 py-1 rounded-xl border border-border-charcoal">
            <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1 mr-1">
              <Layers className="w-3 h-3 text-cerulean-400" />
              Page:
            </span>
            {pages.map((p) => (
              <button
                key={p.id}
                onClick={() => onNavigate && onNavigate(p.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activePageId === p.id
                    ? 'bg-cerulean/20 text-cerulean-300 font-bold border border-cerulean/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-surface-hover'
                }`}
              >
                {p.title}
              </button>
            ))}
          </div>
        )}

        {/* Right: Device Controls & Modals */}
        <div className="flex items-center gap-2.5">
          {/* Responsive Device Toggles */}
          {viewMode === 'preview' && (
            <div className="hidden sm:flex items-center gap-1 bg-surface-card p-1 rounded-xl border border-border-charcoal">
              <button
                onClick={() => setDevice('desktop')}
                title="Desktop View"
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  device === 'desktop' ? 'bg-surface-hover text-cerulean-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDevice('tablet')}
                title="Tablet View (768px)"
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  device === 'tablet' ? 'bg-surface-hover text-cerulean-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDevice('mobile')}
                title="Mobile View (375px)"
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  device === 'mobile' ? 'bg-surface-hover text-cerulean-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Revisions History Trigger */}
          <button
            onClick={onOpenRevisions}
            title="Revision History & Undo"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-surface-card border border-border-charcoal text-slate-300 hover:text-white hover:bg-surface-hover hover:border-cerulean/40 transition-colors cursor-pointer shadow-sm"
          >
            <History className="w-3.5 h-3.5 text-cerulean-400" />
            <span className="hidden md:inline">Revisions</span>
          </button>

          {/* Preferences Trigger */}
          <button
            onClick={onOpenPreferences}
            title="Personalization Preferences"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-surface-card border border-border-charcoal text-slate-300 hover:text-white hover:bg-surface-hover hover:border-cerulean/40 transition-colors cursor-pointer shadow-sm"
          >
            <Sliders className="w-3.5 h-3.5 text-neon-rose" />
            <span className="hidden md:inline">Settings</span>
          </button>

          {/* Download JSON Spec */}
          <button
            onClick={handleDownloadJSON}
            title="Export UI Specification JSON"
            className="p-2 rounded-xl text-xs font-medium bg-surface-card border border-border-charcoal text-slate-300 hover:text-white hover:bg-surface-hover transition-colors cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Preview"}
            className="p-2 rounded-xl text-xs font-medium bg-surface-card border border-border-charcoal text-slate-300 hover:text-white hover:bg-surface-hover transition-colors cursor-pointer shadow-sm"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Workspace Stage with Ambient Glow Mesh */}
      <div className="flex-1 overflow-auto ambient-workspace-bg flex justify-center items-start">
        {viewMode === 'preview' ? (
          <div className={`${getDeviceWidthClass()} transition-all duration-300 flex flex-col`}>
            <UIRenderer
              spec={spec}
              currentPageId={activePageId}
              onNavigate={onNavigate}
              onAction={onAction}
              toastMessage={toastMessage}
            />
          </div>
        ) : (
          <div className="w-full h-full p-6 font-mono text-xs overflow-auto">
            <pre className="p-6 bg-surface-card rounded-2xl border border-border-charcoal text-slate-200 overflow-x-auto leading-relaxed shadow-xl">
              {JSON.stringify(spec, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
