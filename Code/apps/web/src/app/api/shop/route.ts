import { NextResponse } from 'next/server';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await requireAuth();
    if (session.user.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const [items, character] = await Promise.all([
      db.item.findMany({
        where: { inShop: true },
        select: {
          id: true, name: true, description: true, type: true, rarity: true,
          price: true, effects: true, consumable: true, iconUrl: true, shopLimit: true,
        },
        orderBy: [{ type: 'asc' }, { price: 'asc' }],
      }),
      db.battleCharacter.findFirst({
        where: { student: { userId: session.user.id } },
        select: { knowledgePoints: true },
      }),
    ]);

    // Group by type
    const grouped: Record<string, typeof items> = {};
    for (const item of items) {
      if (!grouped[item.type]) grouped[item.type] = [];
      grouped[item.type]!.push(item);
    }

    return NextResponse.json({
      success: true,
      data: {
        items,
        grouped,
        kpBalance: character?.knowledgePoints ?? 0,
      },
    });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
