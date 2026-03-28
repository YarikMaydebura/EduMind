import { NextResponse } from 'next/server';

import { calculateHomeworkXP, gradeSubmissionSchema } from '@edumind/shared';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';
import { awardXP } from '@/lib/gamification/award-xp';

export async function GET(
  _req: Request,
  { params }: { params: { id: string; studentId: string } },
) {
  try {
    const session = await requireAuth();

    const homework = await db.homework.findUnique({
      where: { id: params.id },
      include: {
        class: {
          select: {
            tenantId: true,
            teacher: { select: { userId: true } },
          },
        },
      },
    });

    if (!homework || homework.class.tenantId !== session.user.tenantId) {
      return NextResponse.json({ message: 'Homework not found' }, { status: 404 });
    }

    const isAdmin = ['TECH_ADMIN', 'SCHOOL_ADMIN'].includes(session.user.role);
    const isOwner = session.user.role === 'TEACHER' && homework.class.teacher.userId === session.user.id;

    // Students can only view their own submission
    if (session.user.role === 'STUDENT') {
      const student = await db.student.findUnique({ where: { userId: session.user.id } });
      if (!student || student.id !== params.studentId) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
      }
    } else if (!isAdmin && !isOwner) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const submission = await db.homeworkSubmission.findUnique({
      where: {
        homeworkId_studentId: { homeworkId: params.id, studentId: params.studentId },
      },
      include: {
        student: {
          include: {
            user: { select: { firstName: true, lastName: true, avatar: true } },
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json({ message: 'Submission not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: submission });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string; studentId: string } },
) {
  try {
    const session = await requireAuth();

    const homework = await db.homework.findUnique({
      where: { id: params.id },
      include: {
        class: {
          select: {
            id: true,
            tenantId: true,
            teacher: { select: { userId: true } },
          },
        },
      },
    });

    if (!homework || homework.class.tenantId !== session.user.tenantId) {
      return NextResponse.json({ message: 'Homework not found' }, { status: 404 });
    }

    const isAdmin = ['TECH_ADMIN', 'SCHOOL_ADMIN'].includes(session.user.role);
    const isOwner = session.user.role === 'TEACHER' && homework.class.teacher.userId === session.user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const submission = await db.homeworkSubmission.findUnique({
      where: {
        homeworkId_studentId: { homeworkId: params.id, studentId: params.studentId },
      },
    });

    if (!submission) {
      return NextResponse.json({ message: 'Submission not found' }, { status: 404 });
    }

    const body = await req.json();
    const parsed = gradeSubmissionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Validation failed', errors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    if (parsed.data.score > homework.maxScore) {
      return NextResponse.json(
        { message: `Score cannot exceed max score of ${homework.maxScore}` },
        { status: 400 },
      );
    }

    // Validate rubric scores if homework has rubric
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (homework.rubric && parsed.data.rubricScores) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const criteria = homework.rubric as any[];
      for (const rs of parsed.data.rubricScores) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const criterion = criteria.find((c: any) => c.id === rs.criterionId);
        if (!criterion) {
          return NextResponse.json(
            { message: `Unknown rubric criterion: ${rs.criterionId}` },
            { status: 400 },
          );
        }
        if (rs.score > criterion.maxPoints) {
          return NextResponse.json(
            { message: `Score for "${criterion.name}" cannot exceed ${criterion.maxPoints}` },
            { status: 400 },
          );
        }
      }
    }

    const percentage = (parsed.data.score / homework.maxScore) * 100;
    const xpEvent = calculateHomeworkXP(parsed.data.score, homework.maxScore, submission.isLate);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const xpResult = await db.$transaction(async (tx: any) => {
      // 1. Update submission
      await tx.homeworkSubmission.update({
        where: { id: submission.id },
        data: {
          score: parsed.data.score,
          percentage,
          teacherFeedback: parsed.data.teacherFeedback,
          rubricScores: parsed.data.rubricScores ?? undefined,
          status: 'GRADED',
          gradedAt: new Date(),
          gradedBy: session.user.id,
          xpEarned: xpEvent.totalXP,
        },
      });

      // 2. Domain-specific profile update (homeworkCompleted, averageScore)
      const profile = await tx.studentClassProfile.findUnique({
        where: {
          studentId_classId: {
            studentId: params.studentId,
            classId: homework.class.id,
          },
        },
      });

      if (profile) {
        // Recalculate average score from all graded submissions in this class
        const gradedSubmissions = await tx.homeworkSubmission.findMany({
          where: {
            studentId: params.studentId,
            homework: { classId: homework.class.id },
            status: 'GRADED',
          },
          select: { percentage: true },
        });

        const allPercentages = gradedSubmissions
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((s: any) => s.percentage as number)
          .filter((p: number) => p !== null);

        const averageScore =
          allPercentages.length > 0
            ? allPercentages.reduce((sum: number, p: number) => sum + p, 0) / allPercentages.length
            : null;

        await tx.studentClassProfile.update({
          where: { id: profile.id },
          data: {
            homeworkCompleted: { increment: 1 },
            averageScore,
          },
        });
      }

      // 3. Get student userId for notifications
      const studentRecord = await tx.student.findUnique({
        where: { id: params.studentId },
        select: { userId: true },
      });

      // 4. Award XP (handles class profile XP, student XP, activity feed, level-up, grade, achievements)
      const xpResult = await awardXP({
        tx,
        studentId: params.studentId,
        classProfileId: profile?.id ?? '',
        classId: homework.class.id,
        userId: studentRecord?.userId ?? '',
        xpEvent,
        activityType: 'HOMEWORK_SUBMITTED',
        activityTitle: `Homework graded: ${homework.title}`,
        relatedType: 'homework',
        relatedId: params.id,
      });

      return xpResult;
    });

    return NextResponse.json({
      success: true,
      data: {
        score: parsed.data.score,
        percentage,
        maxScore: homework.maxScore,
        passingScore: homework.passingScore,
        passed: parsed.data.score >= homework.passingScore,
        xpAwarded: xpEvent.totalXP,
        xpReason: xpEvent.reason,
        leveledUp: xpResult.leveledUp,
        newLevel: xpResult.newLevel,
        achievementsUnlocked: xpResult.achievementsUnlocked.length > 0
          ? xpResult.achievementsUnlocked
          : undefined,
      },
    });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
