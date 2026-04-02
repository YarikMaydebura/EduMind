import { calculateBattleStats, getSubjectCategory } from '@edumind/shared';
import type { BattleAttributes } from '@edumind/shared';

import { db } from '@/lib/db';

import { STAT_CONFIG } from './stat-config';

export interface ProposedClass {
  id: string;
  name: string;
  description: string;
  passives: Record<string, number>;
  matchScore: number;
  matchReason: string;
}

/**
 * Aggregate a student's subject averages grouped by conversion category.
 * Uses averageScore from StudentClassProfile (falls back to classLevel × 10).
 */
export async function getStudentSubjectAverages(
  studentId: string,
): Promise<Record<string, number>> {
  const profiles = await db.studentClassProfile.findMany({
    where: { studentId },
    select: {
      averageScore: true,
      classLevel: true,
      class: { select: { subject: true } },
    },
  });

  const categoryTotals: Record<string, { sum: number; count: number }> = {};

  for (const p of profiles) {
    const category = getSubjectCategory(p.class.subject);
    if (!category) continue;

    const value = p.averageScore ?? p.classLevel * 10;
    if (!categoryTotals[category]) {
      categoryTotals[category] = { sum: 0, count: 0 };
    }
    categoryTotals[category].sum += value;
    categoryTotals[category].count += 1;
  }

  const averages: Record<string, number> = {};
  for (const [cat, { sum, count }] of Object.entries(categoryTotals)) {
    averages[cat] = Math.round(sum / count);
  }

  return averages;
}

/**
 * Propose the best-matching Common character classes for a theme
 * based on the student's academic profile.
 */
export async function proposeClasses(
  studentId: string,
  theme: string,
): Promise<ProposedClass[]> {
  const [subjectAverages, classes] = await Promise.all([
    getStudentSubjectAverages(studentId),
    db.characterClass.findMany({
      where: { theme: theme as 'FANTASY', rarity: 'CLASS_COMMON' },
      select: { id: true, name: true, description: true, passives: true },
    }),
  ]);

  const stats = calculateBattleStats(subjectAverages);

  return classes
    .map((c) => {
      const passives = (c.passives ?? {}) as Record<string, number>;
      const passiveKeys = Object.keys(passives).filter((k) => k in stats);

      // Score = sum of the student's values for stats this class boosts
      const score = passiveKeys.reduce((sum, k) => sum + (stats[k as keyof BattleAttributes] ?? 0), 0);

      // Build reason from top matching stats
      const reason = passiveKeys
        .sort((a, b) => (stats[b as keyof BattleAttributes] ?? 0) - (stats[a as keyof BattleAttributes] ?? 0))
        .slice(0, 2)
        .map((k) => STAT_CONFIG[k]?.label ?? k)
        .join(', ');

      return {
        id: c.id,
        name: c.name,
        description: c.description,
        passives,
        matchScore: score,
        matchReason: reason ? `Strong in ${reason}` : 'Balanced build',
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}
