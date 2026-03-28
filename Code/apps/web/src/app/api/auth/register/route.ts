import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

import { registerSchema } from '@edumind/shared';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Validation failed', errors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { email, password, firstName, lastName, tenantType, schoolName } = parsed.data;

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: 'Email already registered' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const tenantName = schoolName || `${firstName}'s Academy`;
    const baseSlug = slugify(tenantName);
    const slug = `${baseSlug}-${Date.now().toString(36)}`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await db.$transaction(async (tx: any) => {
      const tenant = await tx.tenant.create({
        data: {
          name: tenantName,
          slug,
          type: tenantType,
          plan: 'FREE_TRIAL',
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          settings: {},
        },
      });

      const role = tenantType === 'SCHOOL' ? 'SCHOOL_ADMIN' : 'TEACHER';

      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          firstName,
          lastName,
          role: role as 'SCHOOL_ADMIN' | 'TEACHER',
          tenantId: tenant.id,
          isActive: true,
        },
      });

      if (role === 'SCHOOL_ADMIN') {
        await tx.schoolAdmin.create({
          data: { userId: user.id },
        });
      } else {
        await tx.teacher.create({
          data: { userId: user.id },
        });
      }

      return { user, tenant };
    });

    return NextResponse.json(
      { message: 'Account created successfully', userId: result.user.id },
      { status: 201 },
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
