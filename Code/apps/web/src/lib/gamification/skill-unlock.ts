import type { StudentProgressData, RequirementCheck, UnlockCheckResult } from './class-unlock';
import { getStudentProgressData } from './class-unlock';

import { db } from '@/lib/db';

export { getStudentProgressData };

/**
 * Check if a student meets a skill's unlock conditions.
 * Extends the class-unlock pattern with additional skill-specific conditions:
 * - classRarity: student's current class must be at or above this rarity
 * - exclusiveClass: student's current class name must match exactly
 */
export function checkSkillUnlock(
  progress: StudentProgressData,
  unlockConditions: Record<string, unknown>,
  characterInfo?: { classRarity: string; className: string } | null,
): UnlockCheckResult {
  const checks: RequirementCheck[] = [];

  // minLevel
  if (unlockConditions.minLevel != null) {
    const req = unlockConditions.minLevel as number;
    checks.push({ key: 'minLevel', label: 'Level', required: req, current: progress.level, met: progress.level >= req });
  }

  // subjects
  if (unlockConditions.subjects) {
    const subjects = unlockConditions.subjects as Record<string, number>;
    for (const [category, minScore] of Object.entries(subjects)) {
      const current = progress.subjectAverages[category] ?? 0;
      checks.push({
        key: `subject_${category}`,
        label: `${category.replace(/_/g, ' ')} avg`,
        required: minScore,
        current: Math.round(current),
        met: current >= minScore,
      });
    }
  }

  // achievements
  if (unlockConditions.achievements != null) {
    const req = unlockConditions.achievements as number;
    checks.push({ key: 'achievements', label: 'Achievements', required: req, current: progress.achievementCount, met: progress.achievementCount >= req });
  }

  // battlesWon
  if (unlockConditions.battlesWon != null) {
    const req = unlockConditions.battlesWon as number;
    checks.push({ key: 'battlesWon', label: 'Battles won', required: req, current: progress.battlesWon, met: progress.battlesWon >= req });
  }

  // classRarity — minimum class rarity required
  if (unlockConditions.classRarity != null && characterInfo) {
    const requiredRarity = unlockConditions.classRarity as string;
    const rarityOrder = ['CLASS_COMMON', 'CLASS_UNCOMMON', 'CLASS_RARE', 'CLASS_EPIC', 'CLASS_LEGENDARY', 'CLASS_MYTHIC'];
    const reqIdx = rarityOrder.indexOf(requiredRarity);
    const currentIdx = rarityOrder.indexOf(characterInfo.classRarity);
    checks.push({
      key: 'classRarity',
      label: `Class rarity ${requiredRarity.replace('CLASS_', '')}+`,
      required: reqIdx,
      current: currentIdx,
      met: currentIdx >= reqIdx,
    });
  }

  // exclusiveClass — must be a specific class
  if (unlockConditions.exclusiveClass != null && characterInfo) {
    const reqClass = unlockConditions.exclusiveClass as string;
    const met = characterInfo.className === reqClass;
    checks.push({
      key: 'exclusiveClass',
      label: `Class: ${reqClass}`,
      required: 1,
      current: met ? 1 : 0,
      met,
    });
  }

  return {
    unlocked: checks.length === 0 || checks.every((c) => c.met),
    requirements: checks,
  };
}

/**
 * Get character info needed for skill unlock checking.
 */
export async function getCharacterInfo(studentId: string): Promise<{ classRarity: string; className: string } | null> {
  const character = await db.battleCharacter.findUnique({
    where: { studentId },
    select: { class: { select: { rarity: true, name: true } } },
  });
  if (!character) return null;
  return { classRarity: character.class.rarity, className: character.class.name };
}
