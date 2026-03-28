import { NextResponse } from 'next/server';

import { requireAuth } from '@/lib/auth/helpers';
import { generateQuiz } from '@/lib/ai/generate-quiz';
import type { Difficulty, QuestionType } from '@/lib/ai/generate-quiz';

export async function POST(req: Request) {
  try {
    const session = await requireAuth();

    const isTeacherOrAdmin = ['TEACHER', 'TECH_ADMIN', 'SCHOOL_ADMIN'].includes(session.user.role);
    if (!isTeacherOrAdmin) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json() as {
      subject: string;
      gradeYear: string;
      topic: string;
      numQuestions?: number;
      difficulty?: Difficulty;
      questionTypes?: QuestionType[];
    };

    if (!body.subject || !body.gradeYear || !body.topic) {
      return NextResponse.json({ message: 'Missing required fields: subject, gradeYear, topic' }, { status: 400 });
    }

    const questions = await generateQuiz({
      subject: body.subject,
      gradeYear: body.gradeYear,
      topic: body.topic,
      numQuestions: body.numQuestions ?? 10,
      difficulty: body.difficulty ?? 'MEDIUM',
      questionTypes: body.questionTypes ?? ['MULTIPLE_CHOICE'],
    });

    if (!questions) {
      return NextResponse.json({ message: 'AI generation failed. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: questions });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
