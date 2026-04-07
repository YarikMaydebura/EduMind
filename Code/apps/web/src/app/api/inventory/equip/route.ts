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
    const { itemId, action } = body as { itemId: string; action: 'equip' | 'unequip' };

    if (!itemId || !['equip', 'unequip'].includes(action)) {
      return NextResponse.json({ message: 'itemId and action (equip/unequip) required' }, { status: 400 });
    }

    const character = await db.battleCharacter.findFirst({
      where: { student: { userId: session.user.id } },
      select: { id: true },
    });

    if (!character) {
      return NextResponse.json({ message: 'No battle character' }, { status: 404 });
    }

    const charItem = await db.characterItem.findFirst({
      where: { characterId: character.id, itemId },
      include: { item: { select: { type: true, name: true } } },
    });

    if (!charItem) {
      return NextResponse.json({ message: 'Item not in inventory' }, { status: 404 });
    }

    // Determine slot from item type
    const slotMap: Record<string, string> = {
      WEAPON: 'weapon',
      ARMOR: 'armor',
      ACCESSORY: 'accessory',
    };
    const slot = slotMap[charItem.item.type];
    if (!slot) {
      return NextResponse.json({ message: 'This item type cannot be equipped' }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await db.$transaction(async (tx: any) => {
      if (action === 'equip') {
        // Unequip current item in this slot
        await tx.characterItem.updateMany({
          where: { characterId: character.id, equipSlot: slot, isEquipped: true },
          data: { isEquipped: false, equipSlot: null },
        });

        // Equip new item
        await tx.characterItem.update({
          where: { id: charItem.id },
          data: { isEquipped: true, equipSlot: slot },
        });

        // Update BattleCharacter slot reference
        const updateData: Record<string, string | null> = {};
        if (slot === 'weapon') updateData.weaponId = itemId;
        if (slot === 'armor') updateData.armorId = itemId;
        if (slot === 'accessory') updateData.accessoryId = itemId;
        await tx.battleCharacter.update({ where: { id: character.id }, data: updateData });
      } else {
        // Unequip
        await tx.characterItem.update({
          where: { id: charItem.id },
          data: { isEquipped: false, equipSlot: null },
        });

        const updateData: Record<string, string | null> = {};
        if (slot === 'weapon') updateData.weaponId = null;
        if (slot === 'armor') updateData.armorId = null;
        if (slot === 'accessory') updateData.accessoryId = null;
        await tx.battleCharacter.update({ where: { id: character.id }, data: updateData });
      }
    });

    return NextResponse.json({ success: true, data: { action, slot, itemName: charItem.item.name } });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
