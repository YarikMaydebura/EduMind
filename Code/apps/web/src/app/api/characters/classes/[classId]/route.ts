import { NextResponse } from 'next/server';

import { calculateStatsWithClass } from '@edumind/shared';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';
import { checkClassUnlock, getStudentProgressData } from '@/lib/gamification/class-unlock';
import { getStudentSubjectAverages } from '@/lib/gamification/propose-classes';

export async function GET(_req: Request, { params }: { params: { classId: string } }) {
  try {
    const session = await requireAuth();

    if (session.user.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const charClass = await db.characterClass.findUnique({
      where: { id: params.classId },
      select: {
        id: true,
        name: true,
        theme: true,
        rarity: true,
        description: true,
        passives: true,
        abilities: true,
        requirements: true,
        iconUrl: true,
        evolvesFrom: {
          select: { id: true, name: true, rarity: true, theme: true },
        },
        evolvesTo: {
          select: { id: true, name: true, rarity: true, description: true, passives: true },
        },
      },
    });

    if (!charClass) {
      return NextResponse.json({ message: 'Class not found' }, { status: 404 });
    }

    const student = await db.student.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!student) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    const [progress, subjectAverages] = await Promise.all([
      getStudentProgressData(student.id),
      getStudentSubjectAverages(student.id),
    ]);

    const requirements = (charClass.requirements ?? {}) as Record<string, unknown>;
    const unlockCheck = checkClassUnlock(progress, requirements);

    const passives = (charClass.passives ?? {}) as Record<string, number>;
    const statPreview = calculateStatsWithClass(subjectAverages, passives);

    return NextResponse.json({
      success: true,
      data: {
        ...charClass,
        unlockCheck,
        statPreview,
      },
    });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
