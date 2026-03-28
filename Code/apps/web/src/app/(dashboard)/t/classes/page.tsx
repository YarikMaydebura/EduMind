import type { Metadata } from 'next';

import { requireRole } from '@/lib/auth/helpers';

import { ClassList } from './class-list';

export const metadata: Metadata = { title: 'My Classes | EduMind AI' };

export default async function TeacherClassesPage() {
  await requireRole('TEACHER');

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Classes</h1>
        <p className="text-muted-foreground">Manage your classes and students</p>
      </div>
      <ClassList />
    </div>
  );
}
