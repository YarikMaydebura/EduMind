import type { Metadata } from 'next';

import { requireRole } from '@/lib/auth/helpers';

import { BattleScreen } from './battle-screen';

export const metadata: Metadata = { title: 'Battle | EduMind AI' };

export default async function BattlePage({ params }: { params: { id: string } }) {
  await requireRole('STUDENT');
  return <BattleScreen battleId={params.id} />;
}
