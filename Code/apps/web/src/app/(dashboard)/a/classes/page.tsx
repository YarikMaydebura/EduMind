import type { Metadata } from 'next';

import { requireRole } from '@/lib/auth/helpers';

import { AdminClassList } from './admin-class-list';

export const metadata: Metadata = { title: 'Classes | EduMind AI' };

export default async function AdminClassesPage() {
  await requireRole('SCHOOL_ADMIN', 'TECH_ADMIN');

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Classes</h1>
        <p className="text-muted-foreground">All classes in your organization</p>
      </div>
      <AdminClassList />
    </div>
  );
}
