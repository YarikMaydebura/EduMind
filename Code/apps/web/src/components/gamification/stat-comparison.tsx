'use client';

import { motion } from 'framer-motion';

import { STAT_CONFIG, STAT_KEYS } from '@/lib/gamification/stat-config';

interface StatComparisonProps {
  currentStats: Record<string, number>;
  newStats: Record<string, number>;
}

export function StatComparison({ currentStats, newStats }: StatComparisonProps) {
  return (
    <div className="space-y-2">
      {STAT_KEYS.map((key) => {
        const config = STAT_CONFIG[key];
        if (!config) return null;
        const current = currentStats[key] ?? 0;
        const next = newStats[key] ?? 0;
        const diff = next - current;

        return (
          <div key={key} className="flex items-center gap-3">
            <span className="w-16 text-right text-xs font-medium text-muted-foreground">
              {config.label}
            </span>
            <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-muted">
              {/* Current stat */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (current / config.max) * 100)}%` }}
                transition={{ duration: 0.4 }}
                className={`absolute inset-y-0 left-0 rounded-full ${config.barClass} opacity-40`}
              />
              {/* New stat */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (next / config.max) * 100)}%` }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`absolute inset-y-0 left-0 rounded-full ${config.barClass}`}
              />
            </div>
            <div className="flex w-20 items-center gap-1 text-xs">
              <span className="font-bold">{next}</span>
              {diff !== 0 && (
                <span className={diff > 0 ? 'text-green-500' : 'text-red-500'}>
                  ({diff > 0 ? '+' : ''}{diff})
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
