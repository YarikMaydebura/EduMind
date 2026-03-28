import type { Metadata } from 'next';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';

import { ProfileForm } from './profile-form';

export const metadata: Metadata = { title: 'Profile | EduMind AI' };

export default async function ProfilePage() {
  const session = await requireAuth();

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      tenant: { select: { name: true, plan: true } },
      teacherProfile: true,
      studentProfile: true,
    },
  });

  if (!user) return null;

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-3xl font-bold">Profile</h1>
      <p className="mb-8 text-muted-foreground">
        {user.role.replace('_', ' ')} at {user.tenant.name}
      </p>

      <ProfileForm
        defaultValues={{
          firstName: user.firstName,
          lastName: user.lastName,
          language: user.language,
        }}
      />
    </div>
  );
}
