import type { Metadata } from 'next';

import { requireRole } from '@/lib/auth/helpers';

import { ShopPage } from './shop-page';

export const metadata: Metadata = { title: 'Shop | EduMind AI' };

export default async function Shop() {
  await requireRole('STUDENT');
  return <ShopPage />;
}
