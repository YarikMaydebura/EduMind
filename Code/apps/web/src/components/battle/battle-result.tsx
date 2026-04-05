'use client';

import { motion } from 'framer-motion';
import { Swords, Trophy } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface BattleResultProps {
  status: 'P1_WIN' | 'P2_WIN' | 'DRAW';
  rewards: { player1XP: number; player1KP: number } | null;
}

export function BattleResult({ status, rewards }: BattleResultProps) {
  const isVictory = status === 'P1_WIN';
  const isDraw = status === 'DRAW';

  const config = isVictory
    ? { icon: '🏆', title: 'Victory!', color: 'text-amber-400', bg: 'from-amber-500/20 to-yellow-500/20' }
    : isDraw
      ? { icon: '⚖️', title: 'Draw', color: 'text-gray-400', bg: 'from-gray-500/20 to-slate-500/20' }
      : { icon: '💀', title: 'Defeated', color: 'text-red-400', bg: 'from-red-500/20 to-rose-500/20' };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', duration: 0.6 }}
      className="flex flex-col items-center py-8"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', delay: 0.2 }}
        className={`mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${config.bg} text-4xl shadow-lg`}
      >
        {config.icon}
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`mb-2 text-3xl font-bold ${config.color}`}
      >
        {config.title}
      </motion.h2>

      {rewards && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6 flex gap-3"
        >
          <Badge variant="secondary" className="text-sm">
            +{rewards.player1XP} XP
          </Badge>
          <Badge variant="secondary" className="text-sm">
            +{rewards.player1KP} KP
          </Badge>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex gap-3"
      >
        <Button asChild>
          <Link href="/s/battles">
            <Swords className="mr-2 h-4 w-4" />
            Battle Again
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/s/character">
            <Trophy className="mr-2 h-4 w-4" />
            Character
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}
