import { NextResponse } from 'next/server';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';
import { getStudentProgressData } from '@/lib/gamification/class-unlock';
import { checkSkillUnlock, getCharacterInfo } from '@/lib/gamification/skill-unlock';

export async function GET(_req: Request, { params }: { params: { skillId: string } }) {
  try {
    const session = await requireAuth();

    if (session.user.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const skill = await db.skill.findUnique({
      where: { id: params.skillId },
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
        unlockConditions: true,
        primarySubject: true,
        iconUrl: true,
        exclusiveToClass: { select: { id: true, name: true } },
      },
    });

    if (!skill) {
      return NextResponse.json({ message: 'Skill not found' }, { status: 404 });
    }

    const student = await db.student.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!student) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    const [progress, charInfo] = await Promise.all([
      getStudentProgressData(student.id),
      getCharacterInfo(student.id),
    ]);

    const unlockCheck = checkSkillUnlock(
      progress,
      (skill.unlockConditions ?? {}) as Record<string, unknown>,
      charInfo,
    );

    // Check if already learned
    const learned = await db.characterSkill.findFirst({
      where: {
        character: { studentId: student.id },
        skillId: skill.id,
      },
      select: { id: true, isEquipped: true, equipSlot: true, masteryLevel: true, masteryXp: true },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...skill,
        unlockCheck,
        learned: learned ?? null,
      },
    });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
