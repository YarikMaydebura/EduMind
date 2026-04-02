import { NextResponse } from 'next/server';

import type { BattleAction } from '@edumind/shared';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';
import { submitAction } from '@/lib/battle/battle-service';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();

    if (session.user.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { action: actionType, skillId } = body as { action: string; skillId?: string };

    if (!actionType || !['ATTACK', 'SKILL', 'DEFEND'].includes(actionType)) {
      return NextResponse.json({ message: 'Invalid action type' }, { status: 400 });
    }

    if (actionType === 'SKILL' && !skillId) {
      return NextResponse.json({ message: 'skillId required for SKILL action' }, { status: 400 });
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

    const action: BattleAction = { type: actionType as BattleAction['type'], skillId };
    const result = await submitAction(params.id, character.id, action);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
