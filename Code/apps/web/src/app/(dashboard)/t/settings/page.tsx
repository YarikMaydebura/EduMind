import type { Metadata } from 'next';

import { requireRole } from '@/lib/auth/helpers';

import { SettingsPage } from './settings-page';

export const metadata: Metadata = { title: 'Settings | EduMind AI' };

export default async function TeacherSettingsPage() {
  await requireRole('TEACHER');
  return <SettingsPage />;
}
