'use client';

import { motion } from 'framer-motion';

interface StatBarProps {
  label: string;
  value: number;
  max: number;
  barClass: string;
  delay?: number;
}

export function StatBar({ label, value, max, barClass, delay = 0 }: StatBarProps) {
  const pct = Math.min(100, (value / max) * 100);

  return (
    <div className="flex items-center gap-3">
      <span className="w-16 text-right text-xs font-medium text-muted-foreground">{label}</span>
      <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay, duration: 0.6, ease: 'easeOut' }}
          className={`absolute inset-y-0 left-0 rounded-full ${barClass}`}
        />
      </div>
      <span className="w-10 text-xs font-bold">{value}</span>
    </div>
  );
}
