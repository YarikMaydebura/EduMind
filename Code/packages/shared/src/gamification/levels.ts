import { LEVEL_TITLES } from '../constants/levels.constants';
import { MAX_LEVEL } from '../constants/xp.constants';
import type { LevelProgress } from '../types/gamification.types';

export function calculateLevel(xp: number): number {
  return Math.min(MAX_LEVEL, Math.floor(Math.sqrt(xp / 100)) + 1);
}

export function xpForLevel(level: number): number {
  return Math.pow(level - 1, 2) * 100;
}

export function xpToNextLevel(currentXP: number): LevelProgress {
  const currentLevel = calculateLevel(currentXP);
  const currentLevelXP = xpForLevel(currentLevel);
  const nextLevelXP = xpForLevel(currentLevel + 1);

  return {
    current: currentXP - currentLevelXP,
    needed: nextLevelXP - currentLevelXP,
    progress: (currentXP - currentLevelXP) / (nextLevelXP - currentLevelXP),
  };
}

export function getLevelTitle(level: number, subject?: string): string {
  const titles = subject ? LEVEL_TITLES[subject] : LEVEL_TITLES.global;
  if (!titles) return 'Newcomer';

  const applicableLevels = Object.keys(titles)
    .map(Number)
    .filter((l) => l <= level)
    .sort((a, b) => b - a);

  return titles[applicableLevels[0]!] || 'Newcomer';
}
