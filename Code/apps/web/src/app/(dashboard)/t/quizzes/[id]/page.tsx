import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { requireRole } from '@/lib/auth/helpers';
import { db } from '@/lib/db';

import { QuizDetail } from './quiz-detail';

export const metadata: Metadata = { title: 'Quiz | EduMind AI' };

export default async function TeacherQuizDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await requireRole('TEACHER');

  const teacher = await db.teacher.findUnique({
    where: { userId: session.user.id },
  });

  if (!teacher) return notFound();

  const quiz = await db.quiz.findUnique({
    where: { id: params.id },
    include: {
      class: { select: { teacherId: true, tenantId: true } },
    },
  });

  if (
    !quiz ||
    quiz.class.teacherId !== teacher.id ||
    quiz.class.tenantId !== session.user.tenantId
  ) {
    return notFound();
  }

  return <QuizDetail quizId={params.id} />;
}
