import { NextResponse } from 'next/server';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    if (session.user.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { itemId, quantity = 1 } = body as { itemId: string; quantity?: number };

    if (!itemId) {
      return NextResponse.json({ message: 'itemId is required' }, { status: 400 });
    }

    const item = await db.item.findUnique({ where: { id: itemId } });
    if (!item || !item.inShop) {
      return NextResponse.json({ message: 'Item not found or not in shop' }, { status: 404 });
    }

    const character = await db.battleCharacter.findFirst({
      where: { student: { userId: session.user.id } },
      select: { id: true, knowledgePoints: true },
    });

    if (!character) {
      return NextResponse.json({ message: 'No battle character' }, { status: 404 });
    }

    const totalCost = item.price * quantity;
    if (character.knowledgePoints < totalCost) {
      return NextResponse.json({ message: `Not enough KP (need ${totalCost}, have ${character.knowledgePoints})` }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await db.$transaction(async (tx: any) => {
      // Deduct KP
      await tx.battleCharacter.update({
        where: { id: character.id },
        data: { knowledgePoints: { decrement: totalCost } },
      });

      // Add to inventory (upsert — stack if consumable)
      if (item.consumable) {
        const existing = await tx.characterItem.findFirst({
          where: { characterId: character.id, itemId },
        });
        if (existing) {
          await tx.characterItem.update({
            where: { id: existing.id },
            data: { quantity: { increment: quantity } },
          });
        } else {
          await tx.characterItem.create({
            data: { characterId: character.id, itemId, quantity },
          });
        }
      } else {
        await tx.characterItem.create({
          data: { characterId: character.id, itemId, quantity: 1 },
        });
      }

      // Log transaction
      await tx.shopTransaction.create({
        data: { characterId: character.id, itemId, quantity, totalKp: totalCost },
      });

      return { kpSpent: totalCost, newBalance: character.knowledgePoints - totalCost };
    });

    return NextResponse.json({ success: true, data: result });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
