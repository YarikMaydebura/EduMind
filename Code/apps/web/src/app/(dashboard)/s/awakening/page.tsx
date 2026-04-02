import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { requireRole } from '@/lib/auth/helpers';
import { db } from '@/lib/db';

import { AwakeningFlow } from './awakening-flow';

export const metadata: Metadata = { title: 'Character Awakening | EduMind AI' };

export default async function AwakeningPage() {
  const session = await requireRole('STUDENT');

  const student = await db.student.findUnique({
    where: { userId: session.user.id },
    select: {
      id: true,
      overallLevel: true,
      battleCharacter: { select: { id: true } },
      user: { select: { firstName: true } },
    },
  });

  if (!student || student.overallLevel < 5) {
    redirect('/s/dashboard');
  }

  if (student.battleCharacter) {
    redirect('/s/character');
  }

  return <AwakeningFlow studentName={student.user.firstName} />;
}
