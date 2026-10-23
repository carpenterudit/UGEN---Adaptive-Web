import React, { useState } from 'react';
import { Sparkles, ArrowRight, BarChart3, UserCheck, MessageSquare, CreditCard, Check, Star, RefreshCw } from 'lucide-react';

export function InteractiveExamples({ onRunExample }) {
  const [activeTab, setActiveTab] = useState('analytics');

  // Interactive states for the live mini-demos
  const [billingCycle, setBillingCycle] = useState('annual');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [demoInput, setDemoInput] = useState('');
  const [analyticsRange, setAnalyticsRange] = useState('7d');

  const examples = [
    {
      id: 'analytics',
      title: 'Executive Analytics Hub',
      icon: BarChart3,
      prompt: 'Create an executive SaaS analytics dashboard with real-time metrics, conversion graphs, and revenue stats',
      description: 'Dynamic telemetry cards, adaptive metrics, and throughput graphs that reflect real-time business performance.'
    },
    {
      id: 'registration',
      title: 'Member Onboarding Flow',
      icon: UserCheck,
      prompt: 'Build a member registration form with full name, email, secure password, phone number, and terms checkbox',
      description: 'High-converting multi-field registration with instant inline validation and clean error handling.'
    },
    {
      id: 'feedback',
      title: 'Customer Sentiment Portal',
      icon: MessageSquare,
      prompt: 'Design a customer feedback and satisfaction portal with 5-star rating, tag selectors, and detailed review input',
      description: 'Real-time satisfaction measurement with interactive rating widgets and sentiment tag selectors.'
    },
    {
      id: 'pricing',
      title: 'Enterprise Pricing Matrix',
      icon: CreditCard,
      prompt: 'Generate an enterprise tier comparison and pricing matrix with monthly/annual discount switch',
      description: 'Feature-rich tier comparison with dynamic billing calculation and clear feature differentiation.'
    }
  ];

  const currentExample = examples.find(e => e.id === activeTab);

  return (
    <section id="examples" className="py-20 lg:py-28 border-t border-[#DDE3E8]/10 bg-[#100D12] relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full atmospheric-glow-aubergine opacity-35 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#19141C] border border-[#DDE3E8]/15 text-xs font-semibold text-[#EAAA00]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INTERACTIVE SHOWCASE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#F4F0F5] tracking-tight">
            Explore Realistic Adaptive Interfaces
          </h2>
          <p className="text-base text-[#BDB3C1] leading-relaxed">
            Test live simulated widgets directly below, then click any prompt to load and generate it in the full generative workspace.
          </p>
        </div>

        {/* Tab Selection Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {examples.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#EAAA00] text-[#100D12] shadow-lg shadow-[#EAAA00]/25'
                    : 'bg-[#19141C] text-[#BDB3C1] hover:text-[#F4F0F5] border border-[#DDE3E8]/10 hover:border-[#DDE3E8]/25'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>

        {/* Live Interactive Preview Box */}
        <div className="max-w-4xl mx-auto rounded-2xl bg-[#19141C] border border-[#DDE3E8]/15 shadow-2xl shadow-black/80 overflow-hidden">
          {/* Box Header */}
          <div className="p-4 sm:p-6 bg-[#241B28]/80 border-b border-[#DDE3E8]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#EAAA00] block">
                Active Demonstration
              </span>
              <h3 className="text-lg font-bold text-[#F4F0F5]">
                {currentExample.title}
              </h3>
              <p className="text-xs text-[#BDB3C1] mt-0.5">
                {currentExample.description}
              </p>
            </div>

            {/* Run in Workspace CTA */}
            <button
              onClick={() => onRunExample(currentExample.prompt)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#EAAA00] text-[#100D12] hover:bg-[#D49A00] transition-colors shadow-md shadow-[#EAAA00]/20 flex-shrink-0 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Open in Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive Live Mini-Widget Container */}
          <div className="p-6 sm:p-8 bg-[#100D12]/60 min-h-[320px] flex items-center justify-center">
            {activeTab === 'analytics' && (
              <div className="w-full max-w-xl space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#F4F0F5]">Annual Recurring Revenue</h4>
                    <p className="text-xs text-[#BDB3C1]">Real-time telemetry stream</p>
                  </div>
                  <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#19141C] border border-[#DDE3E8]/10 text-xs">
                    {['24h', '7d', '30d'].map(r => (
                      <button
                        key={r}
                        onClick={() => setAnalyticsRange(r)}
                        className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                          analyticsRange === r ? 'bg-[#3A0F34] text-[#EAAA00]' : 'text-[#BDB3C1]'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#19141C] border border-[#DDE3E8]/10">
                    <span className="text-[10px] text-[#BDB3C1] block">Net Revenue</span>
                    <span className="text-lg font-black text-[#F4F0F5] font-mono">$482,950</span>
                    <span className="text-[10px] text-[#EAAA00] block mt-1">+28.4%</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#19141C] border border-[#DDE3E8]/10">
                    <span className="text-[10px] text-[#BDB3C1] block">Active Sessions</span>
                    <span className="text-lg font-black text-[#DDE3E8] font-mono">42,819</span>
                    <span className="text-[10px] text-[#EAAA00] block mt-1">+14.2%</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#19141C] border border-[#DDE3E8]/10">
                    <span className="text-[10px] text-[#BDB3C1] block">Latency</span>
                    <span className="text-lg font-black text-[#DDE3E8] font-mono">18ms</span>
                    <span className="text-[10px] text-[#BDB3C1] block mt-1">Optimal</span>
                  </div>
                </div>

                {/* Simulated Chart Bars */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] text-[#BDB3C1]">
                    <span>Synthesis Velocity Across Hours</span>
                    <span className="text-[#EAAA00]">99.98% uptime</span>
                  </div>
                  <div className="h-16 flex items-end gap-2 p-2 rounded-xl bg-[#19141C] border border-[#DDE3E8]/10">
                    {[40, 65, 30, 85, 95, 75, 60, 90, 100, 80, 92, 88].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-[#3A0F34] to-[#EAAA00] rounded-sm hover:opacity-80 transition-opacity"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'registration' && (
              <div className="w-full max-w-md space-y-4">
                <div className="space-y-1 text-center">
                  <h4 className="text-sm font-bold text-[#F4F0F5]">Create Your Account</h4>
                  <p className="text-xs text-[#BDB3C1]">Generated with inline schema validation rules</p>
                </div>
                <div className="space-y-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-[#DDE3E8] block mb-1">Full Name</label>
                    <input
                      type="text"
                      placeholder="Elena Rostova"
                      className="w-full px-3 py-2 rounded-xl bg-[#19141C] border border-[#DDE3E8]/15 text-xs text-[#F4F0F5] placeholder-[#BDB3C1]/50 focus:outline-none focus:border-[#EAAA00]/60"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#DDE3E8] block mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="elena@enterprise.io"
                      className="w-full px-3 py-2 rounded-xl bg-[#19141C] border border-[#DDE3E8]/15 text-xs text-[#F4F0F5] placeholder-[#BDB3C1]/50 focus:outline-none focus:border-[#EAAA00]/60"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <input type="checkbox" id="demo-check" defaultChecked className="rounded accent-[#EAAA00]" />
                    <label htmlFor="demo-check" className="text-[11px] text-[#BDB3C1]">
                      I accept terms of service and security policy
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRunExample(currentExample.prompt)}
                    className="w-full py-2.5 rounded-xl bg-[#EAAA00] text-[#100D12] font-bold text-xs hover:bg-[#D49A00] transition-colors"
                  >
                    Submit Validated Registration
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'feedback' && (
              <div className="w-full max-w-md space-y-4 text-center">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[#F4F0F5]">Rate Your Adaptive Experience</h4>
                  <p className="text-xs text-[#BDB3C1]">Click stars to adjust simulated satisfaction score</p>
                </div>

                <div className="flex justify-center gap-2 py-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setFeedbackRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= feedbackRating
                            ? 'text-[#EAAA00] fill-[#EAAA00]'
                            : 'text-[#BDB3C1]/30'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap justify-center gap-1.5">
                  {['Blazing Fast', 'Accurate Layout', 'Beautiful Design', 'Responsive UI'].map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2.5 py-1 rounded-full bg-[#241B28] text-[#DDE3E8] border border-[#DDE3E8]/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <textarea
                  rows="2"
                  placeholder="Share what worked well or what you want adapted..."
                  className="w-full px-3 py-2 rounded-xl bg-[#19141C] border border-[#DDE3E8]/15 text-xs text-[#F4F0F5] placeholder-[#BDB3C1]/50 focus:outline-none focus:border-[#EAAA00]/60 resize-none"
                />
              </div>
            )}

            {activeTab === 'pricing' && (
              <div className="w-full max-w-lg space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <span className={`text-xs ${billingCycle === 'monthly' ? 'text-[#F4F0F5] font-bold' : 'text-[#BDB3C1]'}`}>
                    Monthly
                  </span>
                  <button
                    onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                    className="w-10 h-5 rounded-full bg-[#3A0F34] p-0.5 cursor-pointer relative"
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-[#EAAA00] transition-transform ${
                        billingCycle === 'annual' ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span className={`text-xs ${billingCycle === 'annual' ? 'text-[#F4F0F5] font-bold' : 'text-[#BDB3C1]'}`}>
                    Annual <span className="text-[#EAAA00] font-bold text-[10px]">(Save 20%)</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-[#19141C] border border-[#DDE3E8]/15 space-y-3">
                    <span className="text-xs font-bold text-[#DDE3E8]">Pro Workspace</span>
                    <div className="text-2xl font-black text-[#F4F0F5] font-mono">
                      {billingCycle === 'annual' ? '$39' : '$49'}
                      <span className="text-xs font-normal text-[#BDB3C1]">/mo</span>
                    </div>
                    <ul className="text-[11px] text-[#BDB3C1] space-y-1.5">
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#EAAA00]" /> Unlimited synthesis
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#EAAA00]" /> Component registry diffs
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-[#241B28] border border-[#EAAA00]/40 space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 px-2 py-0.5 bg-[#EAAA00] text-[#100D12] text-[9px] font-black uppercase tracking-wider rounded-bl-md">
                      Popular
                    </div>
                    <span className="text-xs font-bold text-[#EAAA00]">Enterprise Suite</span>
                    <div className="text-2xl font-black text-[#F4F0F5] font-mono">
                      {billingCycle === 'annual' ? '$119' : '$149'}
                      <span className="text-xs font-normal text-[#BDB3C1]">/mo</span>
                    </div>
                    <ul className="text-[11px] text-[#BDB3C1] space-y-1.5">
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#EAAA00]" /> Supabase sync
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#EAAA00]" /> MV3 Extension bridge
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
