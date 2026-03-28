import { NextResponse } from 'next/server';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();

    const lesson = await db.lesson.findUnique({
      where: { id: params.id },
      include: {
        class: {
          select: { tenantId: true, teacher: { select: { userId: true } } },
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

    if (lesson.status !== 'SCHEDULED') {
      return NextResponse.json(
        { message: 'Can only start scheduled lessons' },
        { status: 400 },
      );
    }

    const updated = await db.lesson.update({
      where: { id: params.id },
      data: { status: 'IN_PROGRESS', startedAt: new Date() },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
