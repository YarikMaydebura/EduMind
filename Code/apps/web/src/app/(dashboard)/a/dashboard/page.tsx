import type { Metadata } from 'next';

import { requireRole } from '@/lib/auth/helpers';

import { AdminDashboard } from './admin-dashboard';

export const metadata: Metadata = { title: 'Dashboard | EduMind AI' };

export default async function AdminDashboardPage() {
  await requireRole('SCHOOL_ADMIN', 'TECH_ADMIN');
  return <AdminDashboard />;
}
