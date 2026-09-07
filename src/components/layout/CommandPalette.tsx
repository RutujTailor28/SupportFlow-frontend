'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Inbox, BookOpen, GitFork, Sparkles, ArrowRight, X } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { getPriorityStyles } from '../../lib/utils';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    tickets,
    articles,
    rules,
    setSelectedTicketId,
    setActivePage,
    setIsNewTicketModalOpen,
  } = useApp();

  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) {
      return {
        tickets: tickets.slice(0, 4),
        articles: articles.slice(0, 3),
        rules: rules.slice(0, 2),
      };
    }
    const q = query.toLowerCase();
    return {
      tickets: tickets.filter(
        t =>
          t.subject.toLowerCase().includes(q) ||
          t.ticketNumber.toLowerCase().includes(q) ||
          t.customer.name.toLowerCase().includes(q)
      ).slice(0, 5),
      articles: articles.filter(
        a =>
          a.title.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.tags.some(t => t.toLowerCase().includes(q))
      ).slice(0, 4),
      rules: rules.filter(
        r => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
      ).slice(0, 3),
    };
  }, [query, tickets, articles, rules]);

  const handleSelectTicket = (id: string) => {
    setSelectedTicketId(id);
    setActivePage('workspace');
    setIsCommandPaletteOpen(false);
    setQuery('');
  };

  const handleSelectArticle = (id: string) => {
    setActivePage('knowledge-base');
    setIsCommandPaletteOpen(false);
    setQuery('');
  };

  const handleSelectRule = (id: string) => {
    setActivePage('rules');
    setIsCommandPaletteOpen(false);
    setQuery('');
  };

  return (
    <Modal
      isOpen={isCommandPaletteOpen}
      onClose={() => setIsCommandPaletteOpen(false)}
      maxWidth="xl"
      showCloseButton={false}
      className="p-0 overflow-hidden"
    >
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tickets, knowledge base articles, routing rules, or actions..."
          className="w-full bg-transparent border-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
        {/* Tickets Section */}
        {searchResults.tickets.length > 0 && (
          <div>
            <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Inbox className="w-3.5 h-3.5" />
              <span>Tickets</span>
            </div>
            <div className="space-y-1 mt-1">
              {searchResults.tickets.map((ticket) => {
                const priorityStyle = getPriorityStyles(ticket.priority);
                return (
                  <button
                    key={ticket.id}
                    onClick={() => handleSelectTicket(ticket.id)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group cursor-pointer"
                  >
                    <div className="min-w-0 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-medium text-slate-500">
                          {ticket.ticketNumber}
                        </span>
                        <p className="text-xs font-medium text-slate-900 dark:text-white truncate">
                          {ticket.subject}
                        </p>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {ticket.customer.name} • {ticket.assignedTeam}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {ticket.escalation.isEscalated && (
                        <Badge variant="danger" size="sm">Escalated</Badge>
                      )}
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${priorityStyle.bg} ${priorityStyle.text} border ${priorityStyle.border}`}>
                        {priorityStyle.label}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* KB Articles Section */}
        {searchResults.articles.length > 0 && (
          <div>
            <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Knowledge Base Articles</span>
            </div>
            <div className="space-y-1 mt-1">
              {searchResults.articles.map((article) => (
                <button
                  key={article.id}
                  onClick={() => handleSelectArticle(article.id)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group cursor-pointer"
                >
                  <div className="min-w-0 pr-3">
                    <p className="text-xs font-medium text-slate-900 dark:text-white truncate">
                      {article.title}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {article.category} • {article.chunksCount} chunks indexed
                    </p>
                  </div>
                  <Badge variant="success" size="sm">Indexed</Badge>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Routing Rules Section */}
        {searchResults.rules.length > 0 && (
          <div>
            <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <GitFork className="w-3.5 h-3.5" />
              <span>Routing Rules</span>
            </div>
            <div className="space-y-1 mt-1">
              {searchResults.rules.map((rule) => (
                <button
                  key={rule.id}
                  onClick={() => handleSelectRule(rule.id)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group cursor-pointer"
                >
                  <div className="min-w-0 pr-3">
                    <p className="text-xs font-medium text-slate-900 dark:text-white truncate">
                      {rule.name}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      Assign to {rule.actions.assignToTeam} ({rule.actions.setPriority.toUpperCase()})
                    </p>
                  </div>
                  <Badge variant={rule.enabled ? 'default' : 'secondary'} size="sm">
                    {rule.enabled ? 'Active' : 'Disabled'}
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-2">
          <span>Navigate with</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono">↑</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono">↓</kbd>
          <span>to select</span>
        </div>
        <span>ESC to close</span>
      </div>
    </Modal>
  );
};
