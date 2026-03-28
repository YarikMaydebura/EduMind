'use client';

import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

const RARITY_COLORS: Record<string, string> = {
  COMMON: 'bg-gray-100 text-gray-700',
  UNCOMMON: 'bg-green-100 text-green-700',
  RARE: 'bg-blue-100 text-blue-700',
  EPIC: 'bg-purple-100 text-purple-700',
  LEGENDARY: 'bg-yellow-100 text-yellow-700',
  MYTHIC: 'bg-red-100 text-red-700',
};

const RARITY_LABELS: Record<string, string> = {
  COMMON: 'Common',
  UNCOMMON: 'Uncommon',
  RARE: 'Rare',
  EPIC: 'Epic',
  LEGENDARY: 'Legendary',
  MYTHIC: 'Mythic',
};

interface Props {
  name: string;
  icon: string;
  rarity: string;
  xpReward: number;
  onDismiss: () => void;
}

export function AchievementToastContent({ name, icon, rarity, xpReward, onDismiss }: Props) {
  const rarityLabel = RARITY_LABELS[rarity] ?? rarity;
  const rarityColor = RARITY_COLORS[rarity] ?? RARITY_COLORS.COMMON;

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="flex items-center gap-3 rounded-lg border bg-card p-4 shadow-lg"
      onClick={onDismiss}
    >
      <span className="text-3xl">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-muted-foreground">Achievement Unlocked!</p>
        <p className="truncate text-sm font-bold text-foreground">{name}</p>
        <div className="mt-1 flex items-center gap-2">
          <Badge variant="outline" className={`text-xs ${rarityColor}`}>
            {rarityLabel}
          </Badge>
          <span className="flex items-center gap-1 text-xs text-yellow-600">
            <Trophy className="h-3 w-3" />+{xpReward} XP
          </span>
        </div>
      </div>
    </motion.div>
  );
}
