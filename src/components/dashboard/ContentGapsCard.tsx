'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { BookPlus, ArrowRight } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const ContentGapsCard: React.FC = () => {
  const { contentGaps, setActivePage, createArticleFromGap, useMockData } = useApp();

  return (
    <div
      id="content-gaps-card"
      className="h-[27rem] p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col"
    >
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <BookPlus className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Knowledge Base Gaps
            </h3>
          </div>
          <Badge variant="warning" size="sm">
            {contentGaps.length} Unresolved
          </Badge>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {useMockData
            ? 'Topics identified in support tickets lacking indexed documentation'
            : 'Inferred from live tickets vs KB article coverage'}
        </p>
      </div>

      <div className="mt-3 flex-1 min-h-0 overflow-y-auto space-y-2.5">
        {contentGaps.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400 text-center px-4">
            No content gaps detected from current API tickets and articles.
          </div>
        ) : (
          contentGaps.slice(0, 4).map((gap, index) => (
            <div
              key={gap.id}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-3 group hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
            >
              <div className="min-w-0 flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {gap.topic}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {gap.ticketCount} tickets • {gap.suggestedCategory}
                  </p>
                </div>
              </div>

              <button
                onClick={() => createArticleFromGap(gap.id)}
                className="px-2.5 py-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-lg border border-indigo-200/80 dark:border-indigo-800/80 shrink-0 transition-colors cursor-pointer"
              >
                + Create Article
              </button>
            </div>
          ))
        )}
      </div>

      <div className="pt-3 mt-auto border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
        <span className="text-xs text-slate-500">
          {useMockData ? 'Auto-clustered via semantic embeddings' : 'Derived from live API data'}
        </span>
        <button
          onClick={() => setActivePage('knowledge-base')}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>View all gaps</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
