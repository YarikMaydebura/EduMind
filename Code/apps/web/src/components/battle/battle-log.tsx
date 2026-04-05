'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface LogEntry {
  turn: number;
  actorId: string;
  action: string;
  damage?: number;
  healing?: number;
  isCrit?: boolean;
  isDodged?: boolean;
  statusApplied?: string;
  message: string;
}

interface BattleLogProps {
  entries: LogEntry[];
  maxVisible?: number;
}

function getEntryColor(entry: LogEntry): string {
  if (entry.isDodged) return 'text-gray-400';
  if (entry.isCrit) return 'text-amber-400 font-semibold';
  if (entry.healing && entry.healing > 0) return 'text-green-400';
  if (entry.statusApplied === 'BUFF') return 'text-yellow-400';
  if (entry.statusApplied === 'DEBUFF') return 'text-orange-400';
  if (entry.statusApplied) return 'text-pink-400';
  if (entry.damage && entry.damage > 0) return 'text-red-400';
  if (entry.action === 'DEFEND') return 'text-blue-400';
  return 'text-muted-foreground';
}

export function BattleLog({ entries, maxVisible = 8 }: BattleLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const visibleEntries = entries.slice(-maxVisible);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries.length]);

  return (
    <div className="h-32 overflow-y-auto rounded-lg border bg-muted/20 p-2">
      {visibleEntries.length === 0 ? (
        <p className="py-4 text-center text-xs text-muted-foreground">Battle begins...</p>
      ) : (
        <div className="space-y-0.5">
          {visibleEntries.map((entry, i) => (
            <motion.div
              key={`${entry.turn}-${entry.actorId}-${i}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className={`text-xs ${getEntryColor(entry)}`}
            >
              <span className="mr-1 text-[10px] text-muted-foreground/50">[T{entry.turn}]</span>
              {entry.message}
            </motion.div>
          ))}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}
