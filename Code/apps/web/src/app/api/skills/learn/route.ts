import { NextResponse } from 'next/server';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';
import { getStudentProgressData } from '@/lib/gamification/class-unlock';
import { checkSkillUnlock, getCharacterInfo } from '@/lib/gamification/skill-unlock';

export async function POST(req: Request) {
  try {
    const session = await requireAuth();

    if (session.user.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { skillId } = body as { skillId: string };

    if (!skillId) {
      return NextResponse.json({ message: 'skillId is required' }, { status: 400 });
    }

    const student = await db.student.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!student) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    const character = await db.battleCharacter.findUnique({
      where: { studentId: student.id },
      select: { id: true },
    });

    if (!character) {
      return NextResponse.json({ message: 'No battle character. Awaken first.' }, { status: 403 });
    }

    // Check if already learned
    const existing = await db.characterSkill.findFirst({
      where: { characterId: character.id, skillId },
    });

    if (existing) {
      return NextResponse.json({ message: 'Skill already learned' }, { status: 409 });
    }

    // Get skill and check unlock
    const skill = await db.skill.findUnique({
      where: { id: skillId },
      select: { id: true, name: true, unlockConditions: true },
    });

    if (!skill) {
      return NextResponse.json({ message: 'Skill not found' }, { status: 404 });
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

    if (!unlockCheck.unlocked) {
      return NextResponse.json({ message: 'Requirements not met', data: unlockCheck }, { status: 403 });
    }

    // Learn the skill
    const learned = await db.characterSkill.create({
      data: {
        characterId: character.id,
        skillId,
        isEquipped: false,
        masteryLevel: 1,
        masteryXp: 0,
      },
    });

    return NextResponse.json({ success: true, data: learned }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
