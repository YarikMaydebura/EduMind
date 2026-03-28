import { NextResponse } from 'next/server';

import { submitHomeworkSchema } from '@edumind/shared';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();

    const homework = await db.homework.findUnique({
      where: { id: params.id },
      include: {
        class: {
          select: {
            tenantId: true,
            teacher: { select: { userId: true } },
          },
        },
      },
    });

    if (!homework || homework.class.tenantId !== session.user.tenantId) {
      return NextResponse.json({ message: 'Homework not found' }, { status: 404 });
    }

    const isAdmin = ['TECH_ADMIN', 'SCHOOL_ADMIN'].includes(session.user.role);
    const isOwner = session.user.role === 'TEACHER' && homework.class.teacher.userId === session.user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const submissions = await db.homeworkSubmission.findMany({
      where: { homeworkId: params.id },
      include: {
        student: {
          include: {
            user: {
              select: { firstName: true, lastName: true, avatar: true },
            },
          },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = submissions.map((s: any) => ({
      studentId: s.studentId,
      firstName: s.student.user.firstName,
      lastName: s.student.user.lastName,
      avatar: s.student.user.avatar,
      status: s.status,
      score: s.score,
      percentage: s.percentage,
      xpEarned: s.xpEarned,
      isLate: s.isLate,
      submittedAt: s.submittedAt,
      gradedAt: s.gradedAt,
    }));

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();

    if (session.user.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Only students can submit homework' }, { status: 403 });
    }

    const student = await db.student.findUnique({ where: { userId: session.user.id } });
    if (!student) {
      return NextResponse.json({ message: 'Student profile not found' }, { status: 404 });
    }

    const homework = await db.homework.findUnique({
      where: { id: params.id },
      include: {
        class: { select: { id: true, tenantId: true } },
      },
    });

    if (!homework || homework.class.tenantId !== session.user.tenantId) {
      return NextResponse.json({ message: 'Homework not found' }, { status: 404 });
    }

    const enrollment = await db.classEnrollment.findUnique({
      where: { classId_studentId: { classId: homework.class.id, studentId: student.id } },
    });

    if (!enrollment?.isActive) {
      return NextResponse.json({ message: 'Not enrolled in this class' }, { status: 403 });
    }

    // Check if already submitted
    const existing = await db.homeworkSubmission.findUnique({
      where: { homeworkId_studentId: { homeworkId: params.id, studentId: student.id } },
    });

    if (existing) {
      return NextResponse.json({ message: 'Already submitted' }, { status: 400 });
    }

    const body = await req.json();
    const parsed = submitHomeworkSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Validation failed', errors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const isLate = new Date() > new Date(homework.dueAt);

    const submission = await db.homeworkSubmission.create({
      data: {
        homeworkId: params.id,
        studentId: student.id,
        content: parsed.data.content,
        status: 'SUBMITTED',
        isLate,
      },
    });

    return NextResponse.json({ success: true, data: submission }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
