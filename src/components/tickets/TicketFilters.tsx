'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { TicketCategory, TicketPriority, TicketSentiment, TicketStatus, SupportTeam } from '../../types/ticket';
import { Search, Filter, ShieldAlert, X, RotateCcw } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const TicketFilters: React.FC = () => {
  const { ticketFilters, setTicketFilters, tickets } = useApp();

  const statuses: { id: TicketStatus | 'all'; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'new', label: 'New' },
    { id: 'open', label: 'Open' },
    { id: 'pending', label: 'Pending' },
    { id: 'resolved', label: 'Resolved' },
  ];

  const categories: (TicketCategory | 'all')[] = [
    'all',
    'Billing',
    'Technical',
    'Account',
    'Feature Request',
    'Shipping',
    'Security',
    'Other',
  ];

  const urgencies: (TicketPriority | 'all')[] = ['all', 'critical', 'high', 'normal', 'low'];

  const sentiments: (TicketSentiment | 'all')[] = [
    'all',
    'positive',
    'neutral',
    'negative',
    'very_negative',
  ];

  const teams: (SupportTeam | 'all')[] = [
    'all',
    'Finance Team',
    'Engineering',
    'Tier 1 Support',
    'Tier 2 Support',
    'Account Management',
    'Security & Compliance',
    'Product Team',
  ];

  const resetFilters = () => {
    setTicketFilters({
      search: '',
      status: 'all',
      category: 'all',
      urgency: 'all',
      sentiment: 'all',
      team: 'all',
      escalatedOnly: false,
    });
  };

  const hasActiveFilters =
    ticketFilters.search !== '' ||
    ticketFilters.status !== 'all' ||
    ticketFilters.category !== 'all' ||
    ticketFilters.urgency !== 'all' ||
    ticketFilters.sentiment !== 'all' ||
    ticketFilters.team !== 'all' ||
    ticketFilters.escalatedOnly;

  return (
    <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3.5">
      {/* Top Search and Status Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={ticketFilters.search}
            onChange={(e) => setTicketFilters(prev => ({ ...prev, search: e.target.value }))}
            placeholder="Search tickets by subject, customer, #ID, or category..."
            className="w-full pl-9.5 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          {ticketFilters.search && (
            <button
              onClick={() => setTicketFilters(prev => ({ ...prev, search: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Pill Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0">
          {statuses.map((s) => {
            const isSelected = ticketFilters.status === s.id;
            const count = s.id === 'all'
              ? tickets.length
              : tickets.filter(t => t.status === s.id).length;

            return (
              <button
                key={s.id}
                onClick={() => setTicketFilters(prev => ({ ...prev, status: s.id }))}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                <span>{s.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dropdown Filters Row */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium mr-1">
          <Filter className="w-3.5 h-3.5" />
          <span>Filters:</span>
        </div>

        {/* Category Dropdown */}
        <select
          value={ticketFilters.category}
          onChange={(e) => setTicketFilters(prev => ({ ...prev, category: e.target.value as any }))}
          className="text-xs py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
        >
          <option value="all">Category: All</option>
          {categories.filter(c => c !== 'all').map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Urgency Dropdown */}
        <select
          value={ticketFilters.urgency}
          onChange={(e) => setTicketFilters(prev => ({ ...prev, urgency: e.target.value as any }))}
          className="text-xs py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
        >
          <option value="all">Urgency: All</option>
          {urgencies.filter(u => u !== 'all').map((urg) => (
            <option key={urg} value={urg}>
              {urg.charAt(0).toUpperCase() + urg.slice(1)} Priority
            </option>
          ))}
        </select>

        {/* Sentiment Dropdown */}
        <select
          value={ticketFilters.sentiment}
          onChange={(e) => setTicketFilters(prev => ({ ...prev, sentiment: e.target.value as any }))}
          className="text-xs py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
        >
          <option value="all">Sentiment: All</option>
          <option value="positive">😊 Positive</option>
          <option value="neutral">😐 Neutral</option>
          <option value="negative">😟 Negative</option>
          <option value="very_negative">😡 Very Negative</option>
        </select>

        {/* Team Dropdown */}
        <select
          value={ticketFilters.team}
          onChange={(e) => setTicketFilters(prev => ({ ...prev, team: e.target.value as any }))}
          className="text-xs py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
        >
          <option value="all">Team: All Teams</option>
          {teams.filter(t => t !== 'all').map((team) => (
            <option key={team} value={team}>
              {team}
            </option>
          ))}
        </select>

        {/* Escalated Toggle Chip */}
        <button
          onClick={() => setTicketFilters(prev => ({ ...prev, escalatedOnly: !prev.escalatedOnly }))}
          className={`text-xs py-1.5 px-3 rounded-xl font-semibold transition-all flex items-center gap-1.5 border cursor-pointer ${
            ticketFilters.escalatedOnly
              ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
              : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/80 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Escalated Only</span>
        </button>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-auto cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};
