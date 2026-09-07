'use client';

import React, { useMemo, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { mockTicketVolumeData } from '../../data/mockAnalytics';
import { useApp } from '../../context/AppContext';
import { AnalyticsTimeframe, deriveTicketVolume } from '../../lib/analyticsFromTickets';

interface TicketVolumeChartProps {
  timeframe?: AnalyticsTimeframe;
}

export const TicketVolumeChart: React.FC<TicketVolumeChartProps> = ({ timeframe = '30d' }) => {
  const { isDarkMode, tickets, useMockData } = useApp();
  const [activeCategories, setActiveCategories] = useState<Record<string, boolean>>({
    Billing: true,
    Technical: true,
    Account: true,
    'Feature Request': true,
    Shipping: true,
  });

  const chartData = useMemo(() => {
    if (useMockData) return mockTicketVolumeData;
    return deriveTicketVolume(tickets, timeframe);
  }, [useMockData, tickets, timeframe]);

  const categoryColors: Record<string, string> = {
    Billing: '#A855F7',
    Technical: '#3B82F6',
    Account: '#14B8A6',
    'Feature Request': '#06B6D4',
    Shipping: '#F59E0B',
  };

  const toggleCategory = (cat: string) => {
    setActiveCategories((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  return (
    <div
      id="ticket-volume-chart-card"
      className="h-full w-full p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white tracking-tight">
            Ticket Volume Trends
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {useMockData
              ? 'Daily inbound support load by classification'
              : 'Built from live API tickets by day and category'}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {Object.keys(categoryColors).map((cat) => {
            const isSelected = activeCategories[cat];
            const color = categoryColors[cat];
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`text-[10px] uppercase font-bold px-2 py-1 rounded transition-all flex items-center gap-1.5 border cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-slate-700 dark:text-white border-transparent'
                    : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 opacity-60'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 min-h-72 w-full mt-5">
        {chartData.every((d) => d.Total === 0) ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400">
            No ticket volume in this range yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                {Object.keys(categoryColors).map((cat) => (
                  <linearGradient key={cat} id={`grad-${cat}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={categoryColors[cat]} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={categoryColors[cat]} stopOpacity={0.0} />
                  </linearGradient>
                ))}
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDarkMode ? '#334155' : '#E2E8F0'}
                vertical={false}
              />

              <XAxis
                dataKey="date"
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
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                  color: isDarkMode ? '#F8FAFC' : '#0F172A',
                }}
              />

              {Object.keys(categoryColors).map((cat) => {
                if (!activeCategories[cat]) return null;
                return (
                  <Area
                    key={cat}
                    type="monotone"
                    dataKey={cat}
                    stroke={categoryColors[cat]}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill={`url(#grad-${cat})`}
                    stackId="1"
                  />
                );
              })}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
