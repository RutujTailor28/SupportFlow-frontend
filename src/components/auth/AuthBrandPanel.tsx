'use client';

import React from 'react';
import { Sparkles, ShieldAlert, CheckCircle2, Cpu } from 'lucide-react';
import { BrandMark } from '../ui/BrandMark';

export const AuthBrandPanel: React.FC = () => {
  return (
    <div className="hidden lg:flex flex-col justify-between w-full h-full bg-[#0F172A] text-white p-10 xl:p-14 relative overflow-hidden select-none border-r border-slate-800">
      {/* Subtle Background Glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand Logo */}
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <BrandMark size="lg" className="shadow-indigo-500/40" />
          <span className="font-bold text-white tracking-tight text-xl">SupportFlow AI</span>
        </div>

        <div className="mt-8 max-w-md">
          <h2 className="text-2xl xl:text-3xl font-bold tracking-tight text-white leading-snug">
            AI-powered support operations,
            <br />
            <span className="text-indigo-400">built for teams that care.</span>
          </h2>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            Automate triage, detect churn risks, draft grounded replies, and empower agents with human-in-the-loop AI assistance.
          </p>
        </div>
      </div>

      {/* Center Decorative Floating UI Cards */}
      <div className="relative z-10 my-8 space-y-3.5 max-w-md">
        {/* Card 1: AI Classification */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xs flex items-center justify-between gap-4 transition-transform hover:-translate-y-0.5 duration-200">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">AI Classification</p>
              <p className="text-[11px] text-slate-400 truncate">Payment & Billing Inquiry</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>92% Confidence</span>
          </div>
        </div>

        {/* Card 2: Escalation Detected */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-rose-900/40 shadow-xl backdrop-blur-xs flex items-center justify-between gap-4 transition-transform hover:-translate-y-0.5 duration-200">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">Escalation Detected</p>
              <p className="text-[11px] text-slate-400 truncate">Tier 1 VIP • Duplicate Charge</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase tracking-wider shrink-0">
            🚨 Churn Risk
          </span>
        </div>

        {/* Card 3: AI Draft Ready */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xs flex items-center justify-between gap-4 transition-transform hover:-translate-y-0.5 duration-200">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">AI Draft Ready</p>
              <p className="text-[11px] text-slate-400 truncate">Grounded in 2 KB articles</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
            Human Approval Req.
          </span>
        </div>
      </div>

      {/* Bottom Trust Statement */}
      <div className="relative z-10 pt-6 border-t border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Cpu className="w-4 h-4 text-indigo-400" />
          <span>
            Trusted AI assistance. <strong className="text-slate-200 font-semibold">Human decisions stay in control.</strong>
          </span>
        </div>
        <div className="text-[10px] font-mono text-slate-500">v2.4 Production</div>
      </div>
    </div>
  );
};
