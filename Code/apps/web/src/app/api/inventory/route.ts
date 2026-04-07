import { NextResponse } from 'next/server';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await requireAuth();
    if (session.user.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const character = await db.battleCharacter.findFirst({
      where: { student: { userId: session.user.id } },
      select: { id: true, weaponId: true, armorId: true, accessoryId: true },
    });

    if (!character) {
      return NextResponse.json({ success: true, data: { items: [], equipped: { weapon: null, armor: null, accessory: null } } });
    }

    const items = await db.characterItem.findMany({
      where: { characterId: character.id },
      include: {
        item: {
          select: {
            id: true, name: true, description: true, type: true, rarity: true,
            price: true, effects: true, consumable: true, iconUrl: true,
          },
        },
      },
      orderBy: [{ isEquipped: 'desc' }, { acquiredAt: 'desc' }],
    });

    const equipped = items.filter((i) => i.isEquipped);
    const consumables = items.filter((i) => i.item.consumable && !i.isEquipped);
    const equipment = items.filter((i) => !i.item.consumable && !i.isEquipped);

    return NextResponse.json({
      success: true,
      data: {
        items: items.map((ci) => ({
          characterItemId: ci.id,
          ...ci.item,
          quantity: ci.quantity,
          isEquipped: ci.isEquipped,
          equipSlot: ci.equipSlot,
        })),
        equipped: {
          weapon: equipped.find((i) => i.equipSlot === 'weapon')?.item ?? null,
          armor: equipped.find((i) => i.equipSlot === 'armor')?.item ?? null,
          accessory: equipped.find((i) => i.equipSlot === 'accessory')?.item ?? null,
        },
        consumables: consumables.map((ci) => ({ ...ci.item, quantity: ci.quantity })),
        equipment: equipment.map((ci) => ({ ...ci.item, quantity: ci.quantity })),
      },
    });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
