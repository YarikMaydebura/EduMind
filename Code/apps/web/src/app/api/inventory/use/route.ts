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
    const { itemId } = body as { itemId: string };

    if (!itemId) {
      return NextResponse.json({ message: 'itemId is required' }, { status: 400 });
    }

    const character = await db.battleCharacter.findFirst({
      where: { student: { userId: session.user.id } },
      select: { id: true, hp: true, maxHp: true, mp: true, maxMp: true, sta: true, maxSta: true },
    });

    if (!character) {
      return NextResponse.json({ message: 'No battle character' }, { status: 404 });
    }

    const charItem = await db.characterItem.findFirst({
      where: { characterId: character.id, itemId },
      include: { item: { select: { consumable: true, effects: true, name: true } } },
    });

    if (!charItem || charItem.quantity <= 0) {
      return NextResponse.json({ message: 'Item not in inventory or none remaining' }, { status: 404 });
    }

    if (!charItem.item.consumable) {
      return NextResponse.json({ message: 'This item cannot be used (not consumable)' }, { status: 400 });
    }

    const effects = (charItem.item.effects ?? {}) as Record<string, unknown>;

    // Apply healing effects
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};
    const heal = effects.heal as { type?: string; amount?: number } | undefined;
    if (heal) {
      if (heal.type === 'HP') {
        updateData.hp = Math.min(character.maxHp, character.hp + (heal.amount ?? 0));
      } else if (heal.type === 'MP') {
        updateData.mp = Math.min(character.maxMp, character.mp + (heal.amount ?? 0));
      } else if (heal.type === 'STA') {
        updateData.sta = Math.min(character.maxSta, character.sta + (heal.amount ?? 0));
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await db.$transaction(async (tx: any) => {
      // Decrement quantity or delete if last one
      if (charItem.quantity === 1) {
        await tx.characterItem.delete({ where: { id: charItem.id } });
      } else {
        await tx.characterItem.update({
          where: { id: charItem.id },
          data: { quantity: { decrement: 1 } },
        });
      }

      // Apply effects to character
      if (Object.keys(updateData).length > 0) {
        await tx.battleCharacter.update({
          where: { id: character.id },
          data: updateData,
        });
      }
    });

    return NextResponse.json({
      success: true,
      data: { used: charItem.item.name, effects: heal ?? effects },
    });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
