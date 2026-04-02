import { calculateBattleStats, calculateStatsWithClass, EVOLUTION_KP_COST } from '@edumind/shared';
import type { BattleAttributes } from '@edumind/shared';

import { db } from '@/lib/db';

import { getStudentSubjectAverages } from './propose-classes';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface RequirementCheck {
  key: string;
  label: string;
  required: number;
  current: number;
  met: boolean;
}

export interface UnlockCheckResult {
  unlocked: boolean;
  requirements: RequirementCheck[];
}

export interface StudentProgressData {
  level: number;
  subjectAverages: Record<string, number>;
  achievementCount: number;
  streakDays: number;
  battlesWon: number;
  bossesDefeated: number;
  homeworkCompleted: number;
  knowledgePoints: number;
  globalRank: number | null;
}

export interface EvolutionOption {
  targetClass: {
    id: string;
    name: string;
    rarity: string;
    description: string;
    passives: Record<string, number>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    abilities: any[] | null;
  };
  unlockCheck: UnlockCheckResult;
  kpCost: number;
  canAfford: boolean;
  statDiff: Partial<BattleAttributes>;
}

// ─── Data Fetching ───────────────────────────────────────────────────────────

export async function getStudentProgressData(studentId: string): Promise<StudentProgressData> {
  const [student, subjectAverages, achievementCount, homeworkSum, topRank] = await Promise.all([
    db.student.findUnique({
      where: { id: studentId },
      select: {
        overallLevel: true,
        streakDays: true,
        battleCharacter: {
          select: { battlesWon: true, bossesDefeated: true, knowledgePoints: true },
        },
      },
    }),
    getStudentSubjectAverages(studentId),
    db.studentAchievement.count({
      where: { studentId, isUnlocked: true },
    }),
    db.studentClassProfile.aggregate({
      where: { studentId },
      _sum: { homeworkCompleted: true },
    }),
    db.leaderboardEntry.findFirst({
      where: { studentId, scope: 'global' },
      orderBy: { rank: 'asc' },
      select: { rank: true },
    }),
  ]);

  return {
    level: student?.overallLevel ?? 1,
    subjectAverages,
    achievementCount,
    streakDays: student?.streakDays ?? 0,
    battlesWon: student?.battleCharacter?.battlesWon ?? 0,
    bossesDefeated: student?.battleCharacter?.bossesDefeated ?? 0,
    homeworkCompleted: homeworkSum._sum.homeworkCompleted ?? 0,
    knowledgePoints: student?.battleCharacter?.knowledgePoints ?? 0,
    globalRank: topRank?.rank ?? null,
  };
}

// ─── Unlock Checking ─────────────────────────────────────────────────────────

export function checkClassUnlock(
  progress: StudentProgressData,
  requirements: Record<string, unknown>,
): UnlockCheckResult {
  const checks: RequirementCheck[] = [];

  // minLevel
  if (requirements.minLevel != null) {
    const req = requirements.minLevel as number;
    checks.push({ key: 'minLevel', label: 'Level', required: req, current: progress.level, met: progress.level >= req });
  }

  // subjects
  if (requirements.subjects) {
    const subjects = requirements.subjects as Record<string, number>;
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
  if (requirements.achievements != null) {
    const req = requirements.achievements as number;
    checks.push({ key: 'achievements', label: 'Achievements', required: req, current: progress.achievementCount, met: progress.achievementCount >= req });
  }

  // streak
  if (requirements.streak != null) {
    const req = requirements.streak as number;
    checks.push({ key: 'streak', label: 'Day streak', required: req, current: progress.streakDays, met: progress.streakDays >= req });
  }

  // pvpWins
  if (requirements.pvpWins != null) {
    const req = requirements.pvpWins as number;
    checks.push({ key: 'pvpWins', label: 'PvP wins', required: req, current: progress.battlesWon, met: progress.battlesWon >= req });
  }

  // bossDefeats
  if (requirements.bossDefeats != null) {
    const req = requirements.bossDefeats as number;
    checks.push({ key: 'bossDefeats', label: 'Boss defeats', required: req, current: progress.bossesDefeated, met: progress.bossesDefeated >= req });
  }

  // homeworkCompleted
  if (requirements.homeworkCompleted != null) {
    const req = requirements.homeworkCompleted as number;
    checks.push({ key: 'homeworkCompleted', label: 'Homework completed', required: req, current: progress.homeworkCompleted, met: progress.homeworkCompleted >= req });
  }

  // rank
  if (requirements.rank != null) {
    const req = requirements.rank as number;
    const current = progress.globalRank ?? 999;
    checks.push({ key: 'rank', label: 'Global rank', required: req, current, met: current <= req });
  }

  return {
    unlocked: checks.every((c) => c.met),
    requirements: checks,
  };
}

// ─── Evolution Options ───────────────────────────────────────────────────────

export async function getEvolutionOptions(studentId: string): Promise<{
  currentClass: { id: string; name: string; rarity: string } | null;
  options: EvolutionOption[];
  hasEligibleEvolution: boolean;
}> {
  const character = await db.battleCharacter.findUnique({
    where: { studentId },
    select: {
      classId: true,
      knowledgePoints: true,
      class: {
        select: {
          id: true,
          name: true,
          rarity: true,
          evolvesTo: {
            select: {
              id: true,
              name: true,
              rarity: true,
              description: true,
              passives: true,
              abilities: true,
              requirements: true,
            },
          },
        },
      },
    },
  });

  if (!character) {
    return { currentClass: null, options: [], hasEligibleEvolution: false };
  }

  const progress = await getStudentProgressData(studentId);
  const subjectAverages = progress.subjectAverages;

  const options: EvolutionOption[] = character.class.evolvesTo.map((target) => {
    const passives = (target.passives ?? {}) as Record<string, number>;
    const requirements = (target.requirements ?? {}) as Record<string, unknown>;
    const unlockCheck = checkClassUnlock(progress, requirements);
    const kpCost = EVOLUTION_KP_COST[target.rarity] ?? 0;
    const { diff } = calculateStatsWithClass(subjectAverages, passives);

    return {
      targetClass: {
        id: target.id,
        name: target.name,
        rarity: target.rarity,
        description: target.description,
        passives,
        abilities: target.abilities as unknown[] | null,
      },
      unlockCheck,
      kpCost,
      canAfford: character.knowledgePoints >= kpCost,
      statDiff: diff,
    };
  });

  return {
    currentClass: {
      id: character.class.id,
      name: character.class.name,
      rarity: character.class.rarity,
    },
    options,
    hasEligibleEvolution: options.some((o) => o.unlockCheck.unlocked && o.canAfford),
  };
}
