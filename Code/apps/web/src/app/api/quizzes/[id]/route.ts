import { NextResponse } from 'next/server';

import { updateQuizSchema } from '@edumind/shared';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';

async function verifyQuizAccess(
  quizId: string,
  session: { user: { id: string; role: string; tenantId: string } },
) {
  const quiz = await db.quiz.findUnique({
    where: { id: quizId },
    include: {
      class: {
        select: {
          id: true,
          tenantId: true,
          teacher: { select: { id: true, userId: true } },
        },
      },
    },
  });

  if (!quiz || quiz.class.tenantId !== session.user.tenantId) return null;

  if (['TECH_ADMIN', 'SCHOOL_ADMIN'].includes(session.user.role)) {
    return { quiz, canEdit: true };
  }

  if (session.user.role === 'TEACHER' && quiz.class.teacher.userId === session.user.id) {
    return { quiz, canEdit: true };
  }

  if (session.user.role === 'STUDENT') {
    const student = await db.student.findUnique({ where: { userId: session.user.id } });
    if (!student) return null;
    const enrollment = await db.classEnrollment.findUnique({
      where: { classId_studentId: { classId: quiz.class.id, studentId: student.id } },
    });
    if (enrollment?.isActive) {
      return { quiz, canEdit: false, studentId: student.id };
    }
  }

  return null;
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();
    const access = await verifyQuizAccess(params.id, session);
    if (!access) {
      return NextResponse.json({ message: 'Quiz not found' }, { status: 404 });
    }

    const quiz = await db.quiz.findUnique({
      where: { id: params.id },
      include: {
        teacher: {
          select: { user: { select: { firstName: true, lastName: true } } },
        },
        class: { select: { id: true, name: true, subject: true } },
        ...(access.studentId
          ? {
              results: {
                where: { studentId: access.studentId },
                orderBy: { attemptNumber: 'desc' as const },
              },
            }
          : {
              _count: { select: { results: true } },
            }),
      },
    });

    if (!quiz) {
      return NextResponse.json({ message: 'Quiz not found' }, { status: 404 });
    }

    // For students, strip correct answers from questions
    if (access.studentId) {
      const questions = quiz.questions as unknown as Record<string, unknown>[];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sanitized = questions.map((q: any) => ({
        type: q.type,
        question: q.question,
        points: q.points,
        // For MCQ/TRUE_FALSE, show options but remove isCorrect
        ...(q.options
          ? {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              options: q.options.map((o: any) => ({ text: o.text })),
            }
          : {}),
        // Don't include correctAnswer or explanation
      }));

      return NextResponse.json({
        success: true,
        data: { ...quiz, questions: sanitized },
      });
    }

    return NextResponse.json({ success: true, data: quiz });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();
    const access = await verifyQuizAccess(params.id, session);
    if (!access || !access.canEdit) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = updateQuizSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Validation failed', errors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const updateData: Record<string, unknown> = { ...parsed.data };

    if (parsed.data.questions) {
      updateData.totalQuestions = parsed.data.questions.length;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updateData.totalPoints = parsed.data.questions.reduce((sum: number, q: any) => sum + (q.points || 10), 0);
    }
    if (parsed.data.availableFrom) {
      updateData.availableFrom = new Date(parsed.data.availableFrom);
    }
    if (parsed.data.availableUntil) {
      updateData.availableUntil = new Date(parsed.data.availableUntil);
    }

    const updated = await db.quiz.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();
    const access = await verifyQuizAccess(params.id, session);
    if (!access || !access.canEdit) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await db.quiz.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true, data: null });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
