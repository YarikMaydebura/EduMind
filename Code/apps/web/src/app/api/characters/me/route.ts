import { NextResponse } from 'next/server';

import { calculateBattleStats, calculateDerivedStats } from '@edumind/shared';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';
import { getStudentSubjectAverages } from '@/lib/gamification/propose-classes';

export async function GET() {
  try {
    const session = await requireAuth();

    if (session.user.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const student = await db.student.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
        overallLevel: true,
        battleCharacter: {
          include: {
            class: {
              select: {
                id: true,
                name: true,
                theme: true,
                rarity: true,
                description: true,
                passives: true,
              },
            },
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    if (!student.battleCharacter) {
      return NextResponse.json({
        success: true,
        data: null,
        awakened: false,
        level: student.overallLevel,
        canAwaken: student.overallLevel >= 5,
      });
    }

    const bc = student.battleCharacter;

    // Compute live stats from current academic performance
    const subjectAverages = await getStudentSubjectAverages(student.id);
    const classPassives = (bc.class.passives ?? {}) as Record<string, number>;
    const liveStats = calculateBattleStats(subjectAverages, classPassives);
    const derivedStats = calculateDerivedStats(liveStats);

    return NextResponse.json({
      success: true,
      data: {
        id: bc.id,
        theme: bc.theme,
        class: bc.class,
        stats: {
          HP: bc.maxHp,
          MP: bc.maxMp,
          STA: bc.maxSta,
          ATK: bc.atk,
          DEF: bc.def,
          SPD: bc.spd,
          LCK: bc.lck,
        },
        liveStats,
        derivedStats,
        battleRecord: {
          wins: bc.battlesWon,
          losses: bc.battlesLost,
          draws: bc.battlesDraw,
          mobsDefeated: bc.mobsDefeated,
          bossesDefeated: bc.bossesDefeated,
        },
        knowledgePoints: bc.knowledgePoints,
      },
      awakened: true,
    });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
