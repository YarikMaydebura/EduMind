import { NextResponse } from 'next/server';

import { MAX_EQUIPPED_SKILLS } from '@edumind/shared';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const session = await requireAuth();

    if (session.user.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { skillId, slot } = body as { skillId: string; slot: number | null };

    if (!skillId) {
      return NextResponse.json({ message: 'skillId is required' }, { status: 400 });
    }

    const student = await db.student.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });
    const character = student
      ? await db.battleCharacter.findUnique({
          where: { studentId: student.id },
          select: { id: true },
        })
      : null;

    if (!character) {
      return NextResponse.json({ message: 'No battle character' }, { status: 404 });
    }

    // Find the learned skill
    const charSkill = await db.characterSkill.findFirst({
      where: { characterId: character.id, skillId },
    });

    if (!charSkill) {
      return NextResponse.json({ message: 'Skill not learned' }, { status: 404 });
    }

    // Unequip
    if (slot === null || slot === undefined) {
      await db.characterSkill.update({
        where: { id: charSkill.id },
        data: { isEquipped: false, equipSlot: null },
      });
      return NextResponse.json({ success: true, data: { action: 'unequipped' } });
    }

    // Validate slot (1-6)
    if (slot < 1 || slot > MAX_EQUIPPED_SKILLS) {
      return NextResponse.json({ message: `Slot must be 1-${MAX_EQUIPPED_SKILLS}` }, { status: 400 });
    }

    // Check if slot is already occupied by another skill
    const occupying = await db.characterSkill.findFirst({
      where: { characterId: character.id, equipSlot: slot, isEquipped: true },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await db.$transaction(async (tx: any) => {
      // Unequip the skill currently in this slot (if any)
      if (occupying && occupying.id !== charSkill.id) {
        await tx.characterSkill.update({
          where: { id: occupying.id },
          data: { isEquipped: false, equipSlot: null },
        });
      }

      // Equip the new skill
      await tx.characterSkill.update({
        where: { id: charSkill.id },
        data: { isEquipped: true, equipSlot: slot },
      });
    });

    return NextResponse.json({ success: true, data: { action: 'equipped', slot } });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
