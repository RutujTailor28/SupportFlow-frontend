'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  BrainCircuit,
  BookOpen,
  BarChart3,
  MessageSquareText,
  Zap,
  Menu,
  X,
  ArrowRight,
  Plus,
  Minus,
  Ticket,
  Bot,
  Clock3,
} from 'lucide-react';
import { BrandMark } from '../ui/BrandMark';
import { Button } from '../ui/Button';

const navLinks = [
  { label: 'Product', href: '#product' },
  { label: 'Features', href: '#features' },
  { label: 'Workspace', href: '#workspace' },
];

const accordionItems = [
  {
    title: 'Live Ticket Queue',
    body: 'Monitor open, escalated, and SLA-risk tickets with the same triage signals agents see on desktop.',
  },
  {
    title: 'AI Reply Assist',
    body: 'Generate grounded draft replies from knowledge base articles, then edit and approve before anything is sent.',
  },
  {
    title: 'Escalation Alerts',
    body: 'Get alerts when churn, legal, or compliance language appears so Tier 2 can intervene early.',
  },
  {
    title: 'Team Handoffs',
    body: 'Reassign tickets across Finance, Engineering, and Account Management without losing conversation context.',
  },
];

function ProductPreview() {
  return (
    <div className="relative w-full max-w-[680px]">
      <div className="absolute -inset-4 rounded-3xl bg-indigo-500/10 blur-2xl pointer-events-none" />
      <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-slate-900/10 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50">
          <div className="flex items-center gap-2">
            <BrandMark size="sm" />
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-white">SupportFlow AI</p>
              <p className="text-[10px] text-slate-400">Agent Workspace</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800 px-2.5 py-1 text-[10px] font-semibold text-indigo-700 dark:text-indigo-300">
            <Sparkles className="w-3 h-3" />
            AI Engine · Active
          </span>
        </div>

        <div className="p-4 space-y-3">
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { label: 'Open Tickets', value: '128' },
              { label: 'AI Triaged', value: '94%' },
              { label: 'Escalated', value: '12' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 px-3 py-2.5"
              >
                <p className="text-[10px] text-slate-400 font-medium">{stat.label}</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-2.5">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    AI Classification
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">Payment & Billing Inquiry</p>
                </div>
              </div>
              <span className="text-[10px] font-semibold px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 shrink-0">
                92% Confidence
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-rose-900 dark:text-rose-200 truncate">
                    Escalation Detected
                  </p>
                  <p className="text-[11px] text-rose-700/80 dark:text-rose-300/80 truncate">
                    Duplicate Charge · Churn Risk
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30 uppercase tracking-wider shrink-0">
                Alert
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    AI Draft Ready
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">Grounded in 2 KB articles</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shrink-0">
                Human Approval
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
            <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <p className="text-xs font-bold text-slate-800 dark:text-white">Live Ticket Feed</p>
              <span className="text-[10px] text-slate-400">Updated just now</span>
            </div>
            {[
              { id: '#TK-48291', subject: 'Duplicate subscription charge', tag: 'Billing' },
              { id: '#TK-48288', subject: 'API webhook signature mismatch', tag: 'Technical' },
            ].map((ticket) => (
              <div
                key={ticket.id}
                className="px-3.5 py-2.5 flex items-center justify-between gap-3 border-b border-slate-50 dark:border-slate-800/80 last:border-0"
              >
                <div className="min-w-0">
                  <p className="text-[11px] font-mono text-slate-400">{ticket.id}</p>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">
                    {ticket.subject}
                  </p>
                </div>
                <span className="rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 text-[10px] font-semibold shrink-0">
                  {ticket.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export const LandingPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header — matches app chrome */}
      <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
        <div className="mx-auto max-w-6xl h-full px-4 sm:px-6 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <BrandMark />
            <span className="font-bold tracking-tight text-slate-900 dark:text-white">
              SupportFlow AI
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden sm:flex items-center">
            <Link href="/dashboard">
              <Button variant="primary" size="sm" className="gap-1.5">
                Get Started
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <button
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm font-medium text-slate-600 dark:text-slate-300"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2">
              <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                <Button variant="primary" size="sm" className="w-full gap-1.5">
                  Get Started
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section id="product" className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/10 dark:bg-indigo-600/15 rounded-full blur-3xl" />
          <div className="absolute top-40 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-14 sm:pt-20 pb-16 sm:pb-24">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div className="sf-animate-fade-up">
              <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-3">
                AI Support Operating System
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                AI-powered support operations,{' '}
                <span className="text-indigo-600 dark:text-indigo-400">
                  built for teams that care.
                </span>
              </h1>
              <p className="mt-4 text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg">
                Automate triage, detect churn risks, draft grounded replies, and empower agents
                with human-in-the-loop AI assistance — without ever auto-sending to customers.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link href="/dashboard">
                  <Button variant="primary" size="lg" className="gap-2">
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" size="lg">
                    Open Live Demo
                  </Button>
                </Link>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                {[
                  { icon: ShieldAlert, label: 'Human-approved replies' },
                  { icon: Zap, label: 'Real-time AI triage' },
                  { icon: BookOpen, label: 'KB-grounded drafts' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/70 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <span className="font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="sf-animate-float-in">
              <ProductPreview />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20 border-t border-slate-200/80 dark:border-slate-800">
        <div className="mb-10 max-w-2xl">
          <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
            Capabilities
          </div>
          <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Everything agents need to resolve faster
          </h2>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            From inbound triage to grounded reply drafts, SupportFlow keeps AI assistance
            visible, editable, and under human control.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              icon: BrainCircuit,
              title: 'AI Ticket Classification',
              body: 'Detect category, urgency, sentiment, language, and customer intent with confidence scoring agents can correct.',
              accent: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200/70 dark:border-indigo-800',
            },
            {
              icon: ShieldAlert,
              title: 'Escalation Detection',
              body: 'Flag churn risk, legal language, chargebacks, and compliance requests before they become account losses.',
              accent: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900',
            },
            {
              icon: MessageSquareText,
              title: 'AI Reply Generation',
              body: 'Create friendly, formal, or concise drafts grounded in your knowledge base. Agents always approve before send.',
              accent: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
            },
            {
              icon: BarChart3,
              title: 'Live Support Analytics',
              body: 'Track ticket volume, triage accuracy, draft acceptance, and content gaps so your knowledge base improves.',
              accent: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-2xs"
            >
              <div
                className={`w-9 h-9 rounded-xl border flex items-center justify-center ${feature.accent}`}
              >
                <feature.icon className="w-4 h-4" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {feature.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Workspace */}
      <section
        id="workspace"
        className="border-y border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20 grid lg:grid-cols-2 gap-10 items-center">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Ticket className="w-4 h-4 text-indigo-500" />
              <p className="text-xs font-bold text-slate-800 dark:text-white">Mobile Queue Preview</p>
            </div>
            <div className="space-y-2.5">
              {[
                { title: 'Refund not processed', meta: 'Billing · High' },
                { title: 'SSO login loop', meta: 'Account · Critical' },
                { title: 'Shipment delay FAQ', meta: 'Shipping · Normal' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-3"
                >
                  <p className="text-xs font-bold text-slate-800 dark:text-white">{item.title}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{item.meta}</p>
                </div>
              ))}
              <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800 p-3">
                <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                  <Bot className="w-4 h-4" />
                  <p className="text-xs font-bold">AI draft ready</p>
                </div>
                <p className="text-[11px] text-indigo-700/80 dark:text-indigo-300/80 mt-1">
                  Review grounded reply before sending to the customer.
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
              Agent Workspace
            </div>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Support smarter, anytime
            </h2>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Keep momentum on escalations and VIP accounts with a workspace that mirrors
              desktop triage intelligence.
            </p>

            <div className="mt-6 space-y-2.5">
              {accordionItems.map((item, index) => {
                const open = openAccordion === index;
                return (
                  <div
                    key={item.title}
                    className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 overflow-hidden"
                  >
                    <button
                      className="w-full flex items-center gap-3 px-3.5 py-3.5 text-left cursor-pointer"
                      onClick={() => setOpenAccordion(open ? -1 : index)}
                    >
                      <span className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/70 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                        <Clock3 className="w-4 h-4" />
                      </span>
                      <span className="flex-1 text-sm font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </span>
                      {open ? (
                        <Minus className="w-4 h-4 text-slate-400" />
                      ) : (
                        <Plus className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    {open && (
                      <div className="px-3.5 pb-3.5 pl-[3.4rem] text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {item.body}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <div className="rounded-2xl border border-slate-800 bg-[#0F172A] text-white px-6 sm:px-10 py-10 relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative grid lg:grid-cols-[1.2fr_0.8fr] gap-6 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Trusted AI assistance.{' '}
                <span className="text-indigo-400">Human decisions stay in control.</span>
              </h2>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed max-w-xl">
                Every factual answer can be grounded in your knowledge base. AI never sends
                customer replies automatically — agents review, edit, and approve.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5">
              <Link href="/dashboard">
                <Button variant="primary" size="lg" className="w-full">
                  Open Product Demo
                </Button>
              </Link>
              <Link href="/submit-ticket">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full !bg-transparent !text-slate-200 !border-slate-700 hover:!bg-slate-800"
                >
                  Try Public Ticket Form
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BrandMark />
            <div>
              <p className="font-bold text-slate-900 dark:text-white">SupportFlow AI</p>
              <p className="text-xs text-slate-400">AI-powered customer support OS</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-slate-800 dark:hover:text-slate-200">
                {link.label}
              </a>
            ))}
            <Link href="/dashboard" className="hover:text-slate-800 dark:hover:text-slate-200">
              Get Started
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
