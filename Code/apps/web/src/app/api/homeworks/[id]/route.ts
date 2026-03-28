import { NextResponse } from 'next/server';

import { updateHomeworkSchema } from '@edumind/shared';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';

async function verifyHomeworkAccess(
  homeworkId: string,
  session: { user: { id: string; role: string; tenantId: string } },
) {
  const homework = await db.homework.findUnique({
    where: { id: homeworkId },
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

  if (!homework || homework.class.tenantId !== session.user.tenantId) return null;

  if (['TECH_ADMIN', 'SCHOOL_ADMIN'].includes(session.user.role)) {
    return { homework, canEdit: true };
  }

  if (session.user.role === 'TEACHER' && homework.class.teacher.userId === session.user.id) {
    return { homework, canEdit: true };
  }

  if (session.user.role === 'STUDENT') {
    const student = await db.student.findUnique({ where: { userId: session.user.id } });
    if (!student) return null;
    const enrollment = await db.classEnrollment.findUnique({
      where: { classId_studentId: { classId: homework.class.id, studentId: student.id } },
    });
    if (enrollment?.isActive) {
      return { homework, canEdit: false, studentId: student.id };
    }
  }

  return null;
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();
    const access = await verifyHomeworkAccess(params.id, session);
    if (!access) {
      return NextResponse.json({ message: 'Homework not found' }, { status: 404 });
    }

    const homework = await db.homework.findUnique({
      where: { id: params.id },
      include: {
        teacher: {
          select: { user: { select: { firstName: true, lastName: true } } },
        },
        class: { select: { id: true, name: true, subject: true } },
        ...(access.studentId
          ? {
              submissions: {
                where: { studentId: access.studentId },
              },
            }
          : {
              _count: { select: { submissions: true } },
            }),
      },
    });

    if (!homework) {
      return NextResponse.json({ message: 'Homework not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: homework });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();
    const access = await verifyHomeworkAccess(params.id, session);
    if (!access || !access.canEdit) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = updateHomeworkSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Validation failed', errors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const updateData: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.dueAt) {
      updateData.dueAt = new Date(parsed.data.dueAt);
    }

    const updated = await db.homework.update({
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
    const access = await verifyHomeworkAccess(params.id, session);
    if (!access || !access.canEdit) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await db.homework.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true, data: null });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
