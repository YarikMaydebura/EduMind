import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { requireRole } from '@/lib/auth/helpers';
import { db } from '@/lib/db';

import { StudentQuizDetail } from './student-quiz-detail';

export const metadata: Metadata = { title: 'Quiz | EduMind AI' };

export default async function StudentQuizPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await requireRole('STUDENT');

  const student = await db.student.findUnique({
    where: { userId: session.user.id },
  });

  if (!student) return notFound();

  const quiz = await db.quiz.findUnique({
    where: { id: params.id },
    include: {
      class: { select: { id: true, tenantId: true } },
    },
  });

  if (!quiz || quiz.class.tenantId !== session.user.tenantId) {
    return notFound();
  }

  const enrollment = await db.classEnrollment.findUnique({
    where: {
      classId_studentId: { classId: quiz.class.id, studentId: student.id },
    },
  });

  if (!enrollment?.isActive) return notFound();

  return <StudentQuizDetail quizId={params.id} />;
}
