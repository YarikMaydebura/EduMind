import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth/helpers';

import { updateTenantSchema } from '@edumind/shared';

export async function GET() {
  try {
    const session = await requireAuth();

    const tenant = await db.tenant.findUnique({
      where: { id: session.user.tenantId },
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    if (!tenant) {
      return NextResponse.json({ message: 'Tenant not found' }, { status: 404 });
    }

    const [teacherCount, studentCount] = await Promise.all([
      db.user.count({ where: { tenantId: tenant.id, role: 'TEACHER' } }),
      db.user.count({ where: { tenantId: tenant.id, role: 'STUDENT' } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        ...tenant,
        stats: { teachers: teacherCount, students: studentCount },
      },
    });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await requireAuth();

    if (!['TECH_ADMIN', 'SCHOOL_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = updateTenantSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Validation failed', errors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const updateData: Record<string, unknown> = {};
    if (parsed.data.name) updateData.name = parsed.data.name;
    if (parsed.data.logo !== undefined) updateData.logo = parsed.data.logo;
    if (parsed.data.settings) updateData.settings = parsed.data.settings;

    const updated = await db.tenant.update({
      where: { id: session.user.tenantId },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
