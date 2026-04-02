import { NextResponse } from 'next/server';

import { awakenCharacterSchema, calculateBattleStats } from '@edumind/shared';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';
import { getStudentSubjectAverages } from '@/lib/gamification/propose-classes';

export async function POST(req: Request) {
  try {
    const session = await requireAuth();

    if (session.user.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = awakenCharacterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: 'Invalid input', errors: parsed.error.flatten() }, { status: 400 });
    }

    const { theme, classId } = parsed.data;

    const student = await db.student.findUnique({
      where: { userId: session.user.id },
      select: { id: true, overallLevel: true, battleCharacter: { select: { id: true } } },
    });

    if (!student) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    if (student.overallLevel < 5) {
      return NextResponse.json({ message: 'You must reach Level 5 to awaken' }, { status: 403 });
    }

    if (student.battleCharacter) {
      return NextResponse.json({ message: 'Character already awakened' }, { status: 409 });
    }

    // Verify the selected class exists, matches theme, and is Common rarity
    const charClass = await db.characterClass.findUnique({
      where: { id: classId },
      select: { id: true, name: true, theme: true, rarity: true },
    });

    if (!charClass) {
      return NextResponse.json({ message: 'Class not found' }, { status: 404 });
    }

    if (charClass.theme !== theme) {
      return NextResponse.json({ message: 'Class does not match selected theme' }, { status: 400 });
    }

    if (charClass.rarity !== 'CLASS_COMMON') {
      return NextResponse.json({ message: 'Only Common classes are available at awakening' }, { status: 400 });
    }

    // Calculate stats
    const subjectAverages = await getStudentSubjectAverages(student.id);
    const stats = calculateBattleStats(subjectAverages);

    // Create character in transaction
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const character = await db.$transaction(async (tx: any) => {
      const bc = await tx.battleCharacter.create({
        data: {
          studentId: student.id,
          classId,
          theme,
          hp: stats.HP,
          maxHp: stats.HP,
          mp: stats.MP,
          maxMp: stats.MP,
          sta: stats.STA,
          maxSta: stats.STA,
          atk: stats.ATK,
          def: stats.DEF,
          spd: stats.SPD,
          lck: stats.LCK,
        },
      });

      // Create activity feed entry
      await tx.activityFeed.create({
        data: {
          studentId: student.id,
          type: 'LEVEL_UP',
          title: 'Character Awakened!',
          description: `Awakened as ${charClass.name} (${theme})`,
          icon: '⚔️',
          color: 'purple',
          isPublic: true,
        },
      });

      // Mark awakening notifications as read
      await tx.notification.updateMany({
        where: {
          userId: session.user.id,
          type: 'BATTLE_AWAKENING',
          read: false,
        },
        data: { read: true, readAt: new Date() },
      });

      return bc;
    });

    return NextResponse.json({ success: true, data: character }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
