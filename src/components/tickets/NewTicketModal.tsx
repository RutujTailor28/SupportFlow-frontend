'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { TicketCategory } from '../../types/ticket';
import { Sparkles, User, Mail, MessageSquare, Tag, PlusCircle } from 'lucide-react';

export const NewTicketModal: React.FC = () => {
  const { isNewTicketModalOpen, setIsNewTicketModalOpen, createTicket, setSelectedTicketId, setActivePage } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<TicketCategory>('Technical');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      const newTicket = await createTicket({
        name,
        email,
        subject,
        message,
        category,
      });

      setIsNewTicketModalOpen(false);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setSelectedTicketId(newTicket.id);
      setActivePage('workspace');
    } catch {
      // Error toast is handled in AppContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = (type: 'billing' | 'technical' | 'escalated') => {
    if (type === 'billing') {
      setName('Maya Lin');
      setEmail('maya.lin@vertexdynamics.com');
      setSubject('Duplicate charge on annual Pro subscription');
      setMessage('Hi, our credit card was billed twice ($1,188 x 2) on August 28. Please issue a refund for the duplicate transaction as soon as possible.');
      setCategory('Billing');
    } else if (type === 'technical') {
      setName('Devon Ross');
      setEmail('devon@strataflow.io');
      setSubject('Webhook signature verification failure (Error 502)');
      setMessage('We configured our production webhook listener but every event dispatched is returning 502 Bad Gateway. Can you verify the payload format?');
      setCategory('Technical');
    } else {
      setName('Gregory House');
      setEmail('ghouse@princeton-plainsboro.med');
      setSubject('Cancelling our enterprise tier due to unresolved API latency');
      setMessage('We are facing 3000ms latency on the query endpoint for three days. If this is not resolved today we will cancel our account and migrate to a competitor.');
      setCategory('Account');
    }
  };

  return (
    <Modal
      isOpen={isNewTicketModalOpen}
      onClose={() => setIsNewTicketModalOpen(false)}
      maxWidth="lg"
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Create Support Ticket
            </h3>
            <p className="text-xs text-slate-500">Auto-classified & triaged upon creation</p>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Quick Demo Pre-fills */}
        <div className="flex items-center gap-1.5 flex-wrap pb-2 border-b border-slate-100 dark:border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium">Quick Demo:</span>
          <button
            type="button"
            onClick={() => handleFillDemo('billing')}
            className="text-[11px] px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800 cursor-pointer"
          >
            Billing Duplicate
          </button>
          <button
            type="button"
            onClick={() => handleFillDemo('technical')}
            className="text-[11px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800 cursor-pointer"
          >
            Webhook 502
          </button>
          <button
            type="button"
            onClick={() => handleFillDemo('escalated')}
            className="text-[11px] px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 cursor-pointer"
          >
            🚨 Churn Escalation
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Customer Name</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sarah Connor"
              className="mt-1 w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. sarah@cyberdyne.com"
              className="mt-1 w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Subject Line
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief summary of issue..."
              className="mt-1 w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <span>Category</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TicketCategory)}
              className="mt-1 w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="Billing">Billing</option>
              <option value="Technical">Technical</option>
              <option value="Account">Account</option>
              <option value="Feature Request">Feature Request</option>
              <option value="Shipping">Shipping</option>
              <option value="Security">Security</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
            <span>Message Content</span>
          </label>
          <textarea
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Explain the problem or customer inquiry..."
            className="mt-1 w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsNewTicketModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            isLoading={isSubmitting}
            className="font-semibold shadow-xs"
          >
            <Sparkles className="w-4 h-4 mr-1.5" />
            <span>Create & Auto-Triage</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
};
