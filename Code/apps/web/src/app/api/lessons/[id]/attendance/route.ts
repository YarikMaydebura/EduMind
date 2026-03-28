import { NextResponse } from 'next/server';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();

    const lesson = await db.lesson.findUnique({
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

    if (!lesson || lesson.class.tenantId !== session.user.tenantId) {
      return NextResponse.json({ message: 'Lesson not found' }, { status: 404 });
    }

    const isAdmin = ['TECH_ADMIN', 'SCHOOL_ADMIN'].includes(session.user.role);
    const isOwner = session.user.role === 'TEACHER' && lesson.class.teacher.userId === session.user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const attendance = await db.lessonAttendance.findMany({
      where: { lessonId: params.id },
    });

    // Get full student roster from class enrollments
    const enrollments = await db.classEnrollment.findMany({
      where: { classId: lesson.class.id, isActive: true },
      include: {
        student: {
          include: {
            user: {
              select: { firstName: true, lastName: true, avatar: true },
            },
          },
        },
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const students = enrollments.map((e: any) => ({
      id: e.student.id,
      firstName: e.student.user.firstName,
      lastName: e.student.user.lastName,
      avatar: e.student.user.avatar,
    }));

    return NextResponse.json({
      success: true,
      data: { attendance, students, lessonStatus: lesson.status },
    });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
