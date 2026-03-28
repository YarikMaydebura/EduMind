import { NextResponse } from 'next/server';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const session = await requireAuth();

    if (session.user.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Students only' }, { status: 403 });
    }

    const student = await db.student.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!student) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    // Parse optional category filter
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    // 1. Fetch all active achievements
    const achievements = await db.achievement.findMany({
      where: {
        isActive: true,
        ...(category && category !== 'all' ? { category } : {}),
      },
      orderBy: [{ category: 'asc' }, { conditionValue: 'asc' }],
    });

    // 2. Fetch student's achievement records
    const studentAchievements = await db.studentAchievement.findMany({
      where: { studentId: student.id },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const studentAchievementMap = new Map<string, any>(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      studentAchievements.map((sa: any) => [sa.achievementId, sa]),
    );

    // 3. Build response merging definitions with student progress
    const result = achievements
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((a: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sa: any = studentAchievementMap.get(a.id);
        const isUnlocked = sa?.isUnlocked ?? false;

        // Hidden achievements: only show if unlocked
        if (a.isHidden && !isUnlocked) return null;

        return {
          id: a.id,
          name: a.name,
          description: a.description,
          icon: a.icon,
          category: a.category,
          rarity: a.rarity,
          xpReward: a.xpReward,
          unlocksTitle: a.unlocksTitle,
          unlocksFrame: a.unlocksFrame,
          unlocksBadge: a.unlocksBadge,
          isHidden: a.isHidden,
          isUnlocked,
          progress: sa?.progress ?? 0,
          progressMax: sa?.progressMax ?? a.conditionValue,
          unlockedAt: sa?.unlockedAt ?? null,
        };
      })
      .filter(Boolean);

    // 4. Compute summary
    const totalUnlocked = studentAchievements.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (sa: any) => sa.isUnlocked,
    ).length;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalVisible = achievements.filter((a: any) => !a.isHidden).length;

    return NextResponse.json({
      success: true,
      data: {
        achievements: result,
        summary: {
          unlocked: totalUnlocked,
          total: totalVisible,
          percentage: totalVisible > 0 ? Math.round((totalUnlocked / totalVisible) * 100) : 0,
        },
        categories: ['all', 'streak', 'level', 'grade', 'homework', 'quiz', 'skill', 'social'],
      },
    });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
