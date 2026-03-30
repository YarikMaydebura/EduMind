import { NextResponse } from 'next/server';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';
import { loadConversationHistory, clearConversationHistory } from '@/lib/ai/conversation-history';

export async function GET(req: Request) {
  try {
    const session = await requireAuth();
    if (session.user.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const subject = searchParams.get('subject');
    if (!subject) {
      return NextResponse.json({ message: 'subject query param is required' }, { status: 400 });
    }

    const student = await db.student.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!student) {
      return NextResponse.json({ success: true, data: { messages: [] } });
    }

    const messages = await loadConversationHistory(student.id, subject);
    return NextResponse.json({ success: true, data: { messages } });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await requireAuth();
    if (session.user.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const subject = searchParams.get('subject');
    if (!subject) {
      return NextResponse.json({ message: 'subject query param is required' }, { status: 400 });
    }

    const student = await db.student.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (student) {
      await clearConversationHistory(student.id, subject);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
