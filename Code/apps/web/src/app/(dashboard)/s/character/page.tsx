import type { Metadata } from 'next';

import { requireRole } from '@/lib/auth/helpers';

import { CharacterProfile } from './character-profile';

export const metadata: Metadata = { title: 'Character | EduMind AI' };

export default async function CharacterPage() {
  await requireRole('STUDENT');
  return <CharacterProfile />;
}
