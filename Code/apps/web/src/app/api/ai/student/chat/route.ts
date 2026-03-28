import { NextResponse } from 'next/server';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';
import { studentTutor } from '@/lib/ai/student-tutor';
import type { ChatMessage } from '@/lib/ai/student-tutor';

export async function POST(req: Request) {
  try {
    const session = await requireAuth();

    if (session.user.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json() as {
      messages: ChatMessage[];
      subject: string;
    };

    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json({ message: 'messages array is required' }, { status: 400 });
    }

    if (!body.subject) {
      return NextResponse.json({ message: 'subject is required' }, { status: 400 });
    }

    // Fetch student level for personalisation
    const student = await db.student.findUnique({
      where: { userId: session.user.id },
      select: { overallLevel: true, user: { select: { firstName: true } } },
    });

    const result = await studentTutor({
      messages: body.messages,
      subject: body.subject,
      studentName: student?.user.firstName ?? 'Student',
      studentLevel: student?.overallLevel ?? 1,
    });

    if (!result) {
      return NextResponse.json({ message: 'AI tutor is unavailable. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: result });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
