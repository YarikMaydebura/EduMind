import { NextResponse } from 'next/server';

import { xpToNextLevel, getLevelTitle, calculateGrade } from '@edumind/shared';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await requireAuth();

    if (session.user.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Students only' }, { status: 403 });
    }

    const student = await db.student.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
        totalXp: true,
        overallLevel: true,
        title: true,
        streakDays: true,
        longestStreak: true,
        currentGrade: true,
      },
    });

    if (!student) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    const levelProgress = xpToNextLevel(student.totalXp);

    // Get class profiles with class info
    const classProfiles = await db.studentClassProfile.findMany({
      where: { studentId: student.id },
      include: {
        class: {
          select: { id: true, name: true, subject: true },
        },
      },
    });

    // Compute grade breakdowns per class
    const quizResults = await db.quizResult.findMany({
      where: { studentId: student.id },
      select: { quizId: true, percentage: true, quiz: { select: { classId: true } } },
      orderBy: { percentage: 'desc' },
    });

    // Group quiz results: best per quiz, grouped by class
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const quizAvgByClass = new Map<string, number>();
    const bestByQuizByClass = new Map<string, Map<string, number>>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const r of quizResults as any[]) {
      const cid = r.quiz.classId;
      if (!bestByQuizByClass.has(cid)) bestByQuizByClass.set(cid, new Map());
      const quizMap = bestByQuizByClass.get(cid)!;
      if (!quizMap.has(r.quizId)) quizMap.set(r.quizId, r.percentage);
    }
    for (const [cid, quizMap] of bestByQuizByClass) {
      const vals = Array.from(quizMap.values());
      quizAvgByClass.set(cid, vals.reduce((s, v) => s + v, 0) / vals.length);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const classProfilesData = classProfiles.map((cp: any) => {
      const quizAvg = quizAvgByClass.get(cp.class.id) ?? null;
      const gradeCalc = calculateGrade(cp.classLevel, cp.averageScore, quizAvg);
      return {
        classId: cp.class.id,
        className: cp.class.name,
        subject: cp.class.subject,
        classXp: cp.classXp,
        classLevel: cp.classLevel,
        classGrade: cp.classGrade,
        lessonsCompleted: cp.lessonsCompleted,
        homeworkCompleted: cp.homeworkCompleted,
        quizzesCompleted: cp.quizzesCompleted,
        gradeBreakdown: {
          score: gradeCalc.score,
          breakdown: gradeCalc.breakdown,
          nextGrade: gradeCalc.nextGrade,
          pointsToNext: gradeCalc.pointsToNext,
        },
      };
    });

    // Global grade breakdown
    const globalGradeScore =
      classProfilesData.length > 0
        ? classProfilesData.reduce(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (sum: number, cp: any) => sum + cp.gradeBreakdown.score,
            0,
          ) / classProfilesData.length
        : 0;

    // Achievement summary
    const [achievementUnlocked, achievementTotal] = await Promise.all([
      db.studentAchievement.count({
        where: { studentId: student.id, isUnlocked: true },
      }),
      db.achievement.count({
        where: { isActive: true, isHidden: false },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalXp: student.totalXp,
        overallLevel: student.overallLevel,
        title: student.title || getLevelTitle(student.overallLevel),
        currentGrade: student.currentGrade,
        streakDays: student.streakDays,
        longestStreak: student.longestStreak,
        levelProgress: {
          current: levelProgress.current,
          needed: levelProgress.needed,
          progress: levelProgress.progress,
        },
        globalGradeScore: Math.round(globalGradeScore * 10) / 10,
        classProfiles: classProfilesData,
        achievementsSummary: {
          unlocked: achievementUnlocked,
          total: achievementTotal,
        },
      },
    });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
