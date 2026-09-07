'use client';

import React from 'react';
import { MetricData } from '../../types/analytics';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface MetricCardProps {
  data: MetricData;
  icon?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({ data }) => {
  return (
    <div
      id={`metric-card-${data.title.toLowerCase().replace(/\s+/g, '-')}`}
      className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-sm transition-all"
    >
      <div className="text-slate-400 dark:text-slate-500 text-xs font-medium mb-1 uppercase tracking-wider">
        {data.title}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
          {data.value}
        </span>
        <span
          className={cn(
            'text-xs font-bold',
            data.isPositive ? 'text-green-500' : 'text-rose-500'
          )}
        >
          {data.trend === 'up' && '↑ '}
          {data.trend === 'down' && '↓ '}
          {data.change}
        </span>
      </div>

      {/* Progress / Micro indicator */}
      <div className="mt-4 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            data.isPositive ? 'bg-indigo-500' : 'bg-rose-500'
          )}
          style={{
            width: data.title.includes('Draft')
              ? '78%'
              : data.title.includes('Escalation')
              ? '15%'
              : data.title.includes('Response')
              ? '60%'
              : '70%',
          }}
        />
      </div>
    </div>
  );
};
