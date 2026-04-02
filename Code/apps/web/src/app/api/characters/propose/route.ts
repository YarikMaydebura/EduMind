import { NextResponse } from 'next/server';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';
import { proposeClasses } from '@/lib/gamification/propose-classes';

export async function GET(req: Request) {
  try {
    const session = await requireAuth();

    if (session.user.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const theme = searchParams.get('theme');

    if (!theme) {
      return NextResponse.json({ message: 'theme query param is required' }, { status: 400 });
    }

    const student = await db.student.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!student) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    const proposals = await proposeClasses(student.id, theme);

    return NextResponse.json({ success: true, data: proposals });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
