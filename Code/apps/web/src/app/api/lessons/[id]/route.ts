import { NextResponse } from 'next/server';

import { updateLessonSchema } from '@edumind/shared';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';

async function verifyLessonAccess(
  lessonId: string,
  session: { user: { id: string; role: string; tenantId: string } },
) {
  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
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

  if (!lesson || lesson.class.tenantId !== session.user.tenantId) return null;

  if (['TECH_ADMIN', 'SCHOOL_ADMIN'].includes(session.user.role)) {
    return { lesson, canEdit: true };
  }

  if (session.user.role === 'TEACHER' && lesson.class.teacher.userId === session.user.id) {
    return { lesson, canEdit: true };
  }

  if (session.user.role === 'STUDENT') {
    const student = await db.student.findUnique({ where: { userId: session.user.id } });
    if (!student) return null;
    const enrollment = await db.classEnrollment.findUnique({
      where: { classId_studentId: { classId: lesson.class.id, studentId: student.id } },
    });
    if (enrollment?.isActive) {
      return { lesson, canEdit: false, studentId: student.id };
    }
  }

  return null;
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();
    const access = await verifyLessonAccess(params.id, session);
    if (!access) {
      return NextResponse.json({ message: 'Lesson not found' }, { status: 404 });
    }

    const lesson = await db.lesson.findUnique({
      where: { id: params.id },
      include: {
        teacher: {
          select: { user: { select: { firstName: true, lastName: true, avatar: true } } },
        },
        class: { select: { id: true, name: true, subject: true, gradeYear: true } },
        lessonPlan: true,
        attendance: {
          include: {
            // No user relation on LessonAttendance - studentId is just a string
          },
        },
        _count: { select: { homeworks: true, quizzes: true } },
      },
    });

    if (!lesson) {
      return NextResponse.json({ message: 'Lesson not found' }, { status: 404 });
    }

    // For students, only return their own attendance
    if (session.user.role === 'STUDENT' && access.studentId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filteredAttendance = lesson.attendance.filter(
        (a: any) => a.studentId === access.studentId,
      );
      return NextResponse.json({
        success: true,
        data: { ...lesson, attendance: filteredAttendance },
      });
    }

    return NextResponse.json({ success: true, data: lesson });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();
    const access = await verifyLessonAccess(params.id, session);
    if (!access || !access.canEdit) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    if (access.lesson.status !== 'SCHEDULED') {
      return NextResponse.json(
        { message: 'Can only edit scheduled lessons' },
        { status: 400 },
      );
    }

    const body = await req.json();
    const parsed = updateLessonSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Validation failed', errors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const updateData: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.scheduledAt) {
      updateData.scheduledAt = new Date(parsed.data.scheduledAt);
    }

    const updated = await db.lesson.update({
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
    const access = await verifyLessonAccess(params.id, session);
    if (!access || !access.canEdit) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    if (access.lesson.status !== 'SCHEDULED') {
      return NextResponse.json(
        { message: 'Can only cancel scheduled lessons' },
        { status: 400 },
      );
    }

    await db.lesson.update({
      where: { id: params.id },
      data: { status: 'CANCELLED' },
    });

    return NextResponse.json({ success: true, data: null });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
