import React, { useState } from 'react';
import { Sparkles, Layers, Sliders, FolderKanban, Menu, X, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';

export function Navbar({
  onOpenWorkspace,
  onOpenProjects,
  onOpenPreferences,
  activeProjectName,
  currentView = 'landing', // 'landing' | 'workspace'
  onSwitchView
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    if (currentView !== 'landing') {
      onSwitchView('landing');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#DDE3E8]/10 bg-[#100D12]/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSwitchView('landing')}
            className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
            aria-label="UGEN Adaptive Web Home"
          >
            {/* 3D-styled stylized monogram cube */}
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#3A0F34] via-[#5C1853] to-[#241B28] border border-[#DDE3E8]/20 flex items-center justify-center shadow-lg shadow-[#3A0F34]/40 group-hover:border-[#EAAA00]/50 transition-all duration-300">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-transparent to-[#EAAA00]/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="font-black text-sm tracking-widest text-[#F4F0F5] relative z-10">
                UG
              </span>
              <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#EAAA00] ring-2 ring-[#100D12]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-[#F4F0F5] group-hover:text-white transition-colors">
                  UGEN
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#3A0F34]/60 text-[#DDE3E8] border border-[#DDE3E8]/15">
                  Adaptive Web
                </span>
              </div>
              <p className="text-[10px] text-[#BDB3C1] tracking-wide hidden sm:block">
                Generative UI Engine
              </p>
            </div>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-[#BDB3C1]">
          <button
            onClick={() => scrollToSection('features')}
            className="hover:text-[#F4F0F5] transition-colors cursor-pointer"
          >
            Product
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="hover:text-[#F4F0F5] transition-colors cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('examples')}
            className="hover:text-[#F4F0F5] transition-colors cursor-pointer"
          >
            Live Examples
          </button>
          <button
            onClick={() => scrollToSection('architecture')}
            className="hover:text-[#F4F0F5] transition-colors cursor-pointer"
          >
            Architecture
          </button>
        </nav>

        {/* Action Controls & CTA */}
        <div className="flex items-center gap-2.5">
          {/* Projects Modal Trigger */}
          <button
            onClick={onOpenProjects}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[#19141C] border border-[#DDE3E8]/15 text-[#BDB3C1] hover:text-[#F4F0F5] hover:border-[#DDE3E8]/30 transition-colors cursor-pointer"
            title="Switch Workspace Project"
          >
            <FolderKanban className="w-3.5 h-3.5 text-[#EAAA00]" />
            <span className="truncate max-w-[100px]">{activeProjectName || 'Workspaces'}</span>
          </button>

          {/* Preferences Settings */}
          <button
            onClick={onOpenPreferences}
            className="p-2 rounded-xl text-xs bg-[#19141C] border border-[#DDE3E8]/15 text-[#BDB3C1] hover:text-[#F4F0F5] hover:border-[#EAAA00]/40 transition-colors cursor-pointer"
            title="User Personalization Settings"
            aria-label="User Personalization Settings"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>

          {/* View Toggle / Start Creating Primary CTA */}
          {currentView === 'landing' ? (
            <button
              onClick={onOpenWorkspace}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#EAAA00] text-[#100D12] hover:bg-[#D49A00] transition-all duration-200 shadow-md shadow-[#EAAA00]/20 hover:shadow-[#EAAA00]/35 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Start Creating</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => onSwitchView('landing')}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#241B28] text-[#DDE3E8] border border-[#DDE3E8]/20 hover:bg-[#3A0F34]/50 hover:text-white transition-colors cursor-pointer"
            >
              <span>Home Overview</span>
            </button>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-[#19141C] border border-[#DDE3E8]/15 text-[#BDB3C1] hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-3 pb-6 border-b border-[#DDE3E8]/10 bg-[#100D12]/95 backdrop-blur-2xl space-y-3">
          <div className="flex flex-col space-y-2 text-sm font-medium text-[#BDB3C1]">
            <button
              onClick={() => scrollToSection('features')}
              className="text-left py-2 px-3 rounded-lg hover:bg-[#19141C] hover:text-white transition-colors"
            >
              Product Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-left py-2 px-3 rounded-lg hover:bg-[#19141C] hover:text-white transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('examples')}
              className="text-left py-2 px-3 rounded-lg hover:bg-[#19141C] hover:text-white transition-colors"
            >
              Live Examples
            </button>
            <button
              onClick={() => scrollToSection('architecture')}
              className="text-left py-2 px-3 rounded-lg hover:bg-[#19141C] hover:text-white transition-colors"
            >
              Architecture & Stack
            </button>
          </div>

          <div className="pt-2 border-t border-[#DDE3E8]/10 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenWorkspace();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#EAAA00] text-[#100D12]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Generative Workspace</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
