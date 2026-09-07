'use client';

import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mockDashboardMetrics } from '../../data/mockAnalytics';
import { deriveDashboardMetrics, AnalyticsTimeframe } from '../../lib/analyticsFromTickets';
import { MetricCard } from './MetricCard';
import { TicketVolumeChart } from './TicketVolumeChart';
import { SentimentChart } from './SentimentChart';
import { LiveTicketFeed } from './LiveTicketFeed';
import { AIPerformanceCard } from './AIPerformanceCard';
import { ContentGapsCard } from './ContentGapsCard';
import {
  Inbox,
  Clock,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { tickets, useMockData, isDataLoading } = useApp();
  const [timeframe, setTimeframe] = useState<AnalyticsTimeframe>('30d');

  const currentMetrics = useMemo(() => {
    if (useMockData) {
      return mockDashboardMetrics[timeframe] || mockDashboardMetrics['30d'];
    }
    return deriveDashboardMetrics(tickets, timeframe);
  }, [useMockData, tickets, timeframe]);

  const metricIcons = [
    <Inbox className="w-5 h-5" />,
    <Clock className="w-5 h-5" />,
    <Sparkles className="w-5 h-5" />,
    <ShieldAlert className="w-5 h-5" />,
  ];

  return (
    <div id="dashboard-view" className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
            Real-Time Telemetry
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">
            Support Command Center
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {useMockData
              ? 'Automated ticket triage, AI response drafts & live escalation telemetry'
              : 'Metrics computed from live API tickets'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs">
            {(['7d', '30d', '90d'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  timeframe === t
                    ? 'bg-slate-900 text-white dark:bg-indigo-600 dark:text-white font-semibold'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {t === '7d' ? '7 Days' : t === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!useMockData && isDataLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-slate-200/70 dark:bg-slate-800/70 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentMetrics.map((metric, idx) => (
            <MetricCard key={metric.title} data={metric} icon={metricIcons[idx]} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2 h-full">
          <TicketVolumeChart timeframe={timeframe} />
        </div>
        <div className="lg:col-span-1 h-full">
          <SentimentChart />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <LiveTicketFeed />
        <AIPerformanceCard />
        <ContentGapsCard />
      </div>
    </div>
  );
};
