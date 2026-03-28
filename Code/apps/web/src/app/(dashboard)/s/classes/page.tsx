import type { Metadata } from 'next';

import { requireRole } from '@/lib/auth/helpers';

import { StudentClassList } from './student-class-list';

export const metadata: Metadata = { title: 'My Classes | EduMind AI' };

export default async function StudentClassesPage() {
  await requireRole('STUDENT');

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Classes</h1>
        <p className="text-muted-foreground">Your enrolled classes</p>
      </div>
      <StudentClassList />
    </div>
  );
}
