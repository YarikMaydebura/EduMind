import { NextResponse } from 'next/server';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';
import { startBattle } from '@/lib/battle/battle-service';

export async function POST(req: Request) {
  try {
    const session = await requireAuth();

    if (session.user.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { type, opponentLevel } = body as {
      type: 'PVE_DUNGEON' | 'FRIENDLY';
      opponentLevel?: number;
    };

    if (!type || !['PVE_DUNGEON', 'FRIENDLY'].includes(type)) {
      return NextResponse.json({ message: 'Invalid battle type' }, { status: 400 });
    }

    const student = await db.student.findUnique({
      where: { userId: session.user.id },
      select: { id: true, overallLevel: true },
    });

    if (!student || student.overallLevel < 5) {
      return NextResponse.json({ message: 'Must be Level 5+ to battle' }, { status: 403 });
    }

    const result = await startBattle(student.id, type, opponentLevel);

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
