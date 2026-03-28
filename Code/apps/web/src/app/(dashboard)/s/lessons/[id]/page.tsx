import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { requireRole } from '@/lib/auth/helpers';
import { db } from '@/lib/db';

import { StudentLessonDetail } from './student-lesson-detail';

export const metadata: Metadata = { title: 'Lesson | EduMind AI' };

export default async function StudentLessonPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await requireRole('STUDENT');

  const student = await db.student.findUnique({
    where: { userId: session.user.id },
  });

  if (!student) return notFound();

  const lesson = await db.lesson.findUnique({
    where: { id: params.id },
    include: {
      class: { select: { id: true, tenantId: true } },
    },
  });

  if (!lesson || lesson.class.tenantId !== session.user.tenantId) {
    return notFound();
  }

  const enrollment = await db.classEnrollment.findUnique({
    where: {
      classId_studentId: { classId: lesson.class.id, studentId: student.id },
    },
  });

  if (!enrollment?.isActive) return notFound();

  return <StudentLessonDetail lessonId={params.id} />;
}
