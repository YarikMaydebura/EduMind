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
    const type = searchParams.get('type');
    const rarity = searchParams.get('rarity');
    const subject = searchParams.get('subject');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (type) where.type = type;
    if (rarity) where.rarity = rarity;
    if (subject) where.primarySubject = subject;

    const skills = await db.skill.findMany({
      where,
      select: {
        id: true,
        name: true,
        type: true,
        rarity: true,
        description: true,
        mpCost: true,
        staCost: true,
        power: true,
        hitCount: true,
        cooldown: true,
        effects: true,
        primarySubject: true,
        iconUrl: true,
      },
      orderBy: [{ rarity: 'asc' }, { type: 'asc' }, { name: 'asc' }],
    });

    return NextResponse.json({ success: true, data: skills });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
