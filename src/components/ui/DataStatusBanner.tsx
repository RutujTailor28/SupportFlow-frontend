'use client';

import React from 'react';
import { AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from './Button';

/** Shows API loading / error banners without changing page layouts. */
export const DataStatusBanner: React.FC = () => {
  const { useMockData, isDataLoading, dataError, refreshData } = useApp();

  if (useMockData) return null;

  if (isDataLoading) {
    return (
      <div className="mb-4 flex items-center gap-2 rounded-xl border border-indigo-200/80 bg-indigo-50/80 px-4 py-2.5 text-xs text-indigo-800 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-200">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        <span className="font-medium">Loading live data from the API…</span>
      </div>
    );
  }

  if (dataError) {
    return (
      <div className="mb-4 flex flex-col gap-3 rounded-xl border border-rose-200/80 bg-rose-50/80 px-4 py-3 text-xs text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <div>
            <p className="font-semibold">Could not load API data</p>
            <p className="mt-0.5 opacity-90">{dataError}</p>
          </div>
        </div>
        <Button
          type="button"
          variant="secondary"
          className="h-8 shrink-0 gap-1.5 px-3 text-xs"
          onClick={() => void refreshData()}
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Retry
        </Button>
      </div>
    );
  }

  return null;
};
