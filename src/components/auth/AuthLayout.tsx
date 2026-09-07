'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { AuthBrandPanel } from './AuthBrandPanel';
import { ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '../layout/ThemeToggle';
import { BrandMark } from '../ui/BrandMark';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { isDarkMode, toggleDarkMode, setActivePage } = useApp();

  const handleReturnToDashboard = () => {
    setActivePage('dashboard');
    if (typeof window !== 'undefined' && window.history.pushState) {
      window.history.pushState(null, '', '/');
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 flex flex-col lg:grid lg:grid-cols-2">
      {/* Left Branding Panel (Desktop) */}
      <AuthBrandPanel />

      {/* Right Column: Authentication Form Container */}
      <div className="flex-1 flex flex-col min-h-screen relative overflow-y-auto">
        {/* Top Controls Header */}
        <div className="w-full px-6 py-4 flex items-center justify-between">
          {/* Mobile Top Brand (Visible only when left brand is hidden) */}
          <div className="flex lg:hidden items-center gap-2">
            <BrandMark size="sm" />
            <span className="font-bold text-slate-900 dark:text-white tracking-tight text-sm">
              SupportFlow AI
            </span>
          </div>

          <div className="hidden lg:block">
            <button
              onClick={handleReturnToDashboard}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to overview</span>
            </button>
          </div>

          {/* Theme Switcher */}
          <div className="flex items-center gap-2 ml-auto">
            <ThemeToggle align="right" />
          </div>
        </div>

        {/* Centered Form Area */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-8 sm:py-12">
          <div className="w-full max-w-md animate-in fade-in-50 duration-200">
            {children}
          </div>
        </div>

        {/* Footer info */}
        <div className="w-full px-6 py-4 text-center text-[11px] text-slate-400 dark:text-slate-500">
          SupportFlow AI Platform • Enterprise AI Support Operations
        </div>
      </div>
    </div>
  );
};
