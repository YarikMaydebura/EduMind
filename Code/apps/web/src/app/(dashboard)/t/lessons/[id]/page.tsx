import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { requireRole } from '@/lib/auth/helpers';
import { db } from '@/lib/db';

import { LessonDetail } from './lesson-detail';

export const metadata: Metadata = { title: 'Lesson | EduMind AI' };

export default async function TeacherLessonDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await requireRole('TEACHER');

  const teacher = await db.teacher.findUnique({
    where: { userId: session.user.id },
  });

  if (!teacher) return notFound();

  const lesson = await db.lesson.findUnique({
    where: { id: params.id },
    include: {
      class: { select: { teacherId: true, tenantId: true } },
    },
  });

  if (
    !lesson ||
    lesson.class.teacherId !== teacher.id ||
    lesson.class.tenantId !== session.user.tenantId
  ) {
    return notFound();
  }

  return <LessonDetail lessonId={params.id} />;
}
