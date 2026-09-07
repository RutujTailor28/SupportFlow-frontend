'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Search,
  Bell,
  Sparkles,
  Plus,
  CheckCircle2,
  ChevronDown,
  User,
  ShieldAlert,
  Moon,
  Sun,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '../../lib/utils';

export const Header: React.FC = () => {
  const {
    activePage,
    setActivePage,
    setIsMobileSidebarOpen,
    isSidebarCollapsed,
    setIsNewTicketModalOpen,
    setIsCommandPaletteOpen,
    isDarkMode,
    toggleDarkMode,
    tickets,
    useMockData,
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const escalatedCount = tickets.filter(t => t.escalation.isEscalated && t.status !== 'resolved').length;

  const pageTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Dashboard Overview', subtitle: 'Support operations & AI intelligence' },
    tickets: { title: 'Ticket Queue', subtitle: 'Automated triage and ticket stream' },
    workspace: { title: 'Agent Workspace', subtitle: '3-Panel AI triage & assisted reply thread' },
    'knowledge-base': { title: 'Knowledge Base', subtitle: 'Vector index & automated content gap detector' },
    rules: { title: 'Routing Rules', subtitle: 'Natural language triage & SLA escalation rules' },
    analytics: { title: 'Support Analytics', subtitle: 'Ticket volumes, sentiment trends & AI metrics' },
    'submit-ticket': { title: 'Customer Support Portal', subtitle: 'Public ticket submission & preview' },
    settings: { title: 'Workspace Settings', subtitle: 'AI model parameters, teams & safety guardrails' },
  };

  const currentInfo = pageTitles[activePage] || { title: 'SupportFlow AI', subtitle: 'Operations' };

  return (
    <header
      id="main-header"
      className={cn(
        'sticky top-0 z-20 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-all duration-300 px-4 md:px-6 flex items-center justify-between',
        isSidebarCollapsed ? 'md:pl-22' : 'md:pl-70'
      )}
    >
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col min-w-0">
          <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
            {activePage === 'dashboard' ? 'Overview' : activePage.replace('-', ' ')}
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-base md:text-lg font-bold text-slate-800 dark:text-white tracking-tight truncate">
              {currentInfo.title}
            </h1>
            {activePage === 'workspace' && escalatedCount > 0 && (
              <Badge variant="danger" size="sm" dot>
                {escalatedCount} Escalated
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* TEMPORARY: AI Engine / Live API status badge hidden */}
        {false && (
          <>
            <div
              className="hidden sm:flex items-center gap-2.5 rounded-xl border border-slate-200/90 bg-slate-50/90 px-2.5 py-1.5 dark:border-slate-700/80 dark:bg-slate-800/70"
              title={
                useMockData
                  ? 'AI classification, intent extraction, and grounding (demo mode)'
                  : 'Connected to live SupportFlow API'
              }
            >
              <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-xs ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-700">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                </span>
              </div>
              <div className="flex flex-col leading-none pr-0.5">
                <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
                  {useMockData ? 'AI Engine' : 'Live API'}
                </span>
                <span className="mt-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                  {useMockData ? 'Active · Demo' : 'Connected'}
                </span>
              </div>
            </div>

            <div
              className="sm:hidden relative flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
              title={useMockData ? 'AI Engine Active' : 'Live API Connected'}
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </div>
          </>
        )}

        {/* Global Search Button */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          title="Search anything (Cmd+K)"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span>Search...</span>
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-500 shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* Theme Switcher Toggle */}
        <ThemeToggle />

        {/* New Ticket CTA */}
        <button
          onClick={() => setIsNewTicketModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-indigo-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Ticket</span>
        </button>
      </div>
    </header>
  );
};
