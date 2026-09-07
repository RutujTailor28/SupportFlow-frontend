'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, ArrowRight, Clock, User } from 'lucide-react';
import { getPriorityStyles, getSentimentStyles, cn } from '../../lib/utils';
import { Badge } from '../ui/Badge';
import { RelativeTime } from '../ui/RelativeTime';

export const LiveTicketFeed: React.FC = () => {
  const { tickets, setSelectedTicketId, setActivePage } = useApp();

  const handleTicketClick = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setActivePage('workspace');
  };

  const recentTickets = tickets.slice(0, 4);

  return (
    <div
      id="live-ticket-feed-card"
      className="h-[27rem] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col"
    >
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/40">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <h3 className="font-bold text-slate-800 dark:text-white text-sm">Live Ticket Activity</h3>
        </div>
        <button
          onClick={() => setActivePage('tickets')}
          className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline uppercase tracking-wider cursor-pointer"
        >
          VIEW ALL QUEUE →
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
        {recentTickets.length === 0 && (
          <div className="p-8 text-center text-xs text-slate-400">No recent ticket activity</div>
        )}
        {recentTickets.map((ticket) => {
          const initials = ticket.customer.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);

          const isCritical = ticket.priority === 'critical' || ticket.escalation.isEscalated;

          return (
            <div
              key={ticket.id}
              onClick={() => handleTicketClick(ticket.id)}
              className={cn(
                'px-6 py-3.5 flex items-center justify-between transition-colors cursor-pointer',
                isCritical
                  ? 'bg-red-50/30 hover:bg-red-50/50 dark:bg-rose-950/20 dark:hover:bg-rose-950/30'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
              )}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border',
                    isCritical
                      ? 'bg-red-100 text-red-600 border-red-200 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-800'
                      : 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800'
                  )}
                >
                  {initials}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-800 dark:text-white truncate">
                    {ticket.subject}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {ticket.customer.name} •{' '}
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                      {ticket.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <span
                  className={cn(
                    'px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase',
                    ticket.priority === 'critical'
                      ? 'bg-red-100 text-red-700 dark:bg-rose-950 dark:text-rose-300'
                      : ticket.priority === 'high'
                      ? 'bg-orange-100 text-orange-700 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  )}
                >
                  {ticket.priority}
                </span>
                <RelativeTime
                  date={ticket.createdAt}
                  className="text-[11px] text-slate-400 hidden sm:inline"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
