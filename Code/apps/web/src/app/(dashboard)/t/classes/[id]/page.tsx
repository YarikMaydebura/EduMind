import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { requireRole } from '@/lib/auth/helpers';
import { db } from '@/lib/db';

import { ClassDetail } from './class-detail';

export const metadata: Metadata = { title: 'Class Detail | EduMind AI' };

export default async function TeacherClassDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await requireRole('TEACHER');

  const teacher = await db.teacher.findUnique({
    where: { userId: session.user.id },
  });

  if (!teacher) return notFound();

  const classData = await db.class.findFirst({
    where: {
      id: params.id,
      teacherId: teacher.id,
      tenantId: session.user.tenantId,
    },
  });

  if (!classData) return notFound();

  return <ClassDetail classId={params.id} />;
}
