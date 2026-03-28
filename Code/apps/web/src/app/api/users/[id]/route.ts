import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth/helpers';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();

    if (!['TECH_ADMIN', 'SCHOOL_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const user = await db.user.findFirst({
      where: { id: params.id, tenantId: session.user.tenantId },
      include: {
        teacherProfile: true,
        studentProfile: true,
        parentProfile: true,
        schoolAdmin: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const { passwordHash, ...safeUser } = user;
    return NextResponse.json({ success: true, data: safeUser });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();

    if (!['TECH_ADMIN', 'SCHOOL_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();

    const user = await db.user.findFirst({
      where: { id: params.id, tenantId: session.user.tenantId },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (body.isActive !== undefined) updateData.isActive = Boolean(body.isActive);
    if (body.role && ['TEACHER', 'STUDENT', 'PARENT'].includes(body.role)) {
      updateData.role = body.role;
    }

    const updated = await db.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
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

    if (!['TECH_ADMIN', 'SCHOOL_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const user = await db.user.findFirst({
      where: { id: params.id, tenantId: session.user.tenantId },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.id === session.user.id) {
      return NextResponse.json({ message: 'Cannot deactivate yourself' }, { status: 400 });
    }

    await db.user.update({
      where: { id: params.id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true, data: null });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
