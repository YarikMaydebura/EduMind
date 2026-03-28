import { calculateLevel, calculateStreakXP } from '@edumind/shared';

interface UpdateStreakParams {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tx: any;
  studentId: string;
  userId: string;
}

interface UpdateStreakResult {
  streakUpdated: boolean;
  newStreakDays: number;
  milestoneXP: number;
}

function isSameUTCDay(d1: Date, d2: Date): boolean {
  return (
    d1.getUTCFullYear() === d2.getUTCFullYear() &&
    d1.getUTCMonth() === d2.getUTCMonth() &&
    d1.getUTCDate() === d2.getUTCDate()
  );
}

function isConsecutiveUTCDay(lastActivity: Date, now: Date): boolean {
  const yesterday = new Date(now);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  return (
    yesterday.getUTCFullYear() === lastActivity.getUTCFullYear() &&
    yesterday.getUTCMonth() === lastActivity.getUTCMonth() &&
    yesterday.getUTCDate() === lastActivity.getUTCDate()
  );
}

export async function updateStreak({
  tx,
  studentId,
  userId,
}: UpdateStreakParams): Promise<UpdateStreakResult> {
  const now = new Date();

  const student = await tx.student.findUnique({
    where: { id: studentId },
    select: { lastActivityAt: true, streakDays: true, longestStreak: true, totalXp: true },
  });

  if (!student) {
    return { streakUpdated: false, newStreakDays: 0, milestoneXP: 0 };
  }

  // Same UTC day — no streak update needed
  if (student.lastActivityAt && isSameUTCDay(student.lastActivityAt, now)) {
    return { streakUpdated: false, newStreakDays: student.streakDays, milestoneXP: 0 };
  }

  // Determine new streak
  let newStreakDays: number;
  if (!student.lastActivityAt) {
    // First activity ever
    newStreakDays = 1;
  } else if (isConsecutiveUTCDay(student.lastActivityAt, now)) {
    // Consecutive day — extend streak
    newStreakDays = student.streakDays + 1;
  } else {
    // Gap of 2+ days — reset streak
    newStreakDays = 1;
  }

  const newLongestStreak = Math.max(student.longestStreak, newStreakDays);

  // Update student record
  await tx.student.update({
    where: { id: studentId },
    data: {
      streakDays: newStreakDays,
      longestStreak: newLongestStreak,
      lastActivityAt: now,
    },
  });

  // Check for streak milestone bonus XP
  let milestoneXP = 0;
  const milestoneEvent = calculateStreakXP(newStreakDays);

  if (milestoneEvent) {
    milestoneXP = milestoneEvent.totalXP;

    // Award milestone XP directly (prevent recursive awardXP loop)
    const newTotalXp = student.totalXp + milestoneXP;
    await tx.student.update({
      where: { id: studentId },
      data: {
        totalXp: newTotalXp,
        overallLevel: calculateLevel(newTotalXp),
      },
    });

    // Create STREAK_MILESTONE activity feed entry
    await tx.activityFeed.create({
      data: {
        studentId,
        type: 'STREAK_MILESTONE',
        title: `${newStreakDays}-Day Streak!`,
        description: milestoneEvent.reason,
        xpGained: milestoneXP,
      },
    });

    // Create notification
    await tx.notification.create({
      data: {
        userId,
        type: 'SYSTEM',
        title: `${newStreakDays}-Day Streak!`,
        message: `You've maintained a ${newStreakDays}-day streak! +${milestoneXP} XP bonus`,
        actionUrl: '/s/dashboard',
      },
    });
  }

  return { streakUpdated: true, newStreakDays, milestoneXP };
}
