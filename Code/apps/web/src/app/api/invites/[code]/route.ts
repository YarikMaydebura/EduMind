import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth/helpers';

export async function DELETE(_req: Request, { params }: { params: { code: string } }) {
  try {
    const session = await requireAuth();

    if (!['TECH_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const invite = await db.invite.findFirst({
      where: { code: params.code, tenantId: session.user.tenantId },
    });

    if (!invite) {
      return NextResponse.json({ message: 'Invite not found' }, { status: 404 });
    }

    await db.invite.delete({ where: { id: invite.id } });

    return NextResponse.json({ success: true, data: null });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
