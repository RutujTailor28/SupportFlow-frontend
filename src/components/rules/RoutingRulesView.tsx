'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GitFork,
  Plus,
  Zap,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  Edit2,
  Trash2,
  ShieldAlert,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { RuleBuilderModal } from './RuleBuilderModal';
import { RuleSimulatorModal } from './RuleSimulatorModal';
import { getPriorityStyles } from '../../lib/utils';

export const RoutingRulesView: React.FC = () => {
  const {
    rules,
    toggleRule,
    deleteRule,
    reorderRules,
    setIsRuleModalOpen,
    setEditingRule,
    isDataLoading,
    dataError,
    useMockData,
  } = useApp();

  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  if (!useMockData && isDataLoading) {
    return (
      <div id="routing-rules-view" className="space-y-6 pb-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-slate-200/70 dark:bg-slate-800/70 animate-pulse" />
          ))}
        </div>
        <div className="h-80 rounded-2xl bg-slate-200/70 dark:bg-slate-800/70 animate-pulse" />
      </div>
    );
  }

  if (!useMockData && dataError && rules.length === 0) {
    return (
      <div id="routing-rules-view" className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Routing rules unavailable</p>
        <p className="text-xs text-slate-500 mt-1">Fix the API connection and retry from the banner above.</p>
      </div>
    );
  }

  const activeCount = rules.filter(r => r.enabled).length;
  const totalMatches = rules.reduce((acc, curr) => acc + curr.matchesLast30Days, 0);

  return (
    <div id="routing-rules-view" className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Active Routing Rules</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {activeCount} / {rules.length}
          </p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
            ● Priority ordered execution
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Rule Matches (30d)</p>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
            {totalMatches}
          </p>
          <span className="text-[10px] text-slate-500 font-medium">
            99.2% automated routing
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Auto-Escalations</p>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
            64
          </p>
          <span className="text-[10px] text-rose-600 dark:text-rose-400 font-medium">
            Churn & legal risk caught
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Evaluation Latency</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            4ms
          </p>
          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
            Instant decision tree
          </span>
        </div>
      </div>

      {/* Control Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Triage & Escalation Logic Rules
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Rules are evaluated in top-to-bottom sequence. First matching rule executes actions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSimulatorOpen(true)}
            className="gap-1.5 font-semibold text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-950/40"
          >
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Test & Simulate Rules</span>
          </Button>

          <Button
            size="sm"
            onClick={() => {
              setEditingRule(null);
              setIsRuleModalOpen(true);
            }}
            className="gap-1.5 font-semibold shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Rule</span>
          </Button>
        </div>
      </div>

      {/* Rules List Container */}
      <div className="space-y-3">
        {rules.map((rule, index) => {
          const priorityStyle = getPriorityStyles(rule.actions.setPriority);

          return (
            <div
              key={rule.id}
              className={`p-5 rounded-2xl border transition-all duration-200 ${
                rule.enabled
                  ? 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700'
                  : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-65'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left: Reorder Controls + Rule Title & Description */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  {/* Reorder Buttons */}
                  <div className="flex flex-col items-center justify-center shrink-0 mt-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                    <button
                      onClick={() => index > 0 && reorderRules(index, index - 1)}
                      disabled={index === 0}
                      className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-20 cursor-pointer"
                      title="Move Up in priority sequence"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] font-mono font-bold text-slate-500">
                      #{rule.order}
                    </span>
                    <button
                      onClick={() => index < rules.length - 1 && reorderRules(index, index + 1)}
                      disabled={index === rules.length - 1}
                      className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-20 cursor-pointer"
                      title="Move Down in priority sequence"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Title, Description & Logic Breakdown */}
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                        {rule.name}
                      </h3>
                      {rule.actions.flagEscalation && (
                        <Badge variant="danger" size="sm">
                          🚨 Auto-Escalation
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {rule.description}
                    </p>

                    {/* Conditions and Actions Visual Diagram */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {/* IF Badges */}
                      <span className="text-[11px] font-bold text-slate-400">IF:</span>
                      {rule.conditions.map((cond, cIdx) => (
                        <span
                          key={cIdx}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono"
                        >
                          {cond.field} {cond.operator === 'equals' ? '=' : 'in'} [
                          {Array.isArray(cond.value) ? cond.value.join(', ') : cond.value}]
                        </span>
                      ))}

                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 mx-1" />

                      {/* THEN Badges */}
                      <span className="text-[11px] font-bold text-indigo-500">THEN:</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-medium">
                        Assign {rule.actions.assignToTeam}
                      </span>
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-md font-semibold border ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border}`}
                      >
                        {priorityStyle.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Metrics, Switch & Actions */}
                <div className="flex items-center justify-between lg:justify-end gap-4 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {rule.matchesLast30Days} matches
                    </p>
                    <p className="text-[10px] text-slate-400">Triggered {rule.lastTriggered}</p>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      rule.enabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                    title={rule.enabled ? 'Disable rule' : 'Enable rule'}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        rule.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingRule(rule);
                        setIsRuleModalOpen(true);
                      }}
                      className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      title="Edit rule"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteRule(rule.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      title="Delete rule"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <RuleBuilderModal />
      <RuleSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
      />
    </div>
  );
};
