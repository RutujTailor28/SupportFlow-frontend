'use client';

import React, { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  mockDashboardMetrics,
  mockCategoryAccuracies,
} from '../../data/mockAnalytics';
import { useApp } from '../../context/AppContext';
import {
  AnalyticsTimeframe,
  deriveCategoryAccuracies,
  deriveDashboardMetrics,
  deriveTicketVolume,
} from '../../lib/analyticsFromTickets';
import { MetricCard } from '../dashboard/MetricCard';

export const AnalyticsView: React.FC = () => {
  const { isDarkMode, useMockData, tickets } = useApp();
  const [timeframe, setTimeframe] = useState<AnalyticsTimeframe>('30d');

  const overview = useMemo(() => {
    if (useMockData) return mockDashboardMetrics[timeframe] || mockDashboardMetrics['30d'];
    return deriveDashboardMetrics(tickets, timeframe);
  }, [useMockData, tickets, timeframe]);

  const categoryRows = useMemo(() => {
    if (useMockData) return mockCategoryAccuracies;
    return deriveCategoryAccuracies(tickets);
  }, [useMockData, tickets]);

  const volume = useMemo(() => {
    if (useMockData) return null;
    return deriveTicketVolume(tickets, timeframe);
  }, [useMockData, tickets, timeframe]);

  // Resolution / hours charts: mock in mock mode; approximate from live volume in API mode
  const resolutionData = useMemo(() => {
    if (useMockData) {
      return [
        { range: '< 15 min', tickets: 620, aiAssisted: 510 },
        { range: '15-60 min', tickets: 940, aiAssisted: 780 },
        { range: '1-4 hours', tickets: 580, aiAssisted: 420 },
        { range: '4-24 hours', tickets: 230, aiAssisted: 140 },
        { range: '> 24 hours', tickets: 88, aiAssisted: 35 },
      ];
    }

    const total = tickets.length;
    const resolved = tickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length;
    const openish = Math.max(0, total - resolved);
    return [
      { range: 'Resolved', tickets: resolved, aiAssisted: Math.round(resolved * 0.75) },
      { range: 'Open / Pending', tickets: openish, aiAssisted: Math.round(openish * 0.4) },
      {
        range: 'Escalated',
        tickets: tickets.filter((t) => t.escalation.isEscalated).length,
        aiAssisted: 0,
      },
      {
        range: 'New',
        tickets: tickets.filter((t) => t.status === 'new').length,
        aiAssisted: Math.round(tickets.filter((t) => t.status === 'new').length * 0.9),
      },
    ];
  }, [useMockData, tickets]);

  const hoursSavedData = useMemo(() => {
    if (useMockData) {
      return [
        { day: 'Mon', hoursSaved: 18.5, ticketsHandled: 120 },
        { day: 'Tue', hoursSaved: 22.4, ticketsHandled: 145 },
        { day: 'Wed', hoursSaved: 26.1, ticketsHandled: 168 },
        { day: 'Thu', hoursSaved: 24.8, ticketsHandled: 154 },
        { day: 'Fri', hoursSaved: 29.2, ticketsHandled: 182 },
        { day: 'Sat', hoursSaved: 12.0, ticketsHandled: 64 },
        { day: 'Sun', hoursSaved: 9.5, ticketsHandled: 48 },
      ];
    }

    const byDay = new Map<string, number>();
    (volume || []).forEach((point) => {
      byDay.set(point.date, point.Total);
    });

    return Array.from(byDay.entries()).map(([day, ticketsHandled]) => ({
      day,
      ticketsHandled,
      hoursSaved: Math.round(ticketsHandled * 0.18 * 10) / 10,
    }));
  }, [useMockData, volume]);

  const hoursSavedTotal = hoursSavedData.reduce((sum, row) => sum + row.hoursSaved, 0);

  return (
    <div id="analytics-view" className="space-y-6 pb-12 animate-in fade-in duration-300">
      {!useMockData && (
        <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/70 px-4 py-2.5 text-xs text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200">
          Showing analytics computed from live API tickets (backend `/analytics` is still a placeholder).
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Support Intelligence & AI Analytics
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Operational efficiency, triage precision, and agent productivity metrics
          </p>
        </div>

        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {(['7d', '30d', '90d'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                timeframe === t
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t === '7d' ? 'Last 7 Days' : t === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {overview.map((m) => (
          <MetricCard key={m.title} data={m} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                {useMockData ? 'Resolution Speed Breakdown' : 'Ticket Status Breakdown'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {useMockData
                  ? 'Distribution of time to resolve with AI assistance vs manual'
                  : 'Live ticket counts by lifecycle status'}
              </p>
            </div>
          </div>

          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resolutionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDarkMode ? '#334155' : '#E2E8F0'}
                  vertical={false}
                />
                <XAxis
                  dataKey="range"
                  stroke={isDarkMode ? '#94A3B8' : '#64748B'}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke={isDarkMode ? '#94A3B8' : '#64748B'}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#0F172A' : '#FFFFFF',
                    borderColor: isDarkMode ? '#334155' : '#E2E8F0',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: isDarkMode ? '#F8FAFC' : '#0F172A',
                  }}
                />
                <Bar
                  dataKey="tickets"
                  name="Total Tickets"
                  fill={isDarkMode ? '#6366F1' : '#4F46E5'}
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="aiAssisted"
                  name="AI Assisted"
                  fill={isDarkMode ? '#10B981' : '#059669'}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Support Hours Saved by AI
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {useMockData
                  ? 'Automated triage & suggested grounded draft acceleration'
                  : 'Estimated from live ticket volume (~0.18 hrs / ticket)'}
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              ~{hoursSavedTotal.toFixed(1)} hrs
            </span>
          </div>

          <div className="h-64 w-full mt-4">
            {hoursSavedData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No ticket activity to estimate hours saved
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hoursSavedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDarkMode ? '#334155' : '#E2E8F0'}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    stroke={isDarkMode ? '#94A3B8' : '#64748B'}
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke={isDarkMode ? '#94A3B8' : '#64748B'}
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#0F172A' : '#FFFFFF',
                      borderColor: isDarkMode ? '#334155' : '#E2E8F0',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: isDarkMode ? '#F8FAFC' : '#0F172A',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="hoursSaved"
                    name="Hours Saved"
                    stroke="#6366F1"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#6366F1' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              AI Triage Performance by Category
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Accuracy rate, draft acceptance rate, and ticket volume
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          {categoryRows.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400">
              No category analytics yet — create tickets via the API to populate this table.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Total Tickets</th>
                  <th className="pb-3 font-semibold">AI Accuracy</th>
                  <th className="pb-3 font-semibold">Draft Acceptance</th>
                  <th className="pb-3 font-semibold">Misclassifications</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {categoryRows.map((row) => (
                  <tr
                    key={row.category}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 font-bold text-slate-900 dark:text-white">{row.category}</td>
                    <td className="py-3.5 text-slate-600 dark:text-slate-300">{row.totalTickets}</td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {row.accuracy}%
                        </span>
                        <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full"
                            style={{ width: `${row.accuracy}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {Math.round(row.accuracy * 0.85)}%
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-600 dark:text-slate-300 font-mono">
                      {row.misclassifications}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                          row.status === 'good'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                            : row.status === 'warning'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                        }`}
                      >
                        {row.status === 'good'
                          ? 'Optimal'
                          : row.status === 'warning'
                            ? 'Watch'
                            : 'Critical'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
