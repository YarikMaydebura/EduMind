import { NextResponse } from 'next/server';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await requireAuth();

    if (session.user.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const rankings = await db.battleCharacter.findMany({
      where: {
        student: { user: { tenantId: session.user.tenantId } },
        battlesWon: { gt: 0 },
      },
      select: {
        id: true,
        battlesWon: true,
        battlesLost: true,
        battlesDraw: true,
        knowledgePoints: true,
        theme: true,
        student: {
          select: {
            user: { select: { firstName: true, lastName: true } },
            overallLevel: true,
          },
        },
        class: { select: { name: true, rarity: true } },
      },
      orderBy: [{ battlesWon: 'desc' }, { battlesLost: 'asc' }],
      take: 50,
    });

    const ranked = rankings.map((r, i) => {
      const total = r.battlesWon + r.battlesLost + r.battlesDraw;
      return {
        rank: i + 1,
        characterId: r.id,
        name: `${r.student.user.firstName} ${r.student.user.lastName}`,
        level: r.student.overallLevel,
        className: r.class.name,
        classRarity: r.class.rarity,
        theme: r.theme,
        wins: r.battlesWon,
        losses: r.battlesLost,
        draws: r.battlesDraw,
        winRate: total > 0 ? Math.round((r.battlesWon / total) * 100) : 0,
        kp: r.knowledgePoints,
      };
    });

    return NextResponse.json({ success: true, data: ranked });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
