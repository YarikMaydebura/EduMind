import { NextResponse } from 'next/server';

import { requireAuth } from '@/lib/auth/helpers';
import { suggestGrade } from '@/lib/ai/suggest-grade';

export async function POST(req: Request) {
  try {
    const session = await requireAuth();

    if (!['TEACHER', 'TECH_ADMIN', 'SCHOOL_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { homeworkId, studentId, instructions, content, maxScore, rubric, subject, topic } = body;

    if (!homeworkId || !studentId || !instructions || !content || !maxScore) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const suggestion = await suggestGrade({
      homeworkId,
      studentId,
      instructions,
      content,
      maxScore,
      rubric,
      subject,
      topic,
    });

    return NextResponse.json({ success: true, data: suggestion });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
