import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { requireRole } from '@/lib/auth/helpers';
import { db } from '@/lib/db';

import { StudentHomeworkDetail } from './student-homework-detail';

export const metadata: Metadata = { title: 'Homework | EduMind AI' };

export default async function StudentHomeworkPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await requireRole('STUDENT');

  const student = await db.student.findUnique({
    where: { userId: session.user.id },
  });

  if (!student) return notFound();

  const homework = await db.homework.findUnique({
    where: { id: params.id },
    include: {
      class: { select: { id: true, tenantId: true } },
    },
  });

  if (!homework || homework.class.tenantId !== session.user.tenantId) {
    return notFound();
  }

  const enrollment = await db.classEnrollment.findUnique({
    where: {
      classId_studentId: { classId: homework.class.id, studentId: student.id },
    },
  });

  if (!enrollment?.isActive) return notFound();

  return <StudentHomeworkDetail homeworkId={params.id} />;
}
