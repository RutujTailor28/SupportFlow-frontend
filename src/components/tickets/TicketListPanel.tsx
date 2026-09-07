'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Ticket } from '../../types/ticket';
import { Search, Filter, ShieldAlert, Sparkles, Clock, Check } from 'lucide-react';
import { getPriorityStyles } from '../../lib/utils';
import { cn } from '../../lib/utils';
import { Badge } from '../ui/Badge';
import { RelativeTime } from '../ui/RelativeTime';

export const TicketListPanel: React.FC = () => {
  const { tickets, selectedTicketId, setSelectedTicketId } = useApp();
  const [filter, setFilter] = useState<'all' | 'escalated' | 'open'>('all');
  const [query, setQuery] = useState('');

  const displayTickets = tickets.filter(t => {
    if (filter === 'escalated' && !t.escalation.isEscalated) return false;
    if (filter === 'open' && (t.status === 'resolved' || t.status === 'closed')) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      const matchSubject = t.subject.toLowerCase().includes(q);
      const matchName = t.customer.name.toLowerCase().includes(q);
      const matchNum = t.ticketNumber.toLowerCase().includes(q);
      if (!matchSubject && !matchName && !matchNum) return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800">
      {/* Search Header */}
      <div className="p-3 border-b border-slate-100 dark:border-slate-800/80 space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tickets..."
            className="w-full pl-8.5 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Quick Tabs */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              'px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer',
              filter === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            )}
          >
            All ({tickets.length})
          </button>
          <button
            onClick={() => setFilter('escalated')}
            className={cn(
              'px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1',
              filter === 'escalated'
                ? 'bg-rose-500 text-white'
                : 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
            )}
          >
            <ShieldAlert className="w-3 h-3" />
            <span>Escalated</span>
          </button>
          <button
            onClick={() => setFilter('open')}
            className={cn(
              'px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer',
              filter === 'open'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            )}
          >
            Open
          </button>
        </div>
      </div>

      {/* Ticket List Items */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
        {displayTickets.length === 0 && (
          <div className="p-6 text-center text-xs text-slate-400">No tickets to display</div>
        )}
        {displayTickets.map((t) => {
          const isSelected = t.id === selectedTicketId;
          const priority = getPriorityStyles(t.priority);

          return (
            <div
              key={t.id}
              onClick={() => setSelectedTicketId(t.id)}
              className={cn(
                'p-3.5 transition-colors cursor-pointer relative group text-left',
                isSelected
                  ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-l-3 border-indigo-600 dark:border-indigo-400'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/40',
                t.escalation.isEscalated && !isSelected && 'bg-rose-50/20 dark:bg-rose-950/10'
              )}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[11px] font-mono font-semibold text-slate-500">
                  {t.ticketNumber}
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  <RelativeTime date={t.createdAt} />
                </span>
              </div>

              <h4
                className={cn(
                  'text-xs font-semibold truncate tracking-tight',
                  isSelected
                    ? 'text-indigo-950 dark:text-indigo-200'
                    : 'text-slate-900 dark:text-white'
                )}
              >
                {t.subject}
              </h4>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {t.customer.name} • {t.assignedTeam}
              </p>

              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-semibold border ${priority.bg} ${priority.text} ${priority.border}`}
                  >
                    {priority.label}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {t.category}
                  </span>
                </div>

                {t.escalation.isEscalated && (
                  <Badge variant="danger" size="sm" className="text-[9px] px-1.5 py-0">
                    Escalated
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
