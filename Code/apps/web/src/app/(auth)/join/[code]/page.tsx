import type { Metadata } from 'next';

import { JoinForm } from './join-form';

export const metadata: Metadata = { title: 'Join | EduMind AI' };

export default function JoinPage({ params }: { params: { code: string } }) {
  return <JoinForm code={params.code} />;
}
