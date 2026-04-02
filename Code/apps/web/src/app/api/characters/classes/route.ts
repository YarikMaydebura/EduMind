import { NextResponse } from 'next/server';

import { RARITY_ORDER } from '@edumind/shared';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';
import { checkClassUnlock, getStudentProgressData } from '@/lib/gamification/class-unlock';

export async function GET(req: Request) {
  try {
    const session = await requireAuth();

    if (session.user.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const theme = searchParams.get('theme');
    const rarity = searchParams.get('rarity');

    if (!theme) {
      return NextResponse.json({ message: 'theme query param is required' }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { theme: theme as 'FANTASY' };
    if (rarity) {
      where.rarity = rarity;
    }

    const classes = await db.characterClass.findMany({
      where,
      select: {
        id: true,
        name: true,
        rarity: true,
        description: true,
        passives: true,
        abilities: true,
        iconUrl: true,
        evolvesFromId: true,
      },
      orderBy: [{ rarity: 'asc' }, { name: 'asc' }],
    });

    // Get student progress for unlock checking
    const student = await db.student.findUnique({
      where: { userId: session.user.id },
      select: { id: true, battleCharacter: { select: { classId: true } } },
    });

    let progress = null;
    if (student) {
      progress = await getStudentProgressData(student.id);
    }

    const classesWithStatus = classes.map((c) => {
      const requirements = {} as Record<string, unknown>; // requirements not in this select, fetch separately if needed
      const isEquipped = student?.battleCharacter?.classId === c.id;

      return {
        ...c,
        isEquipped,
        // Group by rarity order
        rarityOrder: RARITY_ORDER.indexOf(c.rarity),
      };
    });

    // Group by rarity
    const grouped: Record<string, typeof classesWithStatus> = {};
    for (const c of classesWithStatus) {
      if (!grouped[c.rarity]) grouped[c.rarity] = [];
      grouped[c.rarity]!.push(c);
    }

    return NextResponse.json({
      success: true,
      data: {
        classes: classesWithStatus,
        grouped,
        total: classes.length,
      },
    });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
