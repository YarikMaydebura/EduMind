import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth/helpers';

import { updateProfileSchema } from '@edumind/shared';

export async function GET() {
  try {
    const session = await requireAuth();

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        tenant: { select: { id: true, name: true, plan: true, trialEndsAt: true } },
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

export async function PATCH(req: Request) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Validation failed', errors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const updated = await db.user.update({
      where: { id: session.user.id },
      data: {
        ...(parsed.data.firstName && { firstName: parsed.data.firstName }),
        ...(parsed.data.lastName && { lastName: parsed.data.lastName }),
        ...(parsed.data.language && { language: parsed.data.language }),
        ...(parsed.data.themePreference && { theme: parsed.data.themePreference }),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
        language: true,
        theme: true,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
