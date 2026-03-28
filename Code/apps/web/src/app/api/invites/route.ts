import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth/helpers';

import { createInviteSchema, generateInviteCode } from '@edumind/shared';

export async function GET() {
  try {
    const session = await requireAuth();

    if (!['TECH_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const invites = await db.invite.findMany({
      where: { tenantId: session.user.tenantId },
      include: {
        class: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: invites });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireAuth();

    if (!['TECH_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = createInviteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Validation failed', errors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const code = generateInviteCode();
    const expiresAt = new Date(Date.now() + parsed.data.expiresInDays * 24 * 60 * 60 * 1000);

    const invite = await db.invite.create({
      data: {
        code,
        role: parsed.data.role,
        email: parsed.data.email,
        maxUses: parsed.data.maxUses,
        expiresAt,
        tenantId: session.user.tenantId,
        classId: parsed.data.classId,
        createdById: session.user.id,
      },
    });

    return NextResponse.json({ success: true, data: invite }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
