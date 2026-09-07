'use client';

import React, { useMemo } from 'react';
import { BrainCircuit, Bot } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { deriveAiPerformance } from '../../lib/analyticsFromTickets';

export const AIPerformanceCard: React.FC = () => {
  const { tickets, useMockData } = useApp();

  const metrics = useMemo(() => {
    if (useMockData) {
      return [
        { label: 'Classification Accuracy', value: 92.4, color: 'bg-indigo-600 dark:bg-indigo-500' },
        { label: 'Draft Acceptance Rate', value: 78.4, color: 'bg-emerald-600 dark:bg-emerald-500' },
        { label: 'Average AI Confidence', value: 89.2, color: 'bg-blue-600 dark:bg-blue-500' },
      ];
    }

    const derived = deriveAiPerformance(tickets);
    return [
      {
        label: 'Classification Accuracy',
        value: derived.classificationAccuracy,
        color: 'bg-indigo-600 dark:bg-indigo-500',
      },
      {
        label: 'Draft Acceptance Rate',
        value: derived.draftAcceptance,
        color: 'bg-emerald-600 dark:bg-emerald-500',
      },
      {
        label: 'Average AI Confidence',
        value: derived.averageConfidence,
        color: 'bg-blue-600 dark:bg-blue-500',
      },
    ];
  }, [useMockData, tickets]);

  const healthy = metrics.every((m) => m.value >= 70) || tickets.length === 0;

  return (
    <div
      id="ai-performance-card"
      className="h-[27rem] p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col"
    >
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              AI Performance
            </h3>
          </div>
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
              healthy
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
                : 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
            }`}
          >
            {healthy ? 'Healthy' : 'Needs Review'}
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {useMockData
            ? 'Automated triage, intent extraction & grounding metrics'
            : 'Computed from live ticket classifications'}
        </p>
      </div>

      <div className="mt-4 space-y-4 flex-1">
        {metrics.map((item) => (
          <div key={item.label} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
              <span className="font-bold text-slate-900 dark:text-white">{item.value}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${item.color} transition-all duration-500`}
                style={{ width: `${Math.min(100, item.value)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-3 mt-auto border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 shrink-0">
        <span className="flex items-center gap-1.5">
          <Bot className="w-3.5 h-3.5 text-indigo-500" />
          <span>Safety Guardrails Enforced</span>
        </span>
        <span className="font-medium text-slate-900 dark:text-white">
          {useMockData ? '0 Hallucinations' : `${tickets.length} tickets analyzed`}
        </span>
      </div>
    </div>
  );
};
