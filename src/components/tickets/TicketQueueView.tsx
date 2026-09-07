'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { TicketFilters } from './TicketFilters';
import { TicketRow } from './TicketRow';
import { Inbox, ShieldAlert, Plus, FilterX } from 'lucide-react';
import { Button } from '../ui/Button';

export const TicketQueueView: React.FC = () => {
  const {
    filteredTickets,
    tickets,
    setIsNewTicketModalOpen,
    ticketFilters,
    setTicketFilters,
    isDataLoading,
    dataError,
    useMockData,
  } = useApp();

  const escalatedCount = tickets.filter(t => t.escalation.isEscalated && t.status !== 'resolved').length;
  const criticalCount = tickets.filter(t => (t.priority === 'critical' || t.priority === 'high') && t.status !== 'resolved').length;
  const unassignedCount = tickets.filter(t => t.status === 'new').length;

  if (!useMockData && isDataLoading) {
    return (
      <div id="ticket-queue-view" className="space-y-5 pb-12 animate-in fade-in duration-300">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-slate-200/70 dark:bg-slate-800/70 animate-pulse" />
          ))}
        </div>
        <div className="h-72 rounded-2xl bg-slate-200/70 dark:bg-slate-800/70 animate-pulse" />
      </div>
    );
  }

  if (!useMockData && dataError && tickets.length === 0) {
    return (
      <div id="ticket-queue-view" className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Tickets unavailable</p>
        <p className="text-xs text-slate-500 mt-1">Fix the API connection and retry from the banner above.</p>
      </div>
    );
  }

  return (
    <div id="ticket-queue-view" className="space-y-5 pb-12 animate-in fade-in duration-300">
      {/* Header Quick Metrics Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Total In Queue</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            {tickets.length}
          </p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
            ● All active streams
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Urgent / Critical</p>
          <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            {criticalCount}
          </p>
          <span className="text-[10px] text-slate-500 font-medium">SLA &lt; 1 hour</span>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/60 shadow-xs">
          <p className="text-xs text-rose-700 dark:text-rose-400 font-medium">Escalated Tickets</p>
          <p className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1">
            {escalatedCount}
          </p>
          <span className="text-[10px] text-rose-600 dark:text-rose-400 font-medium">
            Requires Tier 2 review
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">AI Triage Speed</p>
          <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
            &lt; 1.2s
          </p>
          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
            96% confidence
          </span>
        </div>
      </div>

      {/* Filter Component */}
      <TicketFilters />

      {/* Ticket List Stream */}
      <div className="space-y-3">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <TicketRow key={ticket.id} ticket={ticket} />
          ))
        ) : (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <FilterX className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {tickets.length === 0 ? 'No tickets yet' : 'No tickets match your filters'}
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {tickets.length === 0
                ? useMockData
                  ? 'Create a ticket or simulate an influx to populate the queue.'
                  : 'Create a ticket to populate the queue.'
                : 'Try adjusting your search query, status filters, or team criteria to see more tickets.'}
            </p>
            {tickets.length > 0 && (
              <button
                onClick={() =>
                  setTicketFilters({
                    search: '',
                    status: 'all',
                    category: 'all',
                    urgency: 'all',
                    sentiment: 'all',
                    team: 'all',
                    escalatedOnly: false,
                  })
                }
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                Reset all filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
