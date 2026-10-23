import React from 'react';
import { ShieldCheck, Cpu, Database, Server, Smartphone, ExternalLink, GitBranch, Layers } from 'lucide-react';

export function ArchitectureHighlights() {
  const highlights = [
    {
      title: 'FastAPI Async Backend',
      tag: 'Python 3.14+ / ASGI',
      desc: 'High-concurrency async endpoints with Pydantic v2 data validation, structured logging, and token bucket rate limiting.',
      icon: Server,
      color: '#EAAA00'
    },
    {
      title: 'Deterministic Component Registry',
      tag: 'Zero-Code-Injection',
      desc: 'Eliminates dangerous eval() or raw HTML rendering. Generates only declarative schemas mapped to vetted, accessible React components.',
      icon: Cpu,
      color: '#3A0F34'
    },
    {
      title: 'Supabase PostgreSQL & SQLite',
      tag: 'SQLAlchemy 2.0',
      desc: 'Local development on SQLite with full zero-friction migration path to production Supabase PostgreSQL via connection pooling.',
      icon: Database,
      color: '#DDE3E8'
    },
    {
      title: 'Chrome MV3 Extension',
      tag: 'Browser Injection',
      desc: 'Companion Manifest V3 extension with isolated content scripts that inspect active web pages and adapt them on the fly.',
      icon: Smartphone,
      color: '#EAAA00'
    }
  ];

  return (
    <section id="architecture" className="py-20 lg:py-28 border-t border-[#DDE3E8]/10 bg-[#100D12] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#19141C] border border-[#DDE3E8]/15 text-xs font-semibold text-[#EAAA00]">
            <Layers className="w-3.5 h-3.5" />
            <span>ENTERPRISE SPECIFICATIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#F4F0F5] tracking-tight">
            Production-Grade Full-Stack Architecture
          </h2>
          <p className="text-base text-[#BDB3C1] leading-relaxed">
            Engineered with strict security contracts, isolated execution boundaries, and seamless deployment readiness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#19141C] border border-[#DDE3E8]/10 p-6 space-y-4 hover:border-[#DDE3E8]/25 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#241B28] border border-[#DDE3E8]/10 flex items-center justify-center text-[#EAAA00]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-[#241B28] text-[#DDE3E8] border border-[#DDE3E8]/10">
                    {item.tag}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#F4F0F5]">
                  {item.title}
                </h3>

                <p className="text-xs text-[#BDB3C1] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
