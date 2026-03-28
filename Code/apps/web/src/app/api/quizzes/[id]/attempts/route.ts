import { NextResponse } from 'next/server';

import { calculateQuizXP, submitQuizSchema } from '@edumind/shared';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';
import { awardXP } from '@/lib/gamification/award-xp';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();

    const quiz = await db.quiz.findUnique({
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

    if (!quiz || quiz.class.tenantId !== session.user.tenantId) {
      return NextResponse.json({ message: 'Quiz not found' }, { status: 404 });
    }

    const isAdmin = ['TECH_ADMIN', 'SCHOOL_ADMIN'].includes(session.user.role);
    const isOwner =
      session.user.role === 'TEACHER' && quiz.class.teacher.userId === session.user.id;

    if (session.user.role === 'STUDENT') {
      const student = await db.student.findUnique({ where: { userId: session.user.id } });
      if (!student) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
      }

      const results = await db.quizResult.findMany({
        where: { quizId: params.id, studentId: student.id },
        orderBy: { attemptNumber: 'desc' },
      });

      return NextResponse.json({ success: true, data: results });
    }

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Teacher/admin: all results with student names
    const results = await db.quizResult.findMany({
      where: { quizId: params.id },
      include: {
        student: {
          include: {
            user: { select: { firstName: true, lastName: true } },
          },
        },
      },
      orderBy: [{ studentId: 'asc' }, { attemptNumber: 'desc' }],
    });

    return NextResponse.json({ success: true, data: results });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();

    if (session.user.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Only students can submit quizzes' }, { status: 403 });
    }

    const student = await db.student.findUnique({ where: { userId: session.user.id } });
    if (!student) {
      return NextResponse.json({ message: 'Student profile not found' }, { status: 404 });
    }

    const quiz = await db.quiz.findUnique({
      where: { id: params.id },
      include: {
        class: { select: { id: true, tenantId: true } },
      },
    });

    if (!quiz || quiz.class.tenantId !== session.user.tenantId) {
      return NextResponse.json({ message: 'Quiz not found' }, { status: 404 });
    }

    // Verify enrollment
    const enrollment = await db.classEnrollment.findUnique({
      where: { classId_studentId: { classId: quiz.class.id, studentId: student.id } },
    });
    if (!enrollment?.isActive) {
      return NextResponse.json({ message: 'Not enrolled in this class' }, { status: 403 });
    }

    // Check availability window
    const now = new Date();
    if (quiz.availableFrom && now < quiz.availableFrom) {
      return NextResponse.json({ message: 'Quiz is not yet available' }, { status: 400 });
    }
    if (quiz.availableUntil && now > quiz.availableUntil) {
      return NextResponse.json({ message: 'Quiz is no longer available' }, { status: 400 });
    }

    // Check attempt count
    const existingAttempts = await db.quizResult.count({
      where: { quizId: params.id, studentId: student.id },
    });

    if (!quiz.allowRetakes && existingAttempts >= 1) {
      return NextResponse.json({ message: 'Retakes are not allowed' }, { status: 400 });
    }
    if (existingAttempts >= quiz.maxAttempts) {
      return NextResponse.json(
        { message: `Maximum ${quiz.maxAttempts} attempts reached` },
        { status: 400 },
      );
    }

    // Validate submission
    const body = await req.json();
    const parsed = submitQuizSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Validation failed', errors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    // Auto-grade
    const questions = quiz.questions as unknown as Array<{
      type: string;
      question: string;
      options?: Array<{ text: string; isCorrect: boolean }>;
      correctAnswer?: string;
      points: number;
    }>;

    let score = 0;
    let correctAnswers = 0;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gradedAnswers = parsed.data.answers.map((ans: any) => {
      const q = questions[ans.questionIndex];
      if (!q) return { ...ans, correct: false, pointsEarned: 0 };

      let isCorrect = false;

      if (q.type === 'MCQ' || q.type === 'TRUE_FALSE') {
        // Match against the correct option text
        const correctOption = q.options?.find((o) => o.isCorrect);
        isCorrect = correctOption
          ? ans.answer.trim().toLowerCase() === correctOption.text.trim().toLowerCase()
          : false;
      } else if (q.type === 'SHORT_ANSWER') {
        isCorrect = q.correctAnswer
          ? ans.answer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()
          : false;
      }

      const pointsEarned = isCorrect ? q.points : 0;
      if (isCorrect) correctAnswers++;
      score += pointsEarned;

      return { ...ans, correct: isCorrect, pointsEarned };
    });

    const percentage = quiz.totalPoints > 0 ? (score / quiz.totalPoints) * 100 : 0;
    const xpEvent = calculateQuizXP(score, quiz.totalPoints, quiz.isBossBattle);
    const isFirstAttempt = existingAttempts === 0;
    const attemptNumber = existingAttempts + 1;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { quizResult, xpResult } = await db.$transaction(async (tx: any) => {
      // 1. Create QuizResult
      const qr = await tx.quizResult.create({
        data: {
          quizId: params.id,
          studentId: student.id,
          attemptNumber,
          score,
          percentage,
          correctAnswers,
          totalQuestions: questions.length,
          answers: gradedAnswers,
          startedAt: new Date(parsed.data.startedAt),
          completedAt: now,
          timeSpent: parsed.data.timeSpent,
          xpEarned: xpEvent.totalXP,
          bossDefeated: quiz.isBossBattle ? percentage >= 60 : undefined,
        },
      });

      // 2. Domain-specific profile update (quizzesCompleted)
      const profile = await tx.studentClassProfile.findUnique({
        where: {
          studentId_classId: {
            studentId: student.id,
            classId: quiz.class.id,
          },
        },
      });

      if (profile && isFirstAttempt) {
        await tx.studentClassProfile.update({
          where: { id: profile.id },
          data: { quizzesCompleted: { increment: 1 } },
        });
      }

      // 3. Award XP (handles class profile XP, student XP, activity feed, level-up, grade)
      const xr = await awardXP({
        tx,
        studentId: student.id,
        classProfileId: profile?.id ?? '',
        classId: quiz.class.id,
        userId: session.user.id,
        xpEvent,
        activityType: 'QUIZ_COMPLETED',
        activityTitle: `Completed quiz: ${quiz.title}`,
        relatedType: 'quiz',
        relatedId: params.id,
      });

      return { quizResult: qr, xpResult: xr };
    });

    // Build response with correct answers if showCorrectAnswers is enabled
    const responseData: Record<string, unknown> = {
      id: quizResult.id,
      score,
      totalPoints: quiz.totalPoints,
      percentage,
      correctAnswers,
      totalQuestions: questions.length,
      xpEarned: xpEvent.totalXP,
      xpReason: xpEvent.reason,
      attemptNumber,
      bossDefeated: quiz.isBossBattle ? percentage >= 60 : undefined,
      leveledUp: xpResult.leveledUp,
      newLevel: xpResult.leveledUp ? xpResult.newLevel : undefined,
      newTitle: xpResult.newTitle,
      achievementsUnlocked: xpResult.achievementsUnlocked.length > 0
        ? xpResult.achievementsUnlocked
        : undefined,
    };

    if (quiz.showCorrectAnswers) {
      responseData.answers = gradedAnswers;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      responseData.correctAnswersDetail = questions.map((q: any, i: number) => ({
        questionIndex: i,
        question: q.question,
        correctAnswer:
          q.type === 'SHORT_ANSWER'
            ? q.correctAnswer
            : q.options?.find((o: { isCorrect: boolean }) => o.isCorrect)?.text,
        explanation: q.explanation,
      }));
    }

    return NextResponse.json({ success: true, data: responseData }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
