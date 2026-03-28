import type { Metadata } from 'next';

import { requireRole } from '@/lib/auth/helpers';

import { TeacherDashboard } from './teacher-dashboard';

export const metadata: Metadata = { title: 'Dashboard | EduMind AI' };

export default async function TeacherDashboardPage() {
  await requireRole('TEACHER');
  return <TeacherDashboard />;
}
