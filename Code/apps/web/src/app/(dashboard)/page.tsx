import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth/auth.config';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const role = session.user.role;

  switch (role) {
    case 'TECH_ADMIN':
    case 'SCHOOL_ADMIN':
      redirect('/a/dashboard');
    case 'TEACHER':
      redirect('/t/dashboard');
    case 'STUDENT':
      redirect('/s/dashboard');
    case 'PARENT':
      redirect('/p/dashboard');
    default:
      redirect('/login');
  }
}
