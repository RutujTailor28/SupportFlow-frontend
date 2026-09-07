'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { RoutingRule } from '../../types/routingRule';
import { Sparkles, Zap, CheckCircle2, XCircle, ArrowRight, ShieldAlert, Bot } from 'lucide-react';
import { Badge } from '../ui/Badge';

export interface RuleSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RuleSimulatorModal: React.FC<RuleSimulatorModalProps> = ({ isOpen, onClose }) => {
  const { rules } = useApp();
  const [testText, setTestText] = useState('We are experiencing a 500 error on our production webhook and our subscription is Enterprise. We will cancel if not fixed today.');
  const [testCategory, setTestCategory] = useState('Technical');
  const [testPlan, setTestPlan] = useState('Enterprise');
  const [simulatedResult, setSimulatedResult] = useState<{
    matchedRule: RoutingRule | null;
    evaluationLog: { ruleName: string; matched: boolean; reason: string }[];
  } | null>(null);

  const handleRunSimulation = () => {
    const textLower = testText.toLowerCase();
    const evaluationLog: { ruleName: string; matched: boolean; reason: string }[] = [];
    let matchedRule: RoutingRule | null = null;

    for (const rule of rules.filter(r => r.enabled)) {
      let isMatch = true;
      const reasons: string[] = [];

      for (const cond of rule.conditions) {
        const fieldName = (cond.field as string).toLowerCase();
        if (fieldName === 'category') {
          if (cond.operator === 'equals' && testCategory !== cond.value) {
            isMatch = false;
            reasons.push(`Category '${testCategory}' does not equal '${cond.value}'`);
          }
        } else if (fieldName === 'keywords' || fieldName === 'body' || fieldName === 'subject') {
          if (cond.operator === 'contains_any' && Array.isArray(cond.value)) {
            const hasKeyword = cond.value.some(k => textLower.includes(k.toLowerCase()));
            if (!hasKeyword) {
              isMatch = false;
              reasons.push(`No keyword found from [${cond.value.join(', ')}]`);
            } else {
              reasons.push(`Matched keyword in text`);
            }
          }
        } else if (fieldName === 'customer_plan' || fieldName === 'customerplan') {
          if (cond.operator === 'equals' && testPlan !== cond.value) {
            isMatch = false;
            reasons.push(`Plan '${testPlan}' is not '${cond.value}'`);
          }
        }
      }

      evaluationLog.push({
        ruleName: rule.name,
        matched: isMatch,
        reason: isMatch ? 'All rule conditions passed' : reasons.join('; '),
      });

      if (isMatch && !matchedRule) {
        matchedRule = rule;
      }
    }

    setSimulatedResult({
      matchedRule,
      evaluationLog,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="xl"
      title={
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          <span>Test & Simulate Routing Rules</span>
        </div>
      }
      description="Evaluate sample incoming ticket content against active triage rules in priority order"
    >
      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Sample Ticket Body
          </label>
          <textarea
            rows={3}
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            className="mt-1 w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Classified Category
            </label>
            <select
              value={testCategory}
              onChange={(e) => setTestCategory(e.target.value)}
              className="mt-1 w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
            >
              <option value="Billing">Billing</option>
              <option value="Technical">Technical</option>
              <option value="Account">Account</option>
              <option value="Feature Request">Feature Request</option>
              <option value="Security">Security</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Customer Plan
            </label>
            <select
              value={testPlan}
              onChange={(e) => setTestPlan(e.target.value)}
              className="mt-1 w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
            >
              <option value="Enterprise">Enterprise</option>
              <option value="Business">Business</option>
              <option value="Pro">Pro</option>
              <option value="Starter">Starter</option>
            </select>
          </div>
        </div>

        <Button
          onClick={handleRunSimulation}
          className="w-full font-semibold shadow-xs gap-1.5"
        >
          <Sparkles className="w-4 h-4" />
          <span>Execute Simulation</span>
        </Button>

        {/* Simulation Output */}
        {simulatedResult && (
          <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Simulation Outcome:</span>
              {simulatedResult.matchedRule ? (
                <Badge variant="success" size="sm">Rule #{simulatedResult.matchedRule.order} Triggered</Badge>
              ) : (
                <Badge variant="warning" size="sm">Fallback to Default Queue</Badge>
              )}
            </h4>

            {simulatedResult.matchedRule && (
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                <p className="font-bold text-slate-900 dark:text-white">
                  Matched Rule: {simulatedResult.matchedRule.name}
                </p>
                <div className="flex flex-wrap gap-2 text-[11px] pt-1">
                  <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-medium">
                    Assign to: {simulatedResult.matchedRule.actions.assignToTeam}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-medium capitalize">
                    Priority: {simulatedResult.matchedRule.actions.setPriority}
                  </span>
                  {simulatedResult.matchedRule.actions.flagEscalation && (
                    <span className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold">
                      🚨 Flag Escalation
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-semibold text-slate-500">Evaluation Chain Log:</span>
              <div className="space-y-1 max-h-36 overflow-y-auto">
                {simulatedResult.evaluationLog.map((log, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-1.5 rounded-lg bg-white/60 dark:bg-slate-900/60 text-[11px]"
                  >
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {log.ruleName}
                    </span>
                    <span className={log.matched ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                      {log.matched ? '✓ Matched' : '✗ Skipped'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
