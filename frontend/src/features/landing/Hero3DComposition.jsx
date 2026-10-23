import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Activity, ShieldCheck, Cpu, ArrowUpRight, CheckCircle2, SlidersHorizontal, Terminal } from 'lucide-react';

export function Hero3DComposition() {
  const containerRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 7, y: -9 });
  const [interactiveToggle, setInteractiveToggle] = useState(true);
  const [counter, setCounter] = useState(1482);
  const [activeTab, setActiveTab] = useState('preview');

  // Handle subtle mouse parallax on desktop
  const handleMouseMove = (e) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Constrain rotation to gentle values (-14 to +14 deg)
    const rotateY = (x / (rect.width / 2)) * 12;
    const rotateX = -(y / (rect.height / 2)) * 10;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 7, y: -9 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-xl lg:max-w-none h-[440px] sm:h-[500px] flex items-center justify-center perspective-container select-none"
      style={{ perspective: '1100px' }}
    >
      {/* Background Volumetric Glow Orbs */}
      <div className="absolute w-72 h-72 rounded-full atmospheric-glow-aubergine -top-6 -right-6 pointer-events-none" />
      <div className="absolute w-60 h-60 rounded-full atmospheric-glow-marigold -bottom-8 -left-8 pointer-events-none opacity-50" />

      {/* Main 3D Card Group */}
      <div
        className="relative w-full max-w-[480px] sm:max-w-[520px] transition-transform duration-300 ease-out preserve-3d"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        }}
      >
        {/* Layer 1: Ambient Backdrop Shadow Plate */}
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#3A0F34]/50 via-[#19141C] to-[#100D12] blur-xl opacity-60"
          style={{ transform: 'translateZ(-40px)' }}
        />

        {/* Layer 2: Main Floating Browser Window */}
        <div
          className="relative rounded-2xl border border-[#DDE3E8]/20 bg-[#19141C]/90 backdrop-blur-2xl shadow-2xl shadow-black/80 overflow-hidden"
          style={{ transform: 'translateZ(20px)' }}
        >
          {/* Browser Window Header */}
          <div className="h-10 px-4 bg-[#241B28]/95 border-b border-[#DDE3E8]/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EAAA00]/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#DDE3E8]/40" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#3A0F34]" />
            </div>

            {/* Address Bar Simulation */}
            <div className="flex-1 max-w-[240px] mx-auto h-6 rounded-md bg-[#100D12]/70 border border-[#DDE3E8]/10 flex items-center justify-center px-2 text-[10px] text-[#BDB3C1] font-mono">
              <span className="text-[#EAAA00] mr-1">https://</span>
              <span>ugen.app/adaptive-demo</span>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-[#DDE3E8]/70">
              <ShieldCheck className="w-3.5 h-3.5 text-[#EAAA00]" />
              <span className="hidden sm:inline">Active</span>
            </div>
          </div>

          {/* Browser Window Content Body */}
          <div className="p-5 space-y-4">
            {/* Header row inside window */}
            <div className="flex items-center justify-between pb-3 border-b border-[#DDE3E8]/10">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#EAAA00]">
                  Synthesized Interface
                </span>
                <h4 className="text-sm font-bold text-[#F4F0F5]">
                  Telemetry & Conversion Velocity
                </h4>
              </div>

              {/* View Toggle */}
              <div className="flex items-center p-0.5 rounded-lg bg-[#100D12] border border-[#DDE3E8]/10 text-[10px]">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    activeTab === 'preview' ? 'bg-[#3A0F34] text-[#F4F0F5] font-semibold' : 'text-[#BDB3C1]'
                  }`}
                >
                  Live Preview
                </button>
                <button
                  onClick={() => setActiveTab('spec')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    activeTab === 'spec' ? 'bg-[#3A0F34] text-[#F4F0F5] font-semibold' : 'text-[#BDB3C1]'
                  }`}
                >
                  JSON Spec
                </button>
              </div>
            </div>

            {activeTab === 'preview' ? (
              <div className="space-y-3.5">
                {/* Metric Cards Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[#241B28]/80 border border-[#DDE3E8]/10 hover:border-[#EAAA00]/40 transition-colors">
                    <div className="flex items-center justify-between text-[11px] text-[#BDB3C1]">
                      <span>Throughput</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#EAAA00]" />
                    </div>
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="text-lg font-black text-[#F4F0F5] font-mono">
                        {counter.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-[#EAAA00] font-semibold">+18.2%</span>
                    </div>
                    <div className="w-full bg-[#100D12] h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-[#EAAA00] h-full rounded-full w-[76%]" />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#241B28]/80 border border-[#DDE3E8]/10">
                    <div className="flex items-center justify-between text-[11px] text-[#BDB3C1]">
                      <span>Latency</span>
                      <Activity className="w-3.5 h-3.5 text-[#DDE3E8]" />
                    </div>
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="text-lg font-black text-[#DDE3E8] font-mono">
                        14ms
                      </span>
                      <span className="text-[10px] text-[#BDB3C1]">p99 cold</span>
                    </div>
                    <div className="w-full bg-[#100D12] h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-[#3A0F34] h-full rounded-full w-[92%]" />
                    </div>
                  </div>
                </div>

                {/* Interactive Simulated Controls */}
                <div className="p-3.5 rounded-xl bg-[#100D12]/70 border border-[#DDE3E8]/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <SlidersHorizontal className="w-4 h-4 text-[#EAAA00]" />
                    <div>
                      <p className="text-xs font-semibold text-[#F4F0F5]">
                        Autonomous Adaptation
                      </p>
                      <p className="text-[10px] text-[#BDB3C1]">
                        {interactiveToggle ? 'Active optimization mode' : 'Static view'}
                      </p>
                    </div>
                  </div>

                  {/* Interactive Toggle Button */}
                  <button
                    onClick={() => {
                      setInteractiveToggle(!interactiveToggle);
                      setCounter(prev => interactiveToggle ? prev - 14 : prev + 24);
                    }}
                    className={`relative w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                      interactiveToggle ? 'bg-[#EAAA00]' : 'bg-[#241B28]'
                    }`}
                    aria-label="Toggle Autonomous Adaptation"
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-[#100D12] transition-transform ${
                        interactiveToggle ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            ) : (
              /* JSON Spec View */
              <div className="p-3 rounded-xl bg-[#100D12] border border-[#DDE3E8]/10 font-mono text-[11px] text-[#DDE3E8] space-y-1 overflow-x-auto">
                <div className="text-[#BDB3C1]">// Deterministic UI Schema</div>
                <div>{'{'}</div>
                <div className="pl-3"><span className="text-[#EAAA00]">"type"</span>: <span className="text-[#DDE3E8]">"metric_card"</span>,</div>
                <div className="pl-3"><span className="text-[#EAAA00]">"variant"</span>: <span className="text-[#DDE3E8]">"adaptive"</span>,</div>
                <div className="pl-3"><span className="text-[#EAAA00]">"verified"</span>: <span className="text-[#F4F0F5]">true</span>,</div>
                <div className="pl-3"><span className="text-[#EAAA00]">"latency_ms"</span>: <span className="text-[#EAAA00]">14</span></div>
                <div>{'}'}</div>
              </div>
            )}
          </div>
        </div>

        {/* Layer 3: Floating Translucent Card 1 (Prompt Pill) */}
        <div
          className="absolute -top-7 -left-5 sm:-left-8 px-3.5 py-2.5 rounded-xl bg-[#241B28]/95 border border-[#DDE3E8]/20 shadow-xl shadow-black/60 backdrop-blur-xl flex items-center gap-2.5 text-xs text-[#F4F0F5]"
          style={{ transform: 'translateZ(60px)' }}
        >
          <div className="w-6 h-6 rounded-lg bg-[#EAAA00]/20 flex items-center justify-center text-[#EAAA00]">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] text-[#BDB3C1] font-mono block">Prompt Intent</span>
            <span className="font-semibold text-xs text-[#F4F0F5]">
              "Add real-time conversion graph with dark theme"
            </span>
          </div>
        </div>

        {/* Layer 4: Floating Translucent Card 2 (Validation Status) */}
        <div
          className="absolute -bottom-6 -right-4 sm:-right-8 px-3.5 py-2.5 rounded-xl bg-[#3A0F34]/95 border border-[#EAAA00]/30 shadow-xl shadow-black/60 backdrop-blur-xl flex items-center gap-2.5 text-xs"
          style={{ transform: 'translateZ(50px)' }}
        >
          <CheckCircle2 className="w-4 h-4 text-[#EAAA00]" />
          <div>
            <span className="text-[10px] text-[#DDE3E8]/80 font-mono block">Schema Contract</span>
            <span className="font-bold text-xs text-[#F4F0F5]">
              100% Deterministic Spec
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
