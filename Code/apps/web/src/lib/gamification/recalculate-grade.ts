import { calculateGrade } from '@edumind/shared';
import type { Grade } from '@edumind/shared';

interface RecalculateGradeParams {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tx: any;
  studentId: string;
  classProfileId: string;
  classId: string;
  userId: string;
}

export interface RecalculateGradeResult {
  previousGrade: string;
  newGrade: string;
  gradeChanged: boolean;
  gradeScore: number;
  nextGrade: string | null;
  pointsToNext: number;
}

const GRADE_ORDER: Grade[] = ['E', 'D', 'C', 'B', 'A', 'S', 'S+'];

function scoreToGrade(score: number): Grade {
  if (score >= 95) return 'S+';
  if (score >= 90) return 'S';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'E';
}

export async function recalculateGrade({
  tx,
  studentId,
  classProfileId,
  classId,
  userId,
}: RecalculateGradeParams): Promise<RecalculateGradeResult> {
  // 1. Fetch the class profile (freshly updated by awardXP)
  const profile = await tx.studentClassProfile.findUnique({
    where: { id: classProfileId },
  });

  if (!profile) {
    return {
      previousGrade: 'E',
      newGrade: 'E',
      gradeChanged: false,
      gradeScore: 0,
      nextGrade: 'D',
      pointsToNext: 50,
    };
  }

  // 2. Compute quiz average (best attempt per quiz in this class)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const quizResults = await tx.quizResult.findMany({
    where: {
      studentId,
      quiz: { classId },
    },
    select: {
      quizId: true,
      percentage: true,
    },
    orderBy: { percentage: 'desc' },
  });

  // Group by quizId, take best percentage per quiz
  const bestByQuiz = new Map<string, number>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const r of quizResults as any[]) {
    if (!bestByQuiz.has(r.quizId)) {
      bestByQuiz.set(r.quizId, r.percentage);
    }
  }

  const quizAvg =
    bestByQuiz.size > 0
      ? Array.from(bestByQuiz.values()).reduce((sum, p) => sum + p, 0) / bestByQuiz.size
      : null;

  // 3. Calculate grade
  const gradeCalc = calculateGrade(
    profile.classLevel,
    profile.averageScore, // homework avg (already stored)
    quizAvg,
  );

  const previousGrade = profile.classGrade;
  const newGrade = gradeCalc.grade;
  const gradeChanged = previousGrade !== newGrade;

  // 4. Update class profile grade if changed
  if (gradeChanged) {
    await tx.studentClassProfile.update({
      where: { id: classProfileId },
      data: { classGrade: newGrade },
    });

    const improved = GRADE_ORDER.indexOf(newGrade) > GRADE_ORDER.indexOf(previousGrade as Grade);

    await tx.activityFeed.create({
      data: {
        studentId,
        type: 'RANK_UP',
        title: improved
          ? `Grade improved to ${newGrade}!`
          : `Grade changed to ${newGrade}`,
        description: improved
          ? `Your grade went from ${previousGrade} to ${newGrade}`
          : `Your grade changed from ${previousGrade} to ${newGrade}`,
        xpGained: 0,
      },
    });

    await tx.notification.create({
      data: {
        userId,
        type: 'SYSTEM',
        title: improved
          ? `Grade Up! You're now ${newGrade}`
          : `Grade updated to ${newGrade}`,
        message: improved
          ? `Your grade improved from ${previousGrade} to ${newGrade}. Keep it up!`
          : `Your grade changed from ${previousGrade} to ${newGrade}.`,
        actionUrl: '/s/dashboard',
      },
    });
  }

  // 5. Recalculate global grade (average of all class grade scores)
  const allProfiles = await tx.studentClassProfile.findMany({
    where: { studentId },
    select: { classLevel: true, averageScore: true, classId: true },
  });

  let globalScore = gradeCalc.score;

  if (allProfiles.length > 1) {
    let totalScore = 0;
    for (const p of allProfiles) {
      // For the current class, use the freshly calculated score
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((p as any).classId === classId) {
        totalScore += gradeCalc.score;
      } else {
        // Compute quiz avg for this other class
        const otherQuizResults = await tx.quizResult.findMany({
          where: { studentId, quiz: { classId: (p as any).classId } },
          select: { quizId: true, percentage: true },
          orderBy: { percentage: 'desc' },
        });
        const otherBest = new Map<string, number>();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const r of otherQuizResults as any[]) {
          if (!otherBest.has(r.quizId)) otherBest.set(r.quizId, r.percentage);
        }
        const otherQuizAvg =
          otherBest.size > 0
            ? Array.from(otherBest.values()).reduce((s, v) => s + v, 0) / otherBest.size
            : null;

        const otherCalc = calculateGrade(
          (p as any).classLevel,
          (p as any).averageScore,
          otherQuizAvg,
        );
        totalScore += otherCalc.score;
      }
    }
    globalScore = totalScore / allProfiles.length;
  }

  const globalGrade = scoreToGrade(globalScore);
  const student = await tx.student.findUnique({
    where: { id: studentId },
    select: { currentGrade: true },
  });

  if (student && student.currentGrade !== globalGrade) {
    await tx.student.update({
      where: { id: studentId },
      data: { currentGrade: globalGrade },
    });
  }

  return {
    previousGrade,
    newGrade,
    gradeChanged,
    gradeScore: gradeCalc.score,
    nextGrade: gradeCalc.nextGrade,
    pointsToNext: gradeCalc.pointsToNext,
  };
}
