'use client';

import React from 'react';
import { Ticket } from '../../types/ticket';
import { useApp } from '../../context/AppContext';
import {
  getPriorityStyles,
  getSentimentStyles,
  getStatusStyles,
  getCategoryStyles,
} from '../../lib/utils';
import { Badge } from '../ui/Badge';
import { RelativeTime } from '../ui/RelativeTime';
import { ShieldAlert, Clock, ChevronRight, User, CheckCircle, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface TicketRowProps {
  ticket: Ticket;
}

export const TicketRow: React.FC<TicketRowProps> = ({ ticket }) => {
  const { setSelectedTicketId, setActivePage, updateTicketStatus, toggleEscalation } = useApp();

  const handleOpenWorkspace = () => {
    setSelectedTicketId(ticket.id);
    setActivePage('workspace');
  };

  const priorityStyle = getPriorityStyles(ticket.priority);
  const statusStyle = getStatusStyles(ticket.status);
  const sentimentStyle = getSentimentStyles(ticket.sentiment);
  const categoryStyle = getCategoryStyles(ticket.category);

  return (
    <div
      id={`ticket-row-${ticket.id}`}
      onClick={handleOpenWorkspace}
      className={cn(
        'group relative rounded-2xl p-4 transition-all duration-200 cursor-pointer border',
        ticket.escalation.isEscalated
          ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 shadow-xs'
          : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700/60 hover:shadow-md'
      )}
    >
      {/* Escalation Warning Header Banner */}
      {ticket.escalation.isEscalated && (
        <div className="mb-3 px-3 py-1.5 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/30 flex items-center justify-between text-xs text-rose-700 dark:text-rose-300">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span className="font-bold uppercase tracking-wider text-[10px]">
              🚨 Escalated — {ticket.escalation.reason || 'High Risk Triggered'}
            </span>
            {ticket.escalation.triggerPhrases && ticket.escalation.triggerPhrases.length > 0 && (
              <span className="hidden sm:inline text-rose-600/80 dark:text-rose-400/80 italic truncate max-w-xs">
                Trigger: "{ticket.escalation.triggerPhrases.join(', ')}"
              </span>
            )}
          </div>
          <span className="text-[11px] font-medium shrink-0">Priority Attention</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left info: Customer Avatar + Subject & Meta */}
        <div className="flex items-start gap-3.5 min-w-0 flex-1">
          {/* Avatar with Sentiment Dot */}
          <div className="relative shrink-0 mt-0.5">
            {ticket.customer.avatar ? (
              <img
                src={ticket.customer.avatar}
                alt={ticket.customer.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 text-xs ring-2 ring-slate-100 dark:ring-slate-800">
                {ticket.customer.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase()}
              </div>
            )}
            {/* Priority Indicator Dot */}
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${priorityStyle.dot}`}
              title={`Priority: ${ticket.priority}`}
            />
          </div>

          {/* Subject, Snippet & Customer Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
                {ticket.ticketNumber}
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {ticket.subject}
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 mt-1 font-normal">
              {ticket.messages[0]?.content || ticket.customerIntent}
            </p>

            <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 flex-wrap">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {ticket.customer.name}
              </span>
              <span>({ticket.customer.email})</span>
              <span>•</span>
              <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                {ticket.customer.plan} Plan
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <RelativeTime date={ticket.createdAt} />
              </span>
            </div>
          </div>
        </div>

        {/* Right Info: Badges, SLA, Team, Action */}
        <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Category badge */}
            <span
              className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${categoryStyle}`}
            >
              {ticket.category}
            </span>

            {/* Priority Badge */}
            <span
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border}`}
            >
              {priorityStyle.label}
            </span>

            {/* Sentiment Emoji */}
            <span
              className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              title={`Sentiment: ${ticket.sentiment}`}
            >
              {sentimentStyle.icon}
            </span>

            {/* Assigned Team */}
            <span className="hidden xl:inline-flex text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1 rounded-full border border-slate-200/80 dark:border-slate-700/80">
              {ticket.assignedTeam}
            </span>

            {/* Status Badge */}
            <span
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
            >
              {statusStyle.label}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenWorkspace();
            }}
            className="p-2 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer shrink-0"
            title="Open in Agent Workspace"
          >
            <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
