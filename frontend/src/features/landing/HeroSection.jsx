import React, { useState } from 'react';
import { Sparkles, ArrowRight, Play, Compass, Terminal, ShieldCheck } from 'lucide-react';
import { Hero3DComposition } from './Hero3DComposition';

export function HeroSection({ onStartCreating, onExploreExamples }) {
  const [promptText, setPromptText] = useState('');

  const quickPrompts = [
    'Create an executive SaaS analytics dashboard with real-time metrics',
    'Build a member registration form with name, email, phone, and password',
    'Design a dark mode customer feedback portal with rating sliders',
    'Generate an enterprise pricing table with annual/monthly switch'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (promptText.trim()) {
      onStartCreating(promptText.trim());
    } else {
      onStartCreating('Create an executive SaaS analytics dashboard with real-time metrics');
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
      {/* Background Atmosphere Layers */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full atmospheric-glow-aubergine opacity-70" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full atmospheric-glow-marigold opacity-35" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline, Copy & Interactive Prompt Bar */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            {/* Category / Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#19141C] border border-[#DDE3E8]/15 text-xs font-semibold text-[#DDE3E8] shadow-md shadow-[#3A0F34]/20 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#EAAA00] animate-pulse" />
              <span className="tracking-wide uppercase text-[11px] text-[#EAAA00] font-bold">
                UGEN v2.0
              </span>
              <span className="text-[#DDE3E8]/40">•</span>
              <span className="text-[#BDB3C1]">Autonomous Adaptive Interfaces</span>
            </div>

            {/* Editorial Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#F4F0F5] leading-[1.08]">
                Your ideas.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DDE3E8] via-[#F4F0F5] to-[#EAAA00]">
                  Your interface.
                </span>{' '}
                <br className="hidden sm:inline" />
                Generated.
              </h1>

              {/* Supporting Copy */}
              <p className="text-base sm:text-lg text-[#BDB3C1] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Describe what you need. UGEN transforms your intent into a personalized, interactive web experience that evolves with you.
              </p>

              <p className="text-xs sm:text-sm text-[#DDE3E8]/70 font-medium tracking-wide">
                From a simple idea to a working experience.
              </p>
            </div>

            {/* Interactive Hero Prompt Input */}
            <form
              onSubmit={handleSubmit}
              className="relative max-w-xl mx-auto lg:mx-0 p-2 rounded-2xl bg-[#19141C]/90 border border-[#DDE3E8]/20 shadow-2xl shadow-black/70 backdrop-blur-xl focus-within:border-[#EAAA00]/60 transition-all duration-300"
            >
              <div className="flex items-center gap-2">
                <div className="pl-3 text-[#EAAA00]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="Describe any interface... e.g., 'SaaS dashboard with revenue graphs'"
                  className="flex-1 bg-transparent px-2 py-2.5 text-sm text-[#F4F0F5] placeholder-[#BDB3C1]/60 focus:outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#EAAA00] text-[#100D12] text-xs font-bold hover:bg-[#D49A00] transition-colors shadow-md shadow-[#EAAA00]/25 cursor-pointer flex-shrink-0"
                >
                  <span>Generate</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* Quick Prompt Chips */}
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-[#BDB3C1] font-semibold block">
                Suggested Initial Prompts:
              </span>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPromptText(prompt);
                      onStartCreating(prompt);
                    }}
                    className="text-left text-xs px-3 py-1.5 rounded-xl bg-[#241B28]/80 border border-[#DDE3E8]/10 text-[#DDE3E8] hover:text-white hover:border-[#EAAA00]/50 hover:bg-[#3A0F34]/40 transition-all duration-200 cursor-pointer"
                  >
                    "{prompt.slice(0, 36)}..."
                  </button>
                ))}
              </div>
            </div>

            {/* CTAs Row */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button
                type="button"
                onClick={() => onStartCreating(promptText || 'Create an executive SaaS analytics dashboard')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#EAAA00] text-[#100D12] text-sm font-bold hover:bg-[#D49A00] transition-all duration-200 shadow-lg shadow-[#EAAA00]/25 hover:shadow-[#EAAA00]/40 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Start Creating</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onExploreExamples}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#241B28] text-[#DDE3E8] border border-[#DDE3E8]/20 text-sm font-semibold hover:bg-[#3A0F34]/50 hover:text-white hover:border-[#DDE3E8]/35 transition-colors cursor-pointer"
              >
                <Compass className="w-4 h-4 text-[#EAAA00]" />
                <span>Explore Examples</span>
              </button>
            </div>
          </div>

          {/* Right Column: Creative 3D Visual Experience */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <Hero3DComposition />
          </div>
        </div>
      </div>
    </section>
  );
}
