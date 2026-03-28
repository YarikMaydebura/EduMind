import { NextResponse } from 'next/server';

import { createQuizSchema } from '@edumind/shared';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();

    const classData = await db.class.findFirst({
      where: { id: params.id, tenantId: session.user.tenantId },
      include: { teacher: { select: { userId: true } } },
    });

    if (!classData) {
      return NextResponse.json({ message: 'Class not found' }, { status: 404 });
    }

    const role = session.user.role;

    if (role === 'TEACHER' && classData.teacher.userId !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    let studentId: string | null = null;
    if (role === 'STUDENT') {
      const student = await db.student.findUnique({ where: { userId: session.user.id } });
      if (!student) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
      const enrollment = await db.classEnrollment.findUnique({
        where: { classId_studentId: { classId: params.id, studentId: student.id } },
      });
      if (!enrollment?.isActive) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
      }
      studentId = student.id;
    }

    const quizzes = await db.quiz.findMany({
      where: { classId: params.id },
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        totalQuestions: true,
        totalPoints: true,
        timeLimit: true,
        isBossBattle: true,
        bossName: true,
        allowRetakes: true,
        maxAttempts: true,
        availableFrom: true,
        availableUntil: true,
        createdAt: true,
        _count: { select: { results: true } },
        ...(studentId
          ? {
              results: {
                where: { studentId },
                select: {
                  id: true,
                  score: true,
                  percentage: true,
                  attemptNumber: true,
                  xpEarned: true,
                  completedAt: true,
                },
                orderBy: { percentage: 'desc' as const },
                take: 1,
              },
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: quizzes });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();

    if (!['TEACHER', 'TECH_ADMIN', 'SCHOOL_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = createQuizSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Validation failed', errors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const teacher = await db.teacher.findUnique({ where: { userId: session.user.id } });
    if (!teacher) {
      return NextResponse.json({ message: 'Teacher profile not found' }, { status: 404 });
    }

    const classData = await db.class.findFirst({
      where: { id: params.id, teacherId: teacher.id, tenantId: session.user.tenantId },
    });

    if (!classData) {
      return NextResponse.json({ message: 'Class not found' }, { status: 404 });
    }

    // Calculate totalPoints from questions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalPoints = parsed.data.questions.reduce((sum: number, q: any) => sum + (q.points || 10), 0);

    const quiz = await db.quiz.create({
      data: {
        classId: params.id,
        teacherId: teacher.id,
        title: parsed.data.title,
        description: parsed.data.description,
        type: parsed.data.type,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        questions: JSON.parse(JSON.stringify(parsed.data.questions)) as any,
        totalQuestions: parsed.data.questions.length,
        totalPoints,
        timeLimit: parsed.data.timeLimit,
        shuffleQuestions: parsed.data.shuffleQuestions,
        showCorrectAnswers: parsed.data.showCorrectAnswers,
        allowRetakes: parsed.data.allowRetakes,
        maxAttempts: parsed.data.maxAttempts,
        availableFrom: parsed.data.availableFrom ? new Date(parsed.data.availableFrom) : undefined,
        availableUntil: parsed.data.availableUntil
          ? new Date(parsed.data.availableUntil)
          : undefined,
        isBossBattle: parsed.data.isBossBattle,
        bossName: parsed.data.bossName,
        difficulty: parsed.data.difficulty,
      },
    });

    return NextResponse.json({ success: true, data: quiz }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
