'use client';

import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { mockSentimentDistribution } from '../../data/mockAnalytics';
import { useApp } from '../../context/AppContext';
import { deriveSentimentDistribution } from '../../lib/analyticsFromTickets';

export const SentimentChart: React.FC = () => {
  const { isDarkMode, tickets, useMockData } = useApp();

  const distribution = useMemo(() => {
    if (useMockData) return mockSentimentDistribution;
    return deriveSentimentDistribution(tickets);
  }, [useMockData, tickets]);

  const total = distribution.reduce((sum, item) => sum + item.value, 0);

  return (
    <div
      id="sentiment-chart-card"
      className="h-full w-full p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col"
    >
      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800 dark:text-white tracking-tight">
            Sentiment Analysis
          </h3>
          <span className="text-[10px] uppercase font-bold text-slate-400">NLP Engine</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {useMockData
            ? 'Sentiment distribution of customer tickets'
            : 'Sentiment distribution from live API tickets'}
        </p>
      </div>

      <div className="relative flex-1 min-h-48 w-full my-2 flex items-center justify-center">
        {total === 0 ? (
          <div className="text-xs text-slate-400">No sentiment data yet</div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#0F172A' : '#FFFFFF',
                    borderColor: isDarkMode ? '#334155' : '#E2E8F0',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: isDarkMode ? '#F8FAFC' : '#0F172A',
                  }}
                  formatter={(value: any, name: any) => [`${value} tickets`, `${name}`]}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                {total >= 1000 ? `${(total / 1000).toFixed(1)}k` : total}
              </span>
              <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                Analyzed
              </span>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 pt-3 mt-auto border-t border-slate-100 dark:border-slate-800 shrink-0">
        {distribution.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-600 dark:text-slate-400 truncate">{item.name}</span>
            </div>
            <span className="font-semibold text-slate-900 dark:text-white ml-2">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
