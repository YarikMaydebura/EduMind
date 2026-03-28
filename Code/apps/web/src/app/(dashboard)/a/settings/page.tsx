import type { Metadata } from 'next';

import { requireRole } from '@/lib/auth/helpers';
import { db } from '@/lib/db';

import { SettingsForm } from './settings-form';

export const metadata: Metadata = { title: 'Settings | EduMind AI' };

export default async function SettingsPage() {
  const session = await requireRole('SCHOOL_ADMIN', 'TECH_ADMIN');

  const tenant = await db.tenant.findUnique({
    where: { id: session.user.tenantId },
  });

  const [teacherCount, studentCount] = await Promise.all([
    db.user.count({ where: { tenantId: session.user.tenantId, role: 'TEACHER' } }),
    db.user.count({ where: { tenantId: session.user.tenantId, role: 'STUDENT' } }),
  ]);

  if (!tenant) return null;

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-3xl font-bold">Settings</h1>
      <p className="mb-8 text-muted-foreground">Manage your organization settings</p>

      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Plan</p>
          <p className="text-lg font-semibold">{tenant.plan.replace('_', ' ')}</p>
          {tenant.trialEndsAt && (
            <p className="text-xs text-muted-foreground">
              Trial ends {new Date(tenant.trialEndsAt).toLocaleDateString()}
            </p>
          )}
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Teachers</p>
          <p className="text-lg font-semibold">
            {teacherCount} / {tenant.maxTeachers}
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Students</p>
          <p className="text-lg font-semibold">
            {studentCount} / {tenant.maxStudents}
          </p>
        </div>
      </div>

      <SettingsForm
        defaultValues={{
          name: tenant.name,
          logo: tenant.logo,
        }}
      />
    </div>
  );
}
