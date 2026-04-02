import { NextResponse } from 'next/server';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';

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

    const classes = await db.characterClass.findMany({
      where: { theme: theme as 'FANTASY', rarity: 'CLASS_COMMON' },
      select: {
        id: true,
        name: true,
        description: true,
        passives: true,
        iconUrl: true,
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ success: true, data: classes });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
