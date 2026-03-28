import type { AwardXPResult, UnlockedAchievementInfo, XPEvent } from '@edumind/shared';
import { calculateLevel, getLevelTitle } from '@edumind/shared';

import { checkAchievements } from './check-achievements';
import { recalculateGrade } from './recalculate-grade';
import { updateStreak } from './update-streak';

type ActivityType =
  | 'LESSON_COMPLETED'
  | 'HOMEWORK_SUBMITTED'
  | 'QUIZ_COMPLETED'
  | 'ACHIEVEMENT_UNLOCKED'
  | 'LEVEL_UP'
  | 'STREAK_MILESTONE'
  | 'RANK_UP';

interface AwardXPParams {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tx: any;
  studentId: string;
  classProfileId: string;
  classId: string;
  userId: string;
  xpEvent: XPEvent;
  activityType: ActivityType;
  activityTitle: string;
  relatedType?: string;
  relatedId?: string;
  skipAchievementCheck?: boolean;
}

export async function awardXP({
  tx,
  studentId,
  classProfileId,
  classId,
  userId,
  xpEvent,
  activityType,
  activityTitle,
  relatedType,
  relatedId,
  skipAchievementCheck,
}: AwardXPParams): Promise<AwardXPResult> {
  // 1. Update class-specific profile
  const profile = await tx.studentClassProfile.findUnique({
    where: { id: classProfileId },
  });

  if (profile) {
    const newClassXp = profile.classXp + xpEvent.totalXP;
    await tx.studentClassProfile.update({
      where: { id: classProfileId },
      data: {
        classXp: newClassXp,
        classLevel: calculateLevel(newClassXp),
      },
    });
  }

  // 2. Update global student stats & capture previous level
  const student = await tx.student.findUnique({
    where: { id: studentId },
  });

  const previousLevel = student?.overallLevel ?? 1;
  const previousTitle = student?.title ?? 'Newcomer';
  let newLevel = previousLevel;
  let newTitle: string | null = null;

  if (student) {
    const newTotalXp = student.totalXp + xpEvent.totalXP;
    newLevel = calculateLevel(newTotalXp);
    const calculatedTitle = getLevelTitle(newLevel);

    const updateData: Record<string, unknown> = {
      totalXp: newTotalXp,
      overallLevel: newLevel,
    };

    // Update title if it changed
    if (calculatedTitle !== previousTitle) {
      updateData.title = calculatedTitle;
      newTitle = calculatedTitle;
    }

    await tx.student.update({
      where: { id: studentId },
      data: updateData,
    });
  }

  // 2.5. Update streak (daily activity tracking)
  const streakResult = await updateStreak({ tx, studentId, userId });

  // 3. Create activity feed entry
  await tx.activityFeed.create({
    data: {
      studentId,
      type: activityType,
      title: activityTitle,
      description: xpEvent.reason,
      xpGained: xpEvent.totalXP,
      relatedType,
      relatedId,
    },
  });

  // 4. If level changed, create level-up activity + notification
  const leveledUp = newLevel > previousLevel;

  if (leveledUp) {
    const levelTitle = getLevelTitle(newLevel);

    await tx.activityFeed.create({
      data: {
        studentId,
        type: 'LEVEL_UP',
        title: `Reached Level ${newLevel}!`,
        description: `New title: ${levelTitle}`,
        xpGained: 0,
      },
    });

    await tx.notification.create({
      data: {
        userId,
        type: 'LEVEL_UP',
        title: `Level Up! You're now Level ${newLevel}`,
        message: `Congratulations! You've reached Level ${newLevel} — ${levelTitle}`,
        actionUrl: '/s/dashboard',
      },
    });
  }

  // 5. Recalculate grade
  const gradeResult = await recalculateGrade({
    tx,
    studentId,
    classProfileId,
    classId,
    userId,
  });

  // 6. Check achievements (skip if this is an achievement XP award to prevent loops)
  let achievementsUnlocked: UnlockedAchievementInfo[] = [];

  if (!skipAchievementCheck) {
    // Re-fetch fresh student state after level/grade updates
    const freshStudent = await tx.student.findUnique({
      where: { id: studentId },
      select: { overallLevel: true, currentGrade: true, streakDays: true, totalXp: true },
    });

    const achievementResult = await checkAchievements({
      tx,
      studentId,
      userId,
      classId,
      activityType,
      studentSnapshot: {
        overallLevel: freshStudent?.overallLevel ?? newLevel,
        currentGrade: freshStudent?.currentGrade ?? 'E',
        streakDays: freshStudent?.streakDays ?? 0,
        totalXp: freshStudent?.totalXp ?? 0,
      },
    });

    achievementsUnlocked = achievementResult.unlockedAchievements.map((a) => ({
      id: a.id,
      name: a.name,
      icon: a.icon,
      rarity: a.rarity,
      xpReward: a.xpReward,
    }));
  }

  return {
    xpAwarded: xpEvent.totalXP,
    previousLevel,
    newLevel,
    leveledUp,
    newTitle,
    gradeChanged: gradeResult.gradeChanged,
    newGrade: gradeResult.gradeChanged ? gradeResult.newGrade : null,
    achievementsUnlocked,
    streakDays: streakResult.newStreakDays,
    streakMilestoneXP: streakResult.milestoneXP,
  };
}
