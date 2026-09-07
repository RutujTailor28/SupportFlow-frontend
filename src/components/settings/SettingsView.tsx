'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import {
  Settings,
  BrainCircuit,
  ShieldCheck,
  Users,
  Check,
  Sparkles,
  Database,
  Lock,
  RefreshCw,
  Activity,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { API_BASE_URL } from '../../lib/config';
import * as systemApi from '../../lib/api/system';

export const SettingsView: React.FC = () => {
  const { useMockData, refreshData } = useApp();
  const [modelTemperature, setModelTemperature] = useState(0.2);
  const [retrievalThreshold, setRetrievalThreshold] = useState(0.82);
  const [requireApproval, setRequireApproval] = useState(true);
  const [autoEscalateNegative, setAutoEscalateNegative] = useState(true);
  const [activeTab, setActiveTab] = useState<'ai' | 'team' | 'security' | 'integrations'>('ai');
  const [isSaved, setIsSaved] = useState(false);
  const [apiHealth, setApiHealth] = useState<{
    loading: boolean;
    health?: string;
    database?: string;
    schema?: string;
    error?: string;
  }>({ loading: false });

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const runApiDiagnostics = async () => {
    setApiHealth({ loading: true });
    try {
      const [health, database, schema] = await Promise.all([
        systemApi.getHealth(),
        systemApi.getDatabaseTest(),
        systemApi.getSchemaTest(),
      ]);
      setApiHealth({
        loading: false,
        health: health.status || (health.success ? 'healthy' : 'unhealthy'),
        database: database.database || (database.success ? 'connected' : 'disconnected'),
        schema: schema.schema || (schema.success ? 'ready' : 'missing'),
      });
    } catch (err) {
      setApiHealth({
        loading: false,
        error: err instanceof Error ? err.message : 'Diagnostics failed',
      });
    }
  };

  useEffect(() => {
    if (!useMockData && activeTab === 'integrations') {
      void runApiDiagnostics();
    }
  }, [useMockData, activeTab]);

  return (
    <div id="settings-view" className="max-w-4xl mx-auto space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Workspace Settings & AI Guardrails
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Configure model parameters, human-in-the-loop safety limits, and team permissions
        </p>
        <p className="text-[11px] text-slate-400 mt-2">
          Data source: <span className="font-semibold text-slate-600 dark:text-slate-300">{useMockData ? 'Mock data' : `Live API (${API_BASE_URL})`}</span>
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl w-fit flex-wrap">
        <button
          onClick={() => setActiveTab('ai')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'ai'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BrainCircuit className="w-3.5 h-3.5 text-indigo-500" />
          <span>AI Model & Safety</span>
        </button>
        <button
          onClick={() => setActiveTab('team')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'team'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-indigo-500" />
          <span>Support Teams & RBAC</span>
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'security'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
          <span>Security & Compliance</span>
        </button>
        <button
          onClick={() => setActiveTab('integrations')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'integrations'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-indigo-500" />
          <span>API Status</span>
        </button>
      </div>

      {activeTab === 'ai' && (
        <div className="space-y-5">
          {/* AI Model Settings Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Model Hyperparameters & Grounding</span>
            </h3>

            <div className="space-y-4 pt-1">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Draft Generation Temperature: {modelTemperature}
                  </span>
                  <span className="text-slate-400">Strict & Deterministic</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={modelTemperature}
                  onChange={(e) => setModelTemperature(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Lower values keep AI replies grounded strictly in facts from the knowledge base.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    RAG Knowledge Retrieval Cosine Similarity: {retrievalThreshold}
                  </span>
                  <span className="text-slate-400">High Precision</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="0.95"
                  step="0.01"
                  value={retrievalThreshold}
                  onChange={(e) => setRetrievalThreshold(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Safety & Human Approval Guardrails */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Human-In-The-Loop Safety Guardrails</span>
            </h3>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-3">
              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Enforce Mandatory Human Review on Outbound Replies
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    AI will never dispatch emails directly to customers without an agent clicking "Approve & Send".
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={requireApproval}
                  onChange={(e) => setRequireApproval(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Auto-Escalate Very Negative Sentiment & Churn Risk
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Automatically triggers high-priority visual flags when phrases matching cancellation or legal action are detected.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={autoEscalateNegative}
                  onChange={(e) => setAutoEscalateNegative(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'team' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Active Support Teams
          </h3>
          <div className="space-y-2">
            {[
              { name: 'Finance Team', members: 4, routing: 'Billing, Invoices, Refunds' },
              { name: 'Engineering', members: 12, routing: 'Webhooks, 502 Errors, API' },
              { name: 'Tier 1 Support', members: 18, routing: 'General Inquiries, How-To' },
              { name: 'Tier 2 Support', members: 6, routing: 'Escalations, Complex Cases' },
              { name: 'Account Management', members: 5, routing: 'Enterprise, Churn Risk' },
              { name: 'Security & Compliance', members: 3, routing: 'SAML, Audit, GDPR' },
            ].map((tm) => (
              <div
                key={tm.name}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{tm.name}</p>
                  <p className="text-[11px] text-slate-500">{tm.routing}</p>
                </div>
                <Badge variant="default" size="sm">{tm.members} Agents</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-500" />
            <span>Privacy & Data Redaction</span>
          </h3>
          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              • PII Redaction: Credit card numbers, Social Security Numbers, and API secret keys are automatically masked with asterisks before processing by LLMs.
            </p>
            <p>
              • Zero Data Retention for Model Training: Customer inquiries are not used to train third-party frontier models.
            </p>
            <p>
              • SOC2 Type II & GDPR compliant audit logging enabled across all agent operations.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'integrations' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-500" />
            <span>Backend Connectivity</span>
          </h3>
          <p className="text-xs text-slate-500">
            Toggle <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800">USE_MOCK_DATA</code> in{' '}
            <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800">src/lib/config.ts</code> to switch between mock and live API data.
          </p>

          {useMockData ? (
            <div className="rounded-xl border border-amber-200/80 bg-amber-50/70 px-4 py-3 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
              Currently using local mock data. Set <strong>USE_MOCK_DATA = false</strong> to call the FastAPI backend.
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
                  <p className="text-slate-500 mb-1">API Health</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {apiHealth.loading ? 'Checking…' : apiHealth.health || apiHealth.error || '—'}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
                  <p className="text-slate-500 mb-1">Database</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {apiHealth.loading ? 'Checking…' : apiHealth.database || '—'}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
                  <p className="text-slate-500 mb-1">Schema</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {apiHealth.loading ? 'Checking…' : apiHealth.schema || '—'}
                  </p>
                </div>
              </div>
              {apiHealth.error && (
                <p className="text-xs text-rose-600 dark:text-rose-400">{apiHealth.error}</p>
              )}
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="secondary" className="h-8 gap-1.5 text-xs" onClick={() => void runApiDiagnostics()}>
                  <RefreshCw className="w-3.5 h-3.5" />
                  Re-run diagnostics
                </Button>
                <Button type="button" variant="outline" className="h-8 gap-1.5 text-xs" onClick={() => void refreshData()}>
                  <Database className="w-3.5 h-3.5" />
                  Refresh app data
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="pt-2 flex items-center justify-end">
        <Button
          onClick={handleSave}
          className="font-bold shadow-xs gap-1.5"
        >
          {isSaved ? <Check className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
          <span>{isSaved ? 'Settings Saved!' : 'Save Changes'}</span>
        </Button>
      </div>
    </div>
  );
};
