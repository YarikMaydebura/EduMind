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
      select: { id: true },
    });
    const character = student
      ? await db.battleCharacter.findUnique({
          where: { studentId: student.id },
          select: { id: true },
        })
      : null;

    if (!character) {
      return NextResponse.json({ success: true, data: { skills: [], equipped: [] } });
    }

    const skills = await db.characterSkill.findMany({
      where: { characterId: character.id },
      include: {
        skill: {
          select: {
            id: true,
            name: true,
            type: true,
            rarity: true,
            description: true,
            mpCost: true,
            staCost: true,
            power: true,
            hitCount: true,
            cooldown: true,
            effects: true,
            primarySubject: true,
            iconUrl: true,
          },
        },
      },
      orderBy: [{ isEquipped: 'desc' }, { equipSlot: 'asc' }, { unlockedAt: 'desc' }],
    });

    const equipped = skills.filter((s) => s.isEquipped);
    const unequipped = skills.filter((s) => !s.isEquipped);

    return NextResponse.json({
      success: true,
      data: {
        skills: skills.map((cs) => ({
          characterSkillId: cs.id,
          ...cs.skill,
          isEquipped: cs.isEquipped,
          equipSlot: cs.equipSlot,
          masteryLevel: cs.masteryLevel,
          masteryXp: cs.masteryXp,
          unlockedAt: cs.unlockedAt,
        })),
        equipped: equipped.map((cs) => ({
          characterSkillId: cs.id,
          slot: cs.equipSlot,
          ...cs.skill,
          masteryLevel: cs.masteryLevel,
        })),
        unequipped: unequipped.map((cs) => ({
          characterSkillId: cs.id,
          ...cs.skill,
          masteryLevel: cs.masteryLevel,
        })),
        totalLearned: skills.length,
        totalEquipped: equipped.length,
      },
    });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
