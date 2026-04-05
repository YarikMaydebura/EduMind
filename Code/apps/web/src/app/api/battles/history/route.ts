import { NextResponse } from 'next/server';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await requireAuth();

    if (session.user.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const student = await db.student.findUnique({
      where: { userId: session.user.id },
      select: { battleCharacter: { select: { id: true } } },
    });

    if (!student?.battleCharacter) {
      return NextResponse.json({ success: true, data: [] });
    }

    const battles = await db.battle.findMany({
      where: {
        OR: [
          { player1Id: student.battleCharacter.id },
          { player2Id: student.battleCharacter.id },
        ],
        status: { not: 'BATTLE_IN_PROGRESS' },
      },
      select: {
        id: true,
        type: true,
        status: true,
        rewards: true,
        winnerId: true,
        player1Id: true,
        startedAt: true,
        completedAt: true,
      },
      orderBy: { startedAt: 'desc' },
      take: 10,
    });

    const history = battles.map((b) => {
      const isPlayer1 = b.player1Id === student.battleCharacter!.id;
      const isWinner = b.winnerId === student.battleCharacter!.id;
      const result =
        b.status === 'BATTLE_DRAW' ? 'DRAW' :
        b.status === 'BATTLE_CANCELLED' ? 'FORFEIT' :
        isWinner ? 'WIN' : 'LOSS';

      const rewards = b.rewards as { player1XP?: number; player1KP?: number; player2XP?: number; player2KP?: number } | null;
      const xp = isPlayer1 ? (rewards?.player1XP ?? 0) : (rewards?.player2XP ?? 0);
      const kp = isPlayer1 ? (rewards?.player1KP ?? 0) : (rewards?.player2KP ?? 0);

      return {
        id: b.id,
        type: b.type,
        result,
        xpEarned: xp,
        kpEarned: kp,
        date: b.completedAt ?? b.startedAt,
      };
    });

    return NextResponse.json({ success: true, data: history });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
