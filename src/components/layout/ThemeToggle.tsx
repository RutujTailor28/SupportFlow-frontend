'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp, ThemeMode } from '../../context/AppContext';
import { Sun, Moon, Monitor, Check, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  align?: 'left' | 'right';
  compact?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className,
  showLabel = false,
  align = 'right',
  compact = false,
}) => {
  const { theme, setTheme, isDarkMode, mounted } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const options: { id: ThemeMode; label: string; icon: React.FC<{ className?: string }>; description: string }[] = [
    { id: 'light', label: 'Light', icon: Sun, description: 'Clean light appearance' },
    { id: 'dark', label: 'Dark', icon: Moon, description: 'Eye-friendly dark theme' },
    { id: 'system', label: 'System', icon: Monitor, description: 'Match system preference' },
  ];

  const currentIcon = !mounted ? (
    <Monitor className={cn(compact ? 'w-3.5 h-3.5' : 'w-4 h-4', 'text-slate-500 dark:text-slate-400')} />
  ) : theme === 'system' ? (
    <Monitor className={cn(compact ? 'w-3.5 h-3.5' : 'w-4 h-4', 'text-slate-500 dark:text-slate-400')} />
  ) : isDarkMode ? (
    <Moon className={cn(compact ? 'w-3.5 h-3.5' : 'w-4 h-4', 'text-indigo-400 dark:text-indigo-400')} />
  ) : (
    <Sun className={cn(compact ? 'w-3.5 h-3.5' : 'w-4 h-4', 'text-amber-500')} />
  );

  const currentLabel = mounted ? (options.find((opt) => opt.id === theme)?.label || 'Theme') : 'Theme';

  return (
    <div className={cn('relative inline-block text-left', className)} ref={dropdownRef}>
      <button
        type="button"
        id="theme-toggle-button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={`Theme: ${currentLabel}. Click to switch theme.`}
        className={cn(
          'inline-flex items-center justify-center gap-1.5 rounded-lg border transition-all cursor-pointer select-none',
          'bg-white dark:bg-slate-800/90 border-slate-200/80 dark:border-slate-700/80',
          'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50',
          compact ? 'p-1.5 text-xs' : 'px-2.5 py-1.5 text-xs font-medium shadow-2xs'
        )}
      >
        {currentIcon}
        {showLabel && (
          <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
            {currentLabel}
          </span>
        )}
        <ChevronDown
          className={cn(
            'w-3 h-3 text-slate-400 transition-transform duration-200',
            isOpen && 'transform rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div
          id="theme-dropdown-menu"
          role="menu"
          aria-orientation="vertical"
          className={cn(
            'absolute z-50 mt-1.5 w-44 rounded-xl shadow-xl py-1.5',
            'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800',
            'backdrop-blur-md animate-in fade-in zoom-in-95 duration-150',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          <div className="px-2.5 py-1 mb-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
              Interface Theme
            </span>
          </div>

          <div className="space-y-0.5 px-1">
            {options.map((option) => {
              const Icon = option.icon;
              const isSelected = theme === option.id;

              return (
                <button
                  key={option.id}
                  role="menuitem"
                  onClick={() => {
                    setTheme(option.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer group',
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      className={cn(
                        'w-4 h-4 transition-colors',
                        option.id === 'light' && 'text-amber-500',
                        option.id === 'dark' && 'text-indigo-400',
                        option.id === 'system' && 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'
                      )}
                    />
                    <span>{option.label}</span>
                  </div>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
