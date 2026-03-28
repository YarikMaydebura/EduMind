import type { Metadata } from 'next';

import { requireRole } from '@/lib/auth/helpers';

import { StudentLeaderboard } from './student-leaderboard';

export const metadata: Metadata = { title: 'Leaderboard | EduMind AI' };

export default async function LeaderboardPage() {
  await requireRole('STUDENT');
  return <StudentLeaderboard />;
}
