import { NextResponse } from 'next/server';

import { generateInviteCode } from '@edumind/shared';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';

export async function POST(_req: Request, { params }: { params: { id: string } }) {
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

    const code = generateInviteCode();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const invite = await db.invite.create({
      data: {
        code,
        role: 'STUDENT',
        maxUses: 30,
        expiresAt,
        tenantId: session.user.tenantId,
        classId: params.id,
        createdById: session.user.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          code: invite.code,
          expiresAt: invite.expiresAt,
          maxUses: invite.maxUses,
        },
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
