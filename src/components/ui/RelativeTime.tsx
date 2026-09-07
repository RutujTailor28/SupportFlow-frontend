'use client';

import React, { useEffect, useState } from 'react';
import { formatTimeAgo } from '../../lib/utils';
import { cn } from '../../lib/utils';

interface RelativeTimeProps {
  date: string;
  className?: string;
  prefix?: string;
}

export const RelativeTime: React.FC<RelativeTimeProps> = ({ date, className, prefix }) => {
  const [label, setLabel] = useState<string>('');

  useEffect(() => {
    const update = () => setLabel(formatTimeAgo(date));
    update();
    const interval = window.setInterval(update, 60_000);
    return () => window.clearInterval(interval);
  }, [date]);

  return (
    <span className={cn(className)}>
      {prefix}
      {label || '\u00a0'}
    </span>
  );
};
