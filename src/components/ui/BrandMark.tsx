'use client';

import React from 'react';
import { cn } from '../../lib/utils';

interface BrandMarkProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: { box: 'w-7 h-7', text: 'text-sm' },
  md: { box: 'w-8 h-8', text: 'text-base' },
  lg: { box: 'w-9 h-9', text: 'text-lg' },
};

export const BrandMark: React.FC<BrandMarkProps> = ({ size = 'md', className }) => {
  const s = sizeClasses[size];
  return (
    <div
      className={cn(
        s.box,
        'rounded-lg bg-indigo-500 flex items-center justify-center text-white shadow-sm shadow-indigo-500/30 shrink-0',
        className
      )}
    >
      <span className={cn(s.text, 'font-bold leading-none select-none')}>S</span>
    </div>
  );
};
