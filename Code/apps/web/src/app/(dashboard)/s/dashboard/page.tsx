import type { Metadata } from 'next';

import { requireRole } from '@/lib/auth/helpers';

import { StudentDashboard } from './student-dashboard';

export const metadata: Metadata = { title: 'Dashboard | EduMind AI' };

export default async function StudentDashboardPage() {
  await requireRole('STUDENT');

  return <StudentDashboard />;
}
