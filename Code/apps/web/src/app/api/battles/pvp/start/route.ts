import { NextResponse } from 'next/server';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';
import { startPvpBattle } from '@/lib/battle/battle-service';

export async function POST(req: Request) {
  try {
    const session = await requireAuth();

    if (session.user.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { opponentId } = body as { opponentId: string };

    if (!opponentId) {
      return NextResponse.json({ message: 'opponentId is required' }, { status: 400 });
    }

    const student = await db.student.findUnique({
      where: { userId: session.user.id },
      select: { id: true, overallLevel: true },
    });

    if (!student || student.overallLevel < 5) {
      return NextResponse.json({ message: 'Must be Level 5+ to PvP' }, { status: 403 });
    }

    const result = await startPvpBattle(student.id, opponentId);

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    const status = msg.includes('limit') || msg.includes('cooldown') ? 429 : 500;
    return NextResponse.json({ message: msg }, { status });
  }
}
