import type { Metadata } from 'next';

import { requireRole } from '@/lib/auth/helpers';

import { BattleHub } from './battle-hub';

export const metadata: Metadata = { title: 'Battle Arena | EduMind AI' };

export default async function BattlesPage() {
  await requireRole('STUDENT');
  return <BattleHub />;
}
