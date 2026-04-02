import { NextResponse } from 'next/server';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();

    if (session.user.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const battle = await db.battle.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        type: true,
        status: true,
        currentTurn: true,
        maxTurns: true,
        battleLog: true,
        rewards: true,
        player1Id: true,
        startedAt: true,
        completedAt: true,
      },
    });

    if (!battle) {
      return NextResponse.json({ message: 'Battle not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: battle });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
