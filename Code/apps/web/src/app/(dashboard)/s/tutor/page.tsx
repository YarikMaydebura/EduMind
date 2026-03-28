import type { Metadata } from 'next';

import { requireRole } from '@/lib/auth/helpers';
import { db } from '@/lib/db';

import { StudentTutorPage } from './student-tutor-page';

export const metadata: Metadata = { title: 'AI Tutor | EduMind AI' };

export default async function StudentTutorRoute() {
  const session = await requireRole('STUDENT');

  const student = await db.student.findUnique({
    where: { userId: session.user.id },
    include: {
      classEnrollments: {
        where: { isActive: true },
        include: {
          class: { select: { subject: true, name: true } },
        },
      },
      user: { select: { firstName: true } },
    },
  });

  const subjects =
    student?.classEnrollments.map((e) => ({
      value: e.class.subject as string,
      label: (e.class.subject as string).replace(/_/g, ' '),
      className: e.class.name,
    })) ?? [];

  return (
    <StudentTutorPage
      studentName={student?.user.firstName ?? 'Student'}
      subjects={subjects}
    />
  );
}
