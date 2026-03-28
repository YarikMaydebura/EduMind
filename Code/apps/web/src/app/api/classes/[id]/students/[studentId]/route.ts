import { NextResponse } from 'next/server';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string; studentId: string } },
) {
  try {
    const session = await requireAuth();

    const classData = await db.class.findFirst({
      where: { id: params.id, tenantId: session.user.tenantId },
      include: { teacher: { select: { userId: true } } },
    });

    if (!classData) {
      return NextResponse.json({ message: 'Class not found' }, { status: 404 });
    }

    const isAdmin = ['TECH_ADMIN', 'SCHOOL_ADMIN'].includes(session.user.role);
    const isOwner = session.user.role === 'TEACHER' && classData.teacher.userId === session.user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const enrollment = await db.classEnrollment.findUnique({
      where: {
        classId_studentId: { classId: params.id, studentId: params.studentId },
      },
    });

    if (!enrollment || !enrollment.isActive) {
      return NextResponse.json({ message: 'Enrollment not found' }, { status: 404 });
    }

    await db.classEnrollment.update({
      where: { id: enrollment.id },
      data: { isActive: false, leftAt: new Date() },
    });

    return NextResponse.json({ success: true, data: null });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
