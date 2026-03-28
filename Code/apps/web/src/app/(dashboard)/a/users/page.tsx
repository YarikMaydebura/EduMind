import type { Metadata } from 'next';

import { requireRole } from '@/lib/auth/helpers';

import { UserTable } from './user-table';

export const metadata: Metadata = { title: 'Users | EduMind AI' };

export default async function UsersPage() {
  await requireRole('SCHOOL_ADMIN', 'TECH_ADMIN');

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage users in your organization</p>
        </div>
      </div>

      <UserTable />
    </div>
  );
}
