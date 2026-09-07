'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { RoutingRule } from '../../types/routingRule';
import { SupportTeam, TicketPriority } from '../../types/ticket';
import { GitFork, Sparkles, Plus, Trash2 } from 'lucide-react';

export const RuleBuilderModal: React.FC = () => {
  const { isRuleModalOpen, setIsRuleModalOpen, editingRule, setEditingRule, createRule, updateRule } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [assignToTeam, setAssignToTeam] = useState<SupportTeam>('Tier 1 Support');
  const [setPriority, setSetPriority] = useState<TicketPriority>('normal');
  const [flagEscalation, setFlagEscalation] = useState(false);
  const [escalationReason, setEscalationReason] = useState('High Risk Detected');
  const [slaTargetMinutes, setSlaTargetMinutes] = useState(120);
  const [keywords, setKeywords] = useState('cancel, refund, competitor');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (editingRule) {
      setName(editingRule.name);
      setDescription(editingRule.description);
      setAssignToTeam(editingRule.actions.assignToTeam);
      setSetPriority(editingRule.actions.setPriority);
      setFlagEscalation(!!editingRule.actions.flagEscalation);
      setEscalationReason(editingRule.actions.escalationReason || 'High Risk');
      setSlaTargetMinutes(editingRule.actions.slaTargetMinutes || 120);
    } else {
      setName('');
      setDescription('');
      setAssignToTeam('Tier 1 Support');
      setSetPriority('normal');
      setFlagEscalation(false);
      setEscalationReason('Churn Risk Detected');
      setSlaTargetMinutes(120);
      setKeywords('cancel, refund, urgent');
    }
  }, [editingRule, isRuleModalOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    const kwArray = keywords.split(',').map(k => k.trim()).filter(Boolean);

    const conditions: any[] = [
      {
        field: 'keywords',
        operator: 'contains_any',
        value: kwArray,
      },
    ];

    if (categoryFilter !== 'All') {
      conditions.push({
        field: 'category',
        operator: 'equals',
        value: categoryFilter,
      });
    }

    setTimeout(() => {
      if (editingRule && editingRule.id) {
        updateRule(editingRule.id, {
          name,
          description,
          conditions,
          actions: {
            assignToTeam,
            setPriority,
            flagEscalation,
            escalationReason: flagEscalation ? escalationReason : undefined,
            slaTargetMinutes,
          },
        });
      } else {
        createRule({
          name,
          description: description || `Automated routing to ${assignToTeam}`,
          enabled: true,
          matchType: 'ALL',
          conditions,
          actions: {
            assignToTeam,
            setPriority,
            flagEscalation,
            escalationReason: flagEscalation ? escalationReason : undefined,
            slaTargetMinutes,
          },
        });
      }

      setIsSaving(false);
      setIsRuleModalOpen(false);
      setEditingRule(null);
    }, 350);
  };

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
    <Modal
      isOpen={isRuleModalOpen}
      onClose={() => {
        setIsRuleModalOpen(false);
        setEditingRule(null);
      }}
      maxWidth="lg"
      title={
        <div className="flex items-center gap-2">
          <GitFork className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>{editingRule ? 'Edit Routing Rule' : 'Create New Routing Rule'}</span>
        </div>
      }
      description="Configure trigger conditions and target actions for automated triage"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Rule Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. High-Risk Churn Escalation"
            className="mt-1 w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Flags tickets containing churn intent and routes to Account Management"
            className="mt-1 w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Conditions Section */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
          <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">
            Trigger Conditions (IF)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-slate-500">
                Trigger Keywords (comma-separated)
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="cancel, refund, lawyer"
                className="mt-1 w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-500">
                Category Match
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="mt-1 w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
              >
                <option value="All">Any Category</option>
                <option value="Billing">Billing</option>
                <option value="Technical">Technical</option>
                <option value="Account">Account</option>
                <option value="Shipping">Shipping</option>
                <option value="Security">Security</option>
              </select>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-800/60 space-y-3">
          <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider text-[10px]">
            Target Actions (THEN)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                Assign to Team
              </label>
              <select
                value={assignToTeam}
                onChange={(e) => setAssignToTeam(e.target.value as SupportTeam)}
                className="mt-1 w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
              >
                {teamList.map((tm) => (
                  <option key={tm} value={tm}>
                    {tm}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                Set Urgency / Priority
              </label>
              <select
                value={setPriority}
                onChange={(e) => setSetPriority(e.target.value as TicketPriority)}
                className="mt-1 w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white capitalize"
              >
                <option value="low">Low Priority</option>
                <option value="normal">Normal Priority</option>
                <option value="high">High Priority</option>
                <option value="critical">Critical Priority</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-indigo-100 dark:border-indigo-900/40">
            <label className="flex items-center gap-2 text-xs font-semibold text-rose-700 dark:text-rose-300 cursor-pointer">
              <input
                type="checkbox"
                checked={flagEscalation}
                onChange={(e) => setFlagEscalation(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
              />
              <span>Flag as Immediate Escalation</span>
            </label>

            {flagEscalation && (
              <input
                type="text"
                value={escalationReason}
                onChange={(e) => setEscalationReason(e.target.value)}
                placeholder="Escalation reason..."
                className="text-xs px-2.5 py-1 bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 rounded-lg text-rose-900 dark:text-rose-200 w-48"
              />
            )}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsRuleModalOpen(false);
              setEditingRule(null);
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            isLoading={isSaving}
            className="font-semibold shadow-xs"
          >
            <Sparkles className="w-4 h-4 mr-1.5" />
            <span>Save Rule</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
};
