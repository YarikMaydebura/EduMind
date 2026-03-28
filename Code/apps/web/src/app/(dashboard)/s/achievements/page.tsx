import type { Metadata } from 'next';

import { requireRole } from '@/lib/auth/helpers';

import { StudentAchievements } from './student-achievements';

export const metadata: Metadata = { title: 'Achievements | EduMind AI' };

export default async function AchievementsPage() {
  await requireRole('STUDENT');
  return <StudentAchievements />;
}
