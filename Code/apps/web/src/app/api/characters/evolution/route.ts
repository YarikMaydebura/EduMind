import { NextResponse } from 'next/server';

import { calculateBattleStats, EVOLUTION_KP_COST } from '@edumind/shared';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';
import { checkClassUnlock, getStudentProgressData } from '@/lib/gamification/class-unlock';
import { getStudentSubjectAverages } from '@/lib/gamification/propose-classes';
import { getEvolutionOptions } from '@/lib/gamification/class-unlock';

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

    if (!student) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    const result = await getEvolutionOptions(student.id);
    return NextResponse.json({ success: true, data: result });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireAuth();

    if (session.user.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { targetClassId } = body as { targetClassId: string };

    if (!targetClassId) {
      return NextResponse.json({ message: 'targetClassId is required' }, { status: 400 });
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
      select: { id: true, classId: true, knowledgePoints: true, theme: true },
    });

    if (!character) {
      return NextResponse.json({ message: 'No battle character found' }, { status: 404 });
    }

    // Verify target class exists and is a valid evolution
    const targetClass = await db.characterClass.findUnique({
      where: { id: targetClassId },
      select: {
        id: true,
        name: true,
        rarity: true,
        theme: true,
        evolvesFromId: true,
        passives: true,
        requirements: true,
      },
    });

    if (!targetClass) {
      return NextResponse.json({ message: 'Target class not found' }, { status: 404 });
    }

    if (targetClass.evolvesFromId !== character.classId) {
      return NextResponse.json({ message: 'Target class is not a valid evolution from your current class' }, { status: 400 });
    }

    if (targetClass.theme !== character.theme) {
      return NextResponse.json({ message: 'Cannot evolve to a different theme' }, { status: 400 });
    }

    // Check unlock requirements
    const progress = await getStudentProgressData(student.id);
    const requirements = (targetClass.requirements ?? {}) as Record<string, unknown>;
    const unlockCheck = checkClassUnlock(progress, requirements);

    if (!unlockCheck.unlocked) {
      return NextResponse.json({ message: 'Requirements not met', data: unlockCheck }, { status: 403 });
    }

    // Check KP cost
    const kpCost = EVOLUTION_KP_COST[targetClass.rarity] ?? 0;
    if (character.knowledgePoints < kpCost) {
      return NextResponse.json({ message: `Not enough Knowledge Points (need ${kpCost}, have ${character.knowledgePoints})` }, { status: 403 });
    }

    // Calculate new stats
    const subjectAverages = await getStudentSubjectAverages(student.id);
    const passives = (targetClass.passives ?? {}) as Record<string, number>;
    const newStats = calculateBattleStats(subjectAverages, passives);

    // Perform evolution in transaction
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await db.$transaction(async (tx: any) => {
      // Update character
      const updated = await tx.battleCharacter.update({
        where: { id: character.id },
        data: {
          classId: targetClassId,
          knowledgePoints: { decrement: kpCost },
          hp: newStats.HP,
          maxHp: newStats.HP,
          mp: newStats.MP,
          maxMp: newStats.MP,
          sta: newStats.STA,
          maxSta: newStats.STA,
          atk: newStats.ATK,
          def: newStats.DEF,
          spd: newStats.SPD,
          lck: newStats.LCK,
        },
      });

      // Log class change
      await tx.classChangeHistory.create({
        data: {
          characterId: character.id,
          fromClassId: character.classId,
          toClassId: targetClassId,
          method: 'EVOLUTION',
        },
      });

      // Activity feed entry
      await tx.activityFeed.create({
        data: {
          studentId: student.id,
          type: 'LEVEL_UP',
          title: `Evolved to ${targetClass.name}!`,
          description: `Class evolution from ${character.classId} (cost: ${kpCost} KP)`,
          icon: '🌟',
          color: 'gold',
          isPublic: true,
        },
      });

      return updated;
    });

    return NextResponse.json({ success: true, data: { character: result, newClass: targetClass.name, kpSpent: kpCost } });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
