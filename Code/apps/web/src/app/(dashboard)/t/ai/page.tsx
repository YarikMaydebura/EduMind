import type { Metadata } from 'next';

import { requireRole } from '@/lib/auth/helpers';
import { db } from '@/lib/db';

import { TeacherAiPage } from './teacher-ai-page';

export const metadata: Metadata = { title: 'AI Assistant | EduMind AI' };

export default async function TeacherAiRoute() {
  const session = await requireRole('TEACHER', 'SCHOOL_ADMIN', 'TECH_ADMIN');

  const teacher = await db.teacher.findUnique({
    where: { userId: session.user.id },
    include: {
      classes: {
        where: { isArchived: false },
        select: {
          id: true,
          name: true,
          subject: true,
          gradeYear: true,
          _count: { select: { enrollments: true } },
        },
        orderBy: { name: 'asc' },
      },
    },
  });

  const classes = (teacher?.classes ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    subject: c.subject as string,
    gradeYear: c.gradeYear as string,
    studentCount: c._count.enrollments,
  }));

  return <TeacherAiPage classes={classes} />;
}
