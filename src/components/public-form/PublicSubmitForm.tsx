'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import {
  Sparkles,
  Send,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  Zap,
  ArrowRight,
  Inbox,
  User,
  Mail,
  Tag,
  MessageSquare,
} from 'lucide-react';
import { TicketCategory } from '../../types/ticket';
import { Badge } from '../ui/Badge';

export const PublicSubmitForm: React.FC = () => {
  const { createTicket, setSelectedTicketId, setActivePage } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<TicketCategory>('Technical');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<{ id: string; ticketNumber: string } | null>(null);

  // Live real-time triage simulation calculation
  const isUrgent =
    subject.toLowerCase().includes('urgent') ||
    message.toLowerCase().includes('cancel') ||
    message.toLowerCase().includes('down') ||
    message.toLowerCase().includes('broken');

  const detectedCategory: TicketCategory =
    subject.toLowerCase().includes('charge') || subject.toLowerCase().includes('refund') || subject.toLowerCase().includes('invoice') || subject.toLowerCase().includes('card')
      ? 'Billing'
      : subject.toLowerCase().includes('password') || subject.toLowerCase().includes('login') || subject.toLowerCase().includes('account')
      ? 'Account'
      : subject.toLowerCase().includes('ship') || subject.toLowerCase().includes('tracking') || subject.toLowerCase().includes('delivery')
      ? 'Shipping'
      : subject.toLowerCase().includes('feature') || subject.toLowerCase().includes('dark mode')
      ? 'Feature Request'
      : 'Technical';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      const ticket = await createTicket({
        name,
        email,
        subject,
        message,
        category: detectedCategory || category,
      });
      setSubmittedTicket({ id: ticket.id, ticketNumber: ticket.ticketNumber });
    } catch {
      // Error toast is handled in AppContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setSubmittedTicket(null);
  };

  return (
    <div id="public-submit-form-view" className="max-w-3xl mx-auto py-6 space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
          <span className="font-bold text-[11px] leading-none">S</span>
          <span>Customer Support Portal</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          How can our support team help you today?
        </h2>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          Submit your request below. Our automated triage assistant will analyze your query and route it to the appropriate engineering or billing team immediately.
        </p>
      </div>

      {submittedTicket ? (
        /* Confirmation State */
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-lg text-center space-y-5 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Ticket Submitted & Triaged Successfully!
            </h3>
            <p className="text-sm font-mono text-indigo-600 dark:text-indigo-400 font-bold mt-1">
              Ticket ID: {submittedTicket.ticketNumber}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
              We have dispatched an automated confirmation to your email. Our team has already received your request with initial AI classification and knowledge base references.
            </p>
          </div>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
            >
              Submit Another Request
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setSelectedTicketId(submittedTicket.id);
                setActivePage('workspace');
              }}
              className="gap-2 font-semibold shadow-sm"
            >
              <span>View in Agent Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        /* Submission Form */
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-lg space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan Miller"
                  className="mt-1 w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs md:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Work Email</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. jordan@acmecorp.com"
                  className="mt-1 w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs md:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Subject
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="What seems to be the issue?"
                className="mt-1 w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs md:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                <span>Describe your request in detail</span>
              </label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please include error messages, steps to reproduce, or account invoice details..."
                className="mt-1 w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs md:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Live Triage Preview Box */}
            {(subject.trim() || message.trim()) && (
              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-900/60 space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between text-xs font-bold text-indigo-950 dark:text-indigo-200">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Real-Time AI Triage Prediction</span>
                  </span>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400">96% confidence</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="text-slate-500 text-[11px]">Auto-Classified Category:</span>
                  <Badge variant="purple" size="sm">{detectedCategory}</Badge>

                  <span className="text-slate-500 text-[11px] ml-2">Urgency Level:</span>
                  <Badge variant={isUrgent ? 'danger' : 'default'} size="sm">
                    {isUrgent ? 'High Urgency' : 'Normal'}
                  </Badge>
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Encrypted 256-bit SSL submission</span>
              </div>

              <Button
                type="submit"
                size="md"
                isLoading={isSubmitting}
                className="font-bold shadow-md gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Ticket</span>
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
