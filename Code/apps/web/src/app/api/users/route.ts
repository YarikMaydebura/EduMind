import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth/helpers';

export async function GET(req: Request) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(req.url);

    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const perPage = Math.min(50, Math.max(1, parseInt(searchParams.get('perPage') || '20')));
    const role = searchParams.get('role');
    const search = searchParams.get('search');

    const userRole = session.user.role;
    if (!['TECH_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'].includes(userRole)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const where: Record<string, unknown> = {
      tenantId: session.user.tenantId,
    };

    if (role) {
      where.role = role;
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          avatar: true,
          isActive: true,
          lastActiveAt: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      db.user.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: users,
      meta: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
