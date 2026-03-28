'use client';

import { Flame } from 'lucide-react';

import { cn } from '@/lib/utils';

interface StreakDisplayProps {
  streakDays: number;
  longestStreak?: number;
  showLongest?: boolean;
  className?: string;
}

export function StreakDisplay({
  streakDays,
  longestStreak,
  showLongest = true,
  className,
}: StreakDisplayProps) {
  const isActive = streakDays > 0;

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="flex items-center gap-1.5">
        <Flame
          className={cn('h-4 w-4', isActive ? 'text-orange-500' : 'text-muted-foreground')}
        />
        <span className={cn('text-2xl font-bold', !isActive && 'text-muted-foreground')}>
          {streakDays}
        </span>
        <span className="text-sm text-muted-foreground">
          {streakDays === 1 ? 'day' : 'days'}
        </span>
      </div>
      {showLongest && longestStreak != null && longestStreak > 0 && (
        <span className="text-xs text-muted-foreground">Best: {longestStreak} days</span>
      )}
    </div>
  );
}
