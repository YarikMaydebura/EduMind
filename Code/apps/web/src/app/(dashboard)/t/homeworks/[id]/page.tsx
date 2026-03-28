import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { requireRole } from '@/lib/auth/helpers';
import { db } from '@/lib/db';

import { HomeworkDetail } from './homework-detail';

export const metadata: Metadata = { title: 'Homework | EduMind AI' };

export default async function TeacherHomeworkDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await requireRole('TEACHER');

  const teacher = await db.teacher.findUnique({
    where: { userId: session.user.id },
  });

  if (!teacher) return notFound();

  const homework = await db.homework.findUnique({
    where: { id: params.id },
    include: {
      class: { select: { teacherId: true, tenantId: true } },
    },
  });

  if (
    !homework ||
    homework.class.teacherId !== teacher.id ||
    homework.class.tenantId !== session.user.tenantId
  ) {
    return notFound();
  }

  return <HomeworkDetail homeworkId={params.id} />;
}
