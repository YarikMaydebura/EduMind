'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface Props {
  level: number;
  title: string | null;
  onDismiss: () => void;
}

export function LevelUpToastContent({ level, title, onDismiss }: Props) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="flex items-center gap-3 rounded-lg border bg-card p-4 shadow-lg"
      onClick={onDismiss}
    >
      <motion.div
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 0.6, repeat: 2 }}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10"
      >
        <Star className="h-6 w-6 fill-yellow-500 text-yellow-500" />
      </motion.div>
      <div>
        <p className="text-sm font-bold text-foreground">Level Up!</p>
        <p className="text-lg font-bold text-primary">Level {level}</p>
        {title && <p className="text-xs text-muted-foreground">&quot;{title}&quot;</p>}
      </div>
    </motion.div>
  );
}
