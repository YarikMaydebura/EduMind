import { NextResponse } from 'next/server';

import { createLessonSchema } from '@edumind/shared';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(req.url);

    // Verify class access
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
    if (role === 'STUDENT') {
      const student = await db.student.findUnique({ where: { userId: session.user.id } });
      if (!student) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
      const enrollment = await db.classEnrollment.findUnique({
        where: { classId_studentId: { classId: params.id, studentId: student.id } },
      });
      if (!enrollment?.isActive) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
      }
    }
    if (role === 'PARENT') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const perPage = Math.min(50, Math.max(1, parseInt(searchParams.get('perPage') || '50')));
    const status = searchParams.get('status');
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    const where: Record<string, unknown> = { classId: params.id };

    if (status) where.status = status;
    if (from || to) {
      const scheduledAt: Record<string, Date> = {};
      if (from) scheduledAt.gte = new Date(from);
      if (to) scheduledAt.lte = new Date(to);
      where.scheduledAt = scheduledAt;
    }

    const [lessons, total] = await Promise.all([
      db.lesson.findMany({
        where,
        select: {
          id: true,
          title: true,
          topic: true,
          scheduledAt: true,
          duration: true,
          status: true,
          startedAt: true,
          completedAt: true,
          createdAt: true,
          teacher: {
            select: { user: { select: { firstName: true, lastName: true } } },
          },
          _count: { select: { attendance: true } },
        },
        orderBy: { scheduledAt: 'asc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      db.lesson.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: lessons,
      meta: { page, perPage, total, totalPages: Math.ceil(total / perPage) },
    });
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
    const parsed = createLessonSchema.safeParse(body);

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

    const lesson = await db.lesson.create({
      data: {
        classId: params.id,
        teacherId: teacher.id,
        title: parsed.data.title,
        topic: parsed.data.topic,
        description: parsed.data.description,
        scheduledAt: new Date(parsed.data.scheduledAt),
        duration: parsed.data.duration,
      },
    });

    return NextResponse.json({ success: true, data: lesson }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
