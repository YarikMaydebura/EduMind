import type { Metadata } from 'next';

import { requireRole } from '@/lib/auth/helpers';

import { BattleHistory } from './battle-history';

export const metadata: Metadata = { title: 'Battle History | EduMind AI' };

export default async function BattleHistoryPage() {
  await requireRole('STUDENT');
  return <BattleHistory />;
}
