import { NextResponse } from 'next/server';

import { createHomeworkSchema } from '@edumind/shared';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(req.url);

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

    const where: Record<string, unknown> = { classId: params.id };

    const homeworks = await db.homework.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        dueAt: true,
        maxScore: true,
        passingScore: true,
        assignedAt: true,
        _count: { select: { submissions: true } },
        ...(studentId
          ? {
              submissions: {
                where: { studentId },
                select: { status: true, score: true, percentage: true },
                take: 1,
              },
            }
          : {}),
      },
      orderBy: { dueAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: homeworks });
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
    const parsed = createHomeworkSchema.safeParse(body);

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

    const homework = await db.homework.create({
      data: {
        classId: params.id,
        teacherId: teacher.id,
        title: parsed.data.title,
        description: parsed.data.description,
        instructions: parsed.data.instructions,
        dueAt: new Date(parsed.data.dueAt),
        maxScore: parsed.data.maxScore,
        passingScore: parsed.data.passingScore,
        lessonId: parsed.data.lessonId,
        rubric: parsed.data.rubric ?? undefined,
      },
    });

    return NextResponse.json({ success: true, data: homework }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
