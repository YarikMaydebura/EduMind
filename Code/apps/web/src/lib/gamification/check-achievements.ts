import { calculateLevel } from '@edumind/shared';

// Map activity types to which achievement categories to check
const TRIGGER_CATEGORIES: Record<string, string[]> = {
  HOMEWORK_SUBMITTED: ['homework', 'level', 'grade'],
  QUIZ_COMPLETED: ['quiz', 'level', 'grade'],
  LESSON_COMPLETED: ['level', 'grade'],
  STREAK_MILESTONE: ['streak'],
};

// Grade-to-numeric mapping (matches seed data conditionValue)
const GRADE_NUMERIC: Record<string, number> = {
  E: 1,
  D: 2,
  C: 3,
  B: 4,
  A: 5,
  S: 6,
  'S+': 7,
};

interface StudentSnapshot {
  overallLevel: number;
  currentGrade: string;
  streakDays: number;
  totalXp: number;
}

interface CheckAchievementsParams {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tx: any;
  studentId: string;
  userId: string;
  classId: string;
  activityType: string;
  studentSnapshot: StudentSnapshot;
}

interface UnlockedAchievement {
  id: string;
  name: string;
  icon: string;
  rarity: string;
  xpReward: number;
  unlocksTitle: string | null;
  unlocksFrame: string | null;
  unlocksBadge: string | null;
}

interface CheckAchievementsResult {
  unlockedAchievements: UnlockedAchievement[];
  totalBonusXP: number;
}

// --- Condition Evaluators ---
// Each returns the current numeric value for a given condition type.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ConditionEvaluator = (tx: any, studentId: string, snapshot: StudentSnapshot) => Promise<number>;

async function getHomeworkCount(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tx: any,
  studentId: string,
): Promise<number> {
  const profiles = await tx.studentClassProfile.findMany({
    where: { studentId },
    select: { homeworkCompleted: true },
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return profiles.reduce((sum: number, p: any) => sum + p.homeworkCompleted, 0);
}

async function getHomeworkPerfect(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tx: any,
  studentId: string,
): Promise<number> {
  return tx.homeworkSubmission.count({
    where: {
      studentId,
      status: 'GRADED',
      percentage: 100,
    },
  });
}

async function getHomeworkOntimeStreak(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tx: any,
  studentId: string,
): Promise<number> {
  const submissions = await tx.homeworkSubmission.findMany({
    where: { studentId, status: { in: ['SUBMITTED', 'GRADED'] } },
    orderBy: { submittedAt: 'desc' },
    select: { isLate: true },
    take: 50, // Max needed for highest ontime streak achievement
  });

  let streak = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const sub of submissions as any[]) {
    if (sub.isLate) break;
    streak++;
  }
  return streak;
}

async function getQuizCount(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tx: any,
  studentId: string,
): Promise<number> {
  const profiles = await tx.studentClassProfile.findMany({
    where: { studentId },
    select: { quizzesCompleted: true },
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return profiles.reduce((sum: number, p: any) => sum + p.quizzesCompleted, 0);
}

async function getQuizPerfect(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tx: any,
  studentId: string,
): Promise<number> {
  // Count distinct quizzes where student got 100%
  const results = await tx.quizResult.findMany({
    where: { studentId, percentage: 100 },
    select: { quizId: true },
    distinct: ['quizId'],
  });
  return results.length;
}

async function getBossDefeated(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tx: any,
  studentId: string,
): Promise<number> {
  return tx.quizResult.count({
    where: { studentId, bossDefeated: true },
  });
}

async function getBossPerfect(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tx: any,
  studentId: string,
): Promise<number> {
  return tx.quizResult.count({
    where: { studentId, bossDefeated: true, percentage: 100 },
  });
}

const CONDITION_EVALUATORS: Record<string, ConditionEvaluator> = {
  streak_days: async (_tx, _studentId, snapshot) => snapshot.streakDays,
  level_reached: async (_tx, _studentId, snapshot) => snapshot.overallLevel,
  grade_reached: async (_tx, _studentId, snapshot) => GRADE_NUMERIC[snapshot.currentGrade] ?? 1,
  homework_count: async (tx, studentId) => getHomeworkCount(tx, studentId),
  homework_perfect: async (tx, studentId) => getHomeworkPerfect(tx, studentId),
  homework_ontime_streak: async (tx, studentId) => getHomeworkOntimeStreak(tx, studentId),
  quiz_count: async (tx, studentId) => getQuizCount(tx, studentId),
  quiz_perfect: async (tx, studentId) => getQuizPerfect(tx, studentId),
  boss_defeated: async (tx, studentId) => getBossDefeated(tx, studentId),
  boss_perfect: async (tx, studentId) => getBossPerfect(tx, studentId),
};

export async function checkAchievements({
  tx,
  studentId,
  userId,
  classId,
  activityType,
  studentSnapshot,
}: CheckAchievementsParams): Promise<CheckAchievementsResult> {
  // 1. Determine which categories to check
  const categories = TRIGGER_CATEGORIES[activityType];
  if (!categories || categories.length === 0) {
    return { unlockedAchievements: [], totalBonusXP: 0 };
  }

  // 2. Fetch active achievements in those categories that student hasn't unlocked
  const achievements = await tx.achievement.findMany({
    where: {
      isActive: true,
      category: { in: categories },
    },
    orderBy: { conditionValue: 'asc' },
  });

  if (achievements.length === 0) {
    return { unlockedAchievements: [], totalBonusXP: 0 };
  }

  // Get already-unlocked achievement IDs for this student
  const unlockedRecords = await tx.studentAchievement.findMany({
    where: {
      studentId,
      isUnlocked: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      achievementId: { in: achievements.map((a: any) => a.id) },
    },
    select: { achievementId: true },
  });
  const unlockedIds = new Set(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    unlockedRecords.map((r: any) => r.achievementId),
  );

  // Filter to not-yet-unlocked
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const candidateAchievements = achievements.filter((a: any) => !unlockedIds.has(a.id));

  if (candidateAchievements.length === 0) {
    return { unlockedAchievements: [], totalBonusXP: 0 };
  }

  // 3. Group by conditionType and evaluate each group
  const byConditionType = new Map<string, typeof candidateAchievements>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const achievement of candidateAchievements as any[]) {
    const group = byConditionType.get(achievement.conditionType) || [];
    group.push(achievement);
    byConditionType.set(achievement.conditionType, group);
  }

  const unlocked: UnlockedAchievement[] = [];
  let totalBonusXP = 0;

  for (const [conditionType, group] of byConditionType) {
    const evaluator = CONDITION_EVALUATORS[conditionType];
    if (!evaluator) continue; // Skip unknown condition types (future phases)

    const currentValue = await evaluator(tx, studentId, studentSnapshot);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const achievement of group as any[]) {
      if (currentValue >= achievement.conditionValue) {
        // --- UNLOCK ---
        await unlockAchievement(tx, studentId, userId, classId, achievement);
        unlocked.push({
          id: achievement.id,
          name: achievement.name,
          icon: achievement.icon,
          rarity: achievement.rarity,
          xpReward: achievement.xpReward,
          unlocksTitle: achievement.unlocksTitle,
          unlocksFrame: achievement.unlocksFrame,
          unlocksBadge: achievement.unlocksBadge,
        });
        totalBonusXP += achievement.xpReward;
      } else {
        // --- UPDATE PROGRESS ---
        await upsertProgress(tx, studentId, achievement, currentValue);
      }
    }
  }

  // Award total bonus XP directly (prevents infinite loops — no awardXP call)
  if (totalBonusXP > 0) {
    const student = await tx.student.findUnique({
      where: { id: studentId },
      select: { totalXp: true },
    });
    if (student) {
      const newTotalXp = student.totalXp + totalBonusXP;
      await tx.student.update({
        where: { id: studentId },
        data: {
          totalXp: newTotalXp,
          overallLevel: calculateLevel(newTotalXp),
        },
      });
    }
  }

  return { unlockedAchievements: unlocked, totalBonusXP };
}

async function unlockAchievement(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tx: any,
  studentId: string,
  userId: string,
  classId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  achievement: any,
) {
  const now = new Date();

  // 1. Upsert StudentAchievement
  await tx.studentAchievement.upsert({
    where: {
      studentId_achievementId_classId: {
        studentId,
        achievementId: achievement.id,
        classId: achievement.category === 'homework' || achievement.category === 'quiz' ? classId : classId,
      },
    },
    create: {
      studentId,
      achievementId: achievement.id,
      classId,
      progress: achievement.conditionValue,
      progressMax: achievement.conditionValue,
      isUnlocked: true,
      unlockedAt: now,
    },
    update: {
      progress: achievement.conditionValue,
      progressMax: achievement.conditionValue,
      isUnlocked: true,
      unlockedAt: now,
    },
  });

  // 2. Apply cosmetic rewards
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cosmeticUpdate: Record<string, any> = {};
  if (achievement.unlocksTitle) {
    cosmeticUpdate.title = achievement.unlocksTitle;
  }
  if (achievement.unlocksFrame) {
    cosmeticUpdate.profileFrame = achievement.unlocksFrame;
  }

  if (achievement.unlocksBadge) {
    // Push badge to array
    const student = await tx.student.findUnique({
      where: { id: studentId },
      select: { badges: true },
    });
    const currentBadges = (student?.badges as string[]) || [];
    if (!currentBadges.includes(achievement.unlocksBadge)) {
      cosmeticUpdate.badges = [...currentBadges, achievement.unlocksBadge];
    }
  }

  if (Object.keys(cosmeticUpdate).length > 0) {
    await tx.student.update({
      where: { id: studentId },
      data: cosmeticUpdate,
    });
  }

  // 3. Create ActivityFeed entry
  await tx.activityFeed.create({
    data: {
      studentId,
      type: 'ACHIEVEMENT_UNLOCKED',
      title: `Achievement Unlocked: ${achievement.name}!`,
      description: achievement.description,
      xpGained: achievement.xpReward,
      relatedType: 'achievement',
      relatedId: achievement.id,
    },
  });

  // 4. Create Notification
  await tx.notification.create({
    data: {
      userId,
      type: 'ACHIEVEMENT_UNLOCKED',
      title: 'Achievement Unlocked!',
      message: `You earned "${achievement.name}" — ${achievement.description}`,
      actionUrl: '/s/achievements',
    },
  });
}

async function upsertProgress(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tx: any,
  studentId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  achievement: any,
  currentValue: number,
) {
  // Use a try/catch for the upsert since classId can be null for global achievements
  try {
    await tx.studentAchievement.upsert({
      where: {
        studentId_achievementId_classId: {
          studentId,
          achievementId: achievement.id,
          classId: '', // Global achievements use empty string
        },
      },
      create: {
        studentId,
        achievementId: achievement.id,
        progress: Math.min(currentValue, achievement.conditionValue),
        progressMax: achievement.conditionValue,
      },
      update: {
        progress: Math.min(currentValue, achievement.conditionValue),
        progressMax: achievement.conditionValue,
      },
    });
  } catch {
    // If upsert fails (e.g., classId unique constraint), skip progress update
  }
}
