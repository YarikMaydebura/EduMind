import { NextResponse } from 'next/server';

import { updateClassSchema } from '@edumind/shared';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';

async function verifyClassAccess(classId: string, session: { user: { id: string; role: string; tenantId: string } }) {
  const classData = await db.class.findFirst({
    where: { id: classId, tenantId: session.user.tenantId },
    include: {
      teacher: { select: { id: true, userId: true } },
    },
  });

  if (!classData) return null;

  if (['TECH_ADMIN', 'SCHOOL_ADMIN'].includes(session.user.role)) {
    return { classData, canEdit: true };
  }

  if (session.user.role === 'TEACHER' && classData.teacher.userId === session.user.id) {
    return { classData, canEdit: true };
  }

  if (session.user.role === 'STUDENT') {
    const student = await db.student.findUnique({ where: { userId: session.user.id } });
    if (!student) return null;
    const enrollment = await db.classEnrollment.findUnique({
      where: { classId_studentId: { classId, studentId: student.id } },
    });
    if (enrollment?.isActive) {
      return { classData, canEdit: false };
    }
  }

  return null;
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();

    const access = await verifyClassAccess(params.id, session);
    if (!access) {
      return NextResponse.json({ message: 'Class not found' }, { status: 404 });
    }

    const classDetail = await db.class.findUnique({
      where: { id: params.id },
      include: {
        teacher: {
          select: {
            id: true,
            user: { select: { firstName: true, lastName: true, avatar: true } },
          },
        },
        enrollments: {
          where: { isActive: true },
          include: {
            student: {
              include: {
                user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
                classProfiles: {
                  where: { classId: params.id },
                  select: {
                    classXp: true,
                    classLevel: true,
                    classGrade: true,
                    averageScore: true,
                    lessonsCompleted: true,
                    homeworkCompleted: true,
                    quizzesCompleted: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: { lessons: true, homeworks: true, quizzes: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: classDetail });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();

    const access = await verifyClassAccess(params.id, session);
    if (!access) {
      return NextResponse.json({ message: 'Class not found' }, { status: 404 });
    }
    if (!access.canEdit) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = updateClassSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Validation failed', errors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { settings, ...rest } = parsed.data;
    const updated = await db.class.update({
      where: { id: params.id },
      data: {
        ...rest,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(settings !== undefined && { settings: JSON.parse(JSON.stringify(settings)) as any }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();

    const access = await verifyClassAccess(params.id, session);
    if (!access) {
      return NextResponse.json({ message: 'Class not found' }, { status: 404 });
    }
    if (!access.canEdit) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await db.class.update({
      where: { id: params.id },
      data: { isArchived: true },
    });

    return NextResponse.json({ success: true, data: null });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
