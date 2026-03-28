'use client';

import { motion } from 'framer-motion';
import { Check, Lock, Trophy } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { scaleOnHover } from '@/lib/motion';

const RARITY_STYLES: Record<string, { border: string; bg: string; text: string }> = {
  COMMON: { border: 'border-gray-300', bg: 'bg-gray-100', text: 'text-gray-600' },
  UNCOMMON: { border: 'border-green-400', bg: 'bg-green-100', text: 'text-green-700' },
  RARE: { border: 'border-blue-400', bg: 'bg-blue-100', text: 'text-blue-700' },
  EPIC: { border: 'border-purple-400', bg: 'bg-purple-100', text: 'text-purple-700' },
  LEGENDARY: { border: 'border-yellow-400', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  MYTHIC: { border: 'border-red-400', bg: 'bg-red-100', text: 'text-red-700' },
};

const RARITY_LABELS: Record<string, string> = {
  COMMON: 'Common',
  UNCOMMON: 'Uncommon',
  RARE: 'Rare',
  EPIC: 'Epic',
  LEGENDARY: 'Legendary',
  MYTHIC: 'Mythic',
};

export interface AchievementCardData {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: string;
  xpReward: number;
  isHidden: boolean;
  isUnlocked: boolean;
  progress: number;
  progressMax: number;
  unlockedAt: string | null;
  unlocksTitle: string | null;
  unlocksBadge: string | null;
  unlocksFrame: string | null;
}

export function AchievementCard({ achievement }: { achievement: AchievementCardData }) {
  const styles = RARITY_STYLES[achievement.rarity] ?? RARITY_STYLES.COMMON!;
  const rarityLabel = RARITY_LABELS[achievement.rarity] ?? achievement.rarity;
  const progressPercent =
    achievement.progressMax > 0
      ? Math.min(100, Math.round((achievement.progress / achievement.progressMax) * 100))
      : 0;

  return (
    <motion.div {...scaleOnHover}>
    <Card
      className={`relative border-2 transition-colors ${
        achievement.isUnlocked ? styles.border : 'border-muted opacity-75'
      }`}
    >
      <CardContent className="p-4">
        {/* Icon + Title row */}
        <div className="flex items-start gap-3">
          <span className="text-2xl" role="img" aria-label={achievement.name}>
            {achievement.icon}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-sm font-semibold">{achievement.name}</h3>
              {achievement.isUnlocked && <Check className="h-4 w-4 shrink-0 text-green-500" />}
              {!achievement.isUnlocked && <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
              {achievement.description}
            </p>
          </div>
        </div>

        {/* Rarity + XP reward */}
        <div className="mt-3 flex items-center gap-2">
          <Badge variant="outline" className={`text-xs ${styles.bg} ${styles.text}`}>
            {rarityLabel}
          </Badge>
          <span className="ml-auto flex items-center gap-1 text-xs text-yellow-600">
            <Trophy className="h-3 w-3" />+{achievement.xpReward} XP
          </span>
        </div>

        {/* Progress bar for in-progress achievements */}
        {!achievement.isUnlocked && achievement.progressMax > 0 && (
          <div className="mt-3">
            <div className="mb-1 flex justify-between text-xs text-muted-foreground">
              <span>
                {achievement.progress}/{achievement.progressMax}
              </span>
              <span>{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} max={100} />
          </div>
        )}

        {/* Unlocked date */}
        {achievement.isUnlocked && achievement.unlockedAt && (
          <p className="mt-3 text-xs text-muted-foreground">
            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
          </p>
        )}

        {/* Cosmetic rewards */}
        {(achievement.unlocksTitle || achievement.unlocksBadge || achievement.unlocksFrame) && (
          <div className="mt-2 flex flex-wrap gap-1">
            {achievement.unlocksTitle && (
              <Badge variant="secondary" className="text-xs">
                Title: {achievement.unlocksTitle}
              </Badge>
            )}
            {achievement.unlocksBadge && (
              <Badge variant="secondary" className="text-xs">
                Badge
              </Badge>
            )}
            {achievement.unlocksFrame && (
              <Badge variant="secondary" className="text-xs">
                Frame
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
    </motion.div>
  );
}
