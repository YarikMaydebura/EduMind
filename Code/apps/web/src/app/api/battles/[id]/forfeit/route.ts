import { NextResponse } from 'next/server';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';
import { forfeitBattle } from '@/lib/battle/battle-service';

export async function POST(_req: Request, { params }: { params: { id: string } }) {
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
      ? await db.battleCharacter.findUnique({ where: { studentId: student.id }, select: { id: true } })
      : null;

    if (!character) {
      return NextResponse.json({ message: 'No battle character' }, { status: 404 });
    }

    const result = await forfeitBattle(params.id, character.id);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
