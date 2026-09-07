'use client';

import React from 'react';
import { useApp, AppPage } from '../../context/AppContext';
import {
  LayoutDashboard,
  Inbox,
  Sparkles,
  BookOpen,
  GitFork,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sun,
  Moon,
  Building2,
  X,
  PlusCircle,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Badge } from '../ui/Badge';
import { BrandMark } from '../ui/BrandMark';

export const Sidebar: React.FC = () => {
  const {
    activePage,
    setActivePage,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    toggleDarkMode,
    tickets,
    setIsNewTicketModalOpen,
  } = useApp();

  const openCount = tickets.filter(t => t.status === 'open' || t.status === 'new').length;
  const escalatedCount = tickets.filter(t => t.escalation.isEscalated && t.status !== 'resolved').length;

  const navItems: { id: AppPage; label: string; icon: React.FC<{ className?: string }>; badge?: number; badgeVariant?: 'default' | 'danger' | 'warning' }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tickets', label: 'Ticket Queue', icon: Inbox, badge: openCount, badgeVariant: 'default' },
    { id: 'workspace', label: 'Agent Workspace', icon: Sparkles, badge: escalatedCount > 0 ? escalatedCount : undefined, badgeVariant: 'danger' },
    { id: 'knowledge-base', label: 'Knowledge Base', icon: BookOpen },
    { id: 'rules', label: 'Routing Rules', icon: GitFork },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (page: AppPage) => {
    setActivePage(page);
    setIsMobileSidebarOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 select-none">
      {/* Top Brand Logo */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-slate-800/80">
        <button
          onClick={() => handleNavClick('dashboard')}
          className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
        >
          <BrandMark className="group-hover:scale-105 transition-transform" />
          {(!isSidebarCollapsed || isMobileSidebarOpen) && (
            <div className="min-w-0">
              <span className="font-bold text-white tracking-tight text-base">SupportFlow AI</span>
            </div>
          )}
        </button>

        {isMobileSidebarOpen ? (
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={() => setIsSidebarCollapsed(prev => !prev)}
            aria-label="Toggle sidebar"
            className="hidden md:flex p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Main Navigation Items */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors group cursor-pointer',
                isActive
                  ? 'bg-indigo-500/10 text-indigo-400 font-medium'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              )}
              title={isSidebarCollapsed ? item.label : undefined}
            >
              <Icon
                className={cn(
                  'w-4 h-4 shrink-0 transition-colors',
                  isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'
                )}
              />
              {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                <span className="flex-1 text-left truncate">{item.label}</span>
              )}
              {(!isSidebarCollapsed || isMobileSidebarOpen) && item.badge !== undefined && (
                <Badge
                  variant={item.badgeVariant === 'danger' ? 'danger' : 'default'}
                  size="sm"
                  className={cn(
                    'ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded',
                    item.badgeVariant === 'danger'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  )}
                >
                  {item.badge}
                </Badge>
              )}
            </button>
          );
        })}

        <div className="pt-2">
          <div className="h-px bg-slate-800/80 my-2" />
          <button
            onClick={() => handleNavClick('submit-ticket')}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-400 hover:text-emerald-300 hover:bg-slate-800/60 transition-colors cursor-pointer group',
              activePage === 'submit-ticket' && 'bg-emerald-500/10 text-emerald-400'
            )}
            title="Public Customer Portal"
          >
            <ExternalLink className="w-4 h-4 shrink-0 text-emerald-400 group-hover:text-emerald-300" />
            {(!isSidebarCollapsed || isMobileSidebarOpen) && (
              <span className="flex-1 text-left truncate">Customer Portal</span>
            )}
          </button>
        </div>
      </nav>

      {/* TEMPORARY: user card + sidebar theme toggle hidden */}
      {false && (
        <div className="p-4 border-t border-slate-800 space-y-3 bg-[#0F172A]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-semibold text-white shrink-0">
                AM
              </div>
              {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-white truncate">Alex Miller</span>
                  <span className="text-[10px] text-slate-400 truncate">Admin Workspace</span>
                </div>
              )}
            </div>
            <button
              onClick={toggleDarkMode}
              className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Toggle theme"
              aria-label="Toggle theme"
            >
              <Sun className="w-4 h-4 text-amber-400 hidden dark:block" />
              <Moon className="w-4 h-4 text-indigo-400 block dark:hidden" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside
        id="desktop-sidebar"
        className={cn(
          'hidden md:block fixed left-0 top-0 bottom-0 z-30 transition-all duration-300 border-r border-slate-800/80',
          isSidebarCollapsed ? 'w-18' : 'w-64'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileSidebarOpen && (
        <div
          id="mobile-sidebar-drawer"
          className="fixed inset-0 z-50 md:hidden bg-slate-950/70 backdrop-blur-xs flex"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsMobileSidebarOpen(false);
          }}
        >
          <div className="w-72 h-full bg-slate-900 animate-in slide-in-from-left duration-200 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
