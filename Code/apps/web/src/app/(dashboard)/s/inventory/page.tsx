import type { Metadata } from 'next';

import { requireRole } from '@/lib/auth/helpers';

import { InventoryPage } from './inventory-page';

export const metadata: Metadata = { title: 'Inventory | EduMind AI' };

export default async function Inventory() {
  await requireRole('STUDENT');
  return <InventoryPage />;
}
