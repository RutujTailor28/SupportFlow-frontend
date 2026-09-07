'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast, setSelectedTicketId, setActivePage } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      id="toast-container"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />,
          error: <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />,
          info: <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />,
        };

        const borderColors = {
          success: 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/90 dark:bg-slate-900/95',
          warning: 'border-amber-200 dark:border-amber-800/60 bg-amber-50/90 dark:bg-slate-900/95',
          error: 'border-rose-200 dark:border-rose-800/60 bg-rose-50/90 dark:bg-slate-900/95',
          info: 'border-indigo-200 dark:border-indigo-800/60 bg-white/95 dark:bg-slate-900/95',
        };

        return (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            className={cn(
              'pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-200 animate-in slide-in-from-bottom-3',
              borderColors[toast.type]
            )}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                {toast.title}
              </h4>
              <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                {toast.message}
              </p>
              {toast.ticketId && (
                <button
                  onClick={() => {
                    if (toast.ticketId) {
                      setSelectedTicketId(toast.ticketId);
                      setActivePage('workspace');
                      removeToast(toast.id);
                    }
                  }}
                  className="mt-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  Open in Workspace →
                </button>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md transition-colors cursor-pointer"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
