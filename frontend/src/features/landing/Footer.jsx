import React from 'react';
import { Sparkles, ArrowRight, Github, ShieldCheck, Heart } from 'lucide-react';

export function Footer({ onStartCreating }) {
  return (
    <footer className="border-t border-[#DDE3E8]/10 bg-[#100D12] relative overflow-hidden">
      {/* Final CTA Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#3A0F34]/80 via-[#241B28] to-[#19141C] border border-[#DDE3E8]/20 p-8 sm:p-14 text-center overflow-hidden shadow-2xl shadow-black/80">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 atmospheric-glow-marigold opacity-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 atmospheric-glow-aubergine opacity-40 pointer-events-none" />

          <div className="relative max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#100D12]/60 border border-[#DDE3E8]/20 text-xs font-semibold text-[#EAAA00]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>EXPERIENCE THE REVOLUTION</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#F4F0F5] tracking-tight">
              Ready to generate your first adaptive experience?
            </h2>

            <p className="text-sm sm:text-base text-[#BDB3C1] leading-relaxed">
              Describe your idea in natural language. UGEN builds, validates, and renders a live interactive interface in seconds.
            </p>

            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => onStartCreating('Build a responsive web application dashboard with interactive analytics')}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#EAAA00] text-[#100D12] text-sm font-black hover:bg-[#D49A00] transition-all duration-200 shadow-xl shadow-[#EAAA00]/30 hover:shadow-[#EAAA00]/50 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch Generative Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Copyright */}
      <div className="border-t border-[#DDE3E8]/10 bg-[#0D0A0F] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand Info */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#3A0F34] to-[#241B28] border border-[#DDE3E8]/20 flex items-center justify-center font-black text-xs text-[#EAAA00]">
              UG
            </div>
            <div>
              <span className="font-bold text-sm text-[#F4F0F5]">UGEN Adaptive Web</span>
              <p className="text-[11px] text-[#BDB3C1]">Universal Personalized Generative Web Platform</p>
            </div>
          </div>

          {/* Status & Repository Links */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-[#BDB3C1]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#EAAA00] animate-pulse" />
              <span>Production Ready v2.0</span>
            </div>

            <a
              href="https://github.com/carpenterudit/UGEN---Adaptive-Web"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-[#F4F0F5] transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Repository</span>
            </a>
          </div>

          <div className="text-xs text-[#BDB3C1]/70">
            © {new Date().getFullYear()} UGEN. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
