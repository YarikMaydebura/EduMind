import { NextResponse } from 'next/server';

import { enrollStudentSchema } from '@edumind/shared';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';

async function verifyTeacherOrAdmin(classId: string, session: { user: { id: string; role: string; tenantId: string } }) {
  const classData = await db.class.findFirst({
    where: { id: classId, tenantId: session.user.tenantId },
    include: { teacher: { select: { userId: true } } },
  });

  if (!classData) return false;

  if (['TECH_ADMIN', 'SCHOOL_ADMIN'].includes(session.user.role)) return true;
  if (session.user.role === 'TEACHER' && classData.teacher.userId === session.user.id) return true;

  return false;
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();

    if (!(await verifyTeacherOrAdmin(params.id, session))) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const enrollments = await db.classEnrollment.findMany({
      where: { classId: params.id, isActive: true },
      include: {
        student: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true, avatar: true },
            },
            classProfiles: {
              where: { classId: params.id },
              select: {
                classXp: true,
                classLevel: true,
                classGrade: true,
                averageScore: true,
              },
            },
          },
        },
      },
      orderBy: { joinedAt: 'desc' },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = enrollments.map((e: any) => ({
      id: e.student.id,
      userId: e.student.user.id,
      firstName: e.student.user.firstName,
      lastName: e.student.user.lastName,
      email: e.student.user.email,
      avatar: e.student.user.avatar,
      joinedAt: e.joinedAt,
      ...(e.student.classProfiles[0] || {
        classXp: 0,
        classLevel: 1,
        classGrade: 'E',
        averageScore: null,
      }),
    }));

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();

    if (!(await verifyTeacherOrAdmin(params.id, session))) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = enrollStudentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Validation failed', errors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const student = await db.student.findUnique({
      where: { id: parsed.data.studentId },
      include: { user: { select: { tenantId: true } } },
    });

    if (!student || student.user.tenantId !== session.user.tenantId) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    const existing = await db.classEnrollment.findUnique({
      where: {
        classId_studentId: { classId: params.id, studentId: parsed.data.studentId },
      },
    });

    if (existing?.isActive) {
      return NextResponse.json({ message: 'Student already enrolled' }, { status: 409 });
    }

    if (existing && !existing.isActive) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await db.$transaction(async (tx: any) => {
        await tx.classEnrollment.update({
          where: { id: existing.id },
          data: { isActive: true, leftAt: null },
        });
        const profileExists = await tx.studentClassProfile.findUnique({
          where: {
            studentId_classId: { studentId: parsed.data.studentId, classId: params.id },
          },
        });
        if (!profileExists) {
          await tx.studentClassProfile.create({
            data: { studentId: parsed.data.studentId, classId: params.id },
          });
        }
      });
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await db.$transaction(async (tx: any) => {
        await tx.classEnrollment.create({
          data: { classId: params.id, studentId: parsed.data.studentId },
        });
        await tx.studentClassProfile.create({
          data: { classId: params.id, studentId: parsed.data.studentId },
        });
      });
    }

    return NextResponse.json({ success: true, data: null }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
