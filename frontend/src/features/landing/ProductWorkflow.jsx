import React from 'react';
import { MessageSquareText, Cpu, RefreshCw, MousePointerClick, ShieldCheck, ArrowRight } from 'lucide-react';

export function ProductWorkflow({ onSelectStepPrompt }) {
  const steps = [
    {
      num: '01',
      title: 'Describe',
      subtitle: 'Natural-Language Intent',
      desc: 'Express your design requirements in everyday language. UGEN parses intent, layout hierarchies, validation rules, and color palettes without boilerplate code.',
      icon: MessageSquareText,
      accent: '#EAAA00',
      samplePrompt: 'Create a registration form with name, email, phone, and password',
      badge: 'Intent Synthesis'
    },
    {
      num: '02',
      title: 'Generate',
      subtitle: 'Deterministic UI Schema',
      desc: 'Transforms your requirements into a validated, declarative JSON specification. Every element is vetted against a strict component registry to prevent arbitrary code execution.',
      icon: Cpu,
      accent: '#3A0F34',
      samplePrompt: 'Render metric cards with conversion trend lines and revenue stats',
      badge: 'Zero Hallucinations'
    },
    {
      num: '03',
      title: 'Refine',
      subtitle: 'Conversational Evolution',
      desc: 'Ask for additions or changes like "Add a phone field" or "Switch to a dark aubergine theme". UGEN updates only the target components, preserving existing form state and inputs.',
      icon: RefreshCw,
      accent: '#DDE3E8',
      samplePrompt: 'Add a terms & conditions checkbox and mobile contact field',
      badge: 'Non-Destructive Diffs'
    },
    {
      num: '04',
      title: 'Interact',
      subtitle: 'Live Working Workflows',
      desc: 'Test real form validations, dynamic button actions, navigation routing, and live component interactions immediately in your browser or through the Chrome Extension.',
      icon: MousePointerClick,
      accent: '#EAAA00',
      samplePrompt: 'Execute multi-step onboarding flow with validation feedback',
      badge: 'Full Runtime Reactivity'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-28 border-t border-[#DDE3E8]/10 bg-[#100D12] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3A0F34]/50 border border-[#DDE3E8]/15 text-xs font-semibold text-[#EAAA00]">
            <span>THE ADAPTIVE ENGINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#F4F0F5] tracking-tight">
            How UGEN Turns Ideas Into Working Interfaces
          </h2>
          <p className="text-base text-[#BDB3C1] leading-relaxed">
            A principled, four-stage generative pipeline built for enterprise reliability, determinism, and real-time user interactivity.
          </p>
        </div>

        {/* 4 Cards Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-2xl bg-[#19141C] border border-[#DDE3E8]/10 p-6 flex flex-col justify-between hover:border-[#EAAA00]/40 hover:bg-[#241B28]/90 transition-all duration-300 shadow-xl shadow-black/40"
              >
                {/* Header: Step Number & Icon */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-[#BDB3C1]/30 font-mono group-hover:text-[#EAAA00]/80 transition-colors">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#241B28] border border-[#DDE3E8]/10 flex items-center justify-center text-[#EAAA00] group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#EAAA00] block mb-1">
                      {step.badge}
                    </span>
                    <h3 className="text-xl font-bold text-[#F4F0F5]">
                      {step.title}
                    </h3>
                    <p className="text-xs text-[#DDE3E8]/70 font-medium">
                      {step.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-[#BDB3C1] leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {/* Card Footer: Actionable prompt preview */}
                <div className="pt-6 mt-6 border-t border-[#DDE3E8]/10">
                  <button
                    onClick={() => onSelectStepPrompt(step.samplePrompt)}
                    className="w-full flex items-center justify-between text-left text-[11px] font-semibold text-[#DDE3E8] hover:text-[#EAAA00] transition-colors group/btn cursor-pointer"
                  >
                    <span className="truncate pr-2">Try: "{step.samplePrompt}"</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#EAAA00] group-hover/btn:translate-x-1 transition-transform flex-shrink-0" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
