import { NextResponse } from 'next/server';

import { createClassSchema } from '@edumind/shared';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(req.url);

    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const perPage = Math.min(50, Math.max(1, parseInt(searchParams.get('perPage') || '20')));
    const search = searchParams.get('search');
    const subject = searchParams.get('subject');
    const archived = searchParams.get('archived') === 'true';

    const where: Record<string, unknown> = {
      tenantId: session.user.tenantId,
      isArchived: archived,
    };

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    if (subject) {
      where.subject = subject;
    }

    const role = session.user.role;

    if (role === 'TEACHER') {
      const teacher = await db.teacher.findUnique({
        where: { userId: session.user.id },
      });
      if (!teacher) {
        return NextResponse.json({ message: 'Teacher profile not found' }, { status: 404 });
      }
      where.teacherId = teacher.id;
    } else if (role === 'STUDENT') {
      const student = await db.student.findUnique({
        where: { userId: session.user.id },
      });
      if (!student) {
        return NextResponse.json({ message: 'Student profile not found' }, { status: 404 });
      }
      where.enrollments = { some: { studentId: student.id, isActive: true } };
    } else if (!['TECH_ADMIN', 'SCHOOL_ADMIN'].includes(role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const [classes, total] = await Promise.all([
      db.class.findMany({
        where,
        select: {
          id: true,
          name: true,
          subject: true,
          gradeYear: true,
          description: true,
          lessonsPerWeek: true,
          defaultDuration: true,
          isArchived: true,
          createdAt: true,
          teacher: {
            select: {
              id: true,
              user: { select: { firstName: true, lastName: true } },
            },
          },
          _count: {
            select: { enrollments: { where: { isActive: true } } },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      db.class.count({ where }),
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = classes.map((c: any) => ({
      ...c,
      studentsCount: c._count.enrollments,
      teacherName: `${c.teacher.user.firstName} ${c.teacher.user.lastName}`,
      _count: undefined,
    }));

    return NextResponse.json({
      success: true,
      data,
      meta: { page, perPage, total, totalPages: Math.ceil(total / perPage) },
    });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireAuth();

    if (!['TEACHER', 'TECH_ADMIN', 'SCHOOL_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = createClassSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Validation failed', errors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const teacher = await db.teacher.findUnique({
      where: { userId: session.user.id },
    });

    if (!teacher) {
      return NextResponse.json({ message: 'Teacher profile not found' }, { status: 404 });
    }

    const newClass = await db.class.create({
      data: {
        name: parsed.data.name,
        subject: parsed.data.subject as never,
        gradeYear: parsed.data.gradeYear as never,
        description: parsed.data.description,
        lessonsPerWeek: parsed.data.lessonsPerWeek,
        defaultDuration: parsed.data.defaultDuration,
        teacherId: teacher.id,
        tenantId: session.user.tenantId,
      },
    });

    return NextResponse.json({ success: true, data: newClass }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
