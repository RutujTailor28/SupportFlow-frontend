'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  ShieldAlert,
  Clock,
  User,
  CheckCircle,
  Sparkles,
  Bot,
  AlertTriangle,
  Send,
  MoreVertical,
} from 'lucide-react';
import {
  getPriorityStyles,
  getStatusStyles,
  getSentimentStyles,
  getCategoryStyles,
} from '../../lib/utils';
import { Badge } from '../ui/Badge';
import { RelativeTime } from '../ui/RelativeTime';
import { ReplyEditor } from './ReplyEditor';
import { SupportTeam, TicketPriority, TicketStatus } from '../../types/ticket';

export interface TicketConversationPanelProps {
  externalDraftInsert?: string;
  onUseResolution?: (resolution: string) => void;
}

export const TicketConversationPanel: React.FC<TicketConversationPanelProps> = ({
  externalDraftInsert,
}) => {
  const {
    selectedTicket,
    setActivePage,
    updateTicketStatus,
    updateTicketPriority,
    updateTicketTeam,
    acknowledgeEscalation,
    toggleEscalation,
  } = useApp();

  if (!selectedTicket) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400">
        <p className="text-sm">Select a ticket from the left panel to inspect conversation</p>
      </div>
    );
  }

  const priorityStyle = getPriorityStyles(selectedTicket.priority);
  const statusStyle = getStatusStyles(selectedTicket.status);
  const sentimentStyle = getSentimentStyles(selectedTicket.sentiment);
  const categoryStyle = getCategoryStyles(selectedTicket.category);

  const teamList: SupportTeam[] = [
    'Finance Team',
    'Engineering',
    'Tier 1 Support',
    'Tier 2 Support',
    'Account Management',
    'Security & Compliance',
    'Product Team',
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-950 overflow-hidden">
      {/* Header Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 space-y-3 shrink-0">
        {/* Top Row: Back button, Ticket Number, Subject, Quick Selectors */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => setActivePage('tickets')}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Back to queue"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <span className="font-mono text-xs font-bold text-slate-500">
              {selectedTicket.ticketNumber}
            </span>

            <h2 className="text-sm md:text-base font-bold text-slate-900 dark:text-white tracking-tight truncate">
              {selectedTicket.subject}
            </h2>
          </div>

          {/* Dynamic Status / Priority / Team Selectors */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Selector */}
            <select
              value={selectedTicket.status}
              onChange={(e) => updateTicketStatus(selectedTicket.id, e.target.value as TicketStatus)}
              className="text-xs font-semibold py-1 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="new">Status: New</option>
              <option value="open">Status: Open</option>
              <option value="pending">Status: Pending</option>
              <option value="resolved">Status: Resolved</option>
              <option value="closed">Status: Closed</option>
            </select>

            {/* Priority Selector */}
            <select
              value={selectedTicket.priority}
              onChange={(e) =>
                updateTicketPriority(selectedTicket.id, e.target.value as TicketPriority)
              }
              className={`text-xs font-semibold py-1 px-2.5 rounded-xl border ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border} focus:outline-none cursor-pointer`}
            >
              <option value="low">Priority: Low</option>
              <option value="normal">Priority: Normal</option>
              <option value="high">Priority: High</option>
              <option value="critical">Priority: Critical</option>
            </select>

            {/* Team Selector */}
            <select
              value={selectedTicket.assignedTeam}
              onChange={(e) => updateTicketTeam(selectedTicket.id, e.target.value as SupportTeam)}
              className="text-xs py-1 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer hidden md:block"
            >
              {teamList.map((tm) => (
                <option key={tm} value={tm}>
                  {tm}
                </option>
              ))}
            </select>

            {/* Escalation Toggle */}
            <button
              onClick={() => toggleEscalation(selectedTicket.id)}
              className={`text-xs px-2.5 py-1 rounded-xl font-semibold border transition-all cursor-pointer flex items-center gap-1 ${
                selectedTicket.escalation.isEscalated
                  ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:text-rose-600'
              }`}
              title="Toggle Executive Escalation"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {selectedTicket.escalation.isEscalated ? 'Escalated' : 'Escalate'}
              </span>
            </button>
          </div>
        </div>

        {/* Customer Context Row */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-900 dark:text-white">
              {selectedTicket.customer.name}
            </span>
            <span>&lt;{selectedTicket.customer.email}&gt;</span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-medium">
              {selectedTicket.customer.plan} Tier
            </span>
            <span>•</span>
            <span>SLA Due in: <strong className="text-slate-800 dark:text-slate-200">{selectedTicket.slaDueIn}</strong></span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px]">
            <Clock className="w-3.5 h-3.5" />
            <RelativeTime date={selectedTicket.createdAt} prefix="Opened " />
          </div>
        </div>
      </div>

      {/* Escalation Attention Banner */}
      {selectedTicket.escalation.isEscalated && (
        <div className="px-6 py-3 bg-rose-500 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-xs shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>
              <strong>🚨 Escalation Required:</strong>{' '}
              {selectedTicket.escalation.reason || 'High Risk / Churn Trigger'} — Customer requires expedited Tier 2 resolution.
            </span>
          </div>

          {!selectedTicket.escalation.acknowledged ? (
            <button
              onClick={() => acknowledgeEscalation(selectedTicket.id)}
              className="px-3 py-1 bg-white text-rose-600 rounded-lg font-bold text-xs hover:bg-rose-50 transition-colors shadow-2xs shrink-0 cursor-pointer"
            >
              Acknowledge Escalation
            </button>
          ) : (
            <span className="text-xs bg-rose-600/60 px-2.5 py-0.5 rounded-md text-white font-medium">
              ✓ Acknowledged by Agent
            </span>
          )}
        </div>
      )}

      {/* Conversation Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {/* System Triage Note */}
        <div className="flex items-center justify-center my-2">
          <div className="px-3 py-1 rounded-full bg-slate-200/70 dark:bg-slate-800/80 border border-slate-300/60 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1.5 shadow-2xs">
            <Bot className="w-3.5 h-3.5 text-indigo-500" />
            <span>
              Auto-triaged by AI to <strong>{selectedTicket.assignedTeam}</strong> ({selectedTicket.aiClassification.category}) • Confidence: {Math.round(selectedTicket.aiClassification.confidence * 100)}%
            </span>
          </div>
        </div>

        {selectedTicket.messages.map((message) => {
          const isCustomer = message.senderType === 'customer';
          const isSystem = message.senderType === 'system';

          if (isSystem) {
            return (
              <div
                key={message.id}
                className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 max-w-xl mx-auto my-2"
              >
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>{message.senderName}</span>
                  <span className="text-[10px] text-slate-400 font-normal ml-auto">
                    {message.timestamp}
                  </span>
                </div>
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            );
          }

          return (
            <div
              key={message.id}
              className={`flex gap-3 max-w-2xl ${
                isCustomer ? 'mr-auto' : 'ml-auto flex-row-reverse'
              }`}
            >
              {/* Avatar */}
              <div className="shrink-0">
                {isCustomer ? (
                  selectedTicket.customer.avatar ? (
                    <img
                      src={selectedTicket.customer.avatar}
                      alt={message.senderName}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-200">
                      {message.senderName.substring(0, 2).toUpperCase()}
                    </div>
                  )
                ) : (
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
                    alt="Agent"
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-indigo-400"
                  />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`p-4 rounded-2xl shadow-2xs space-y-1.5 text-xs md:text-sm ${
                  isCustomer
                    ? 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-xs'
                    : 'bg-indigo-600 text-white rounded-tr-xs shadow-indigo-600/10'
                }`}
              >
                <div
                  className={`flex items-center justify-between gap-4 text-[11px] pb-1 border-b ${
                    isCustomer
                      ? 'border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                      : 'border-indigo-500 text-indigo-200'
                  }`}
                >
                  <span className="font-semibold">{message.senderName}</span>
                  <span>{message.timestamp}</span>
                </div>
                <div className="whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reply Composer at Bottom */}
      <div className="p-3 md:p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 shrink-0">
        <ReplyEditor externalDraftInsert={externalDraftInsert} />
      </div>
    </div>
  );
};
