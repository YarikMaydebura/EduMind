'use client';

import { useSession } from 'next-auth/react';

import type { UserRole } from '@edumind/shared';

export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
  };
}

export function useRequireRole(...roles: UserRole[]) {
  const { user, isLoading, isAuthenticated } = useAuth();

  return {
    user,
    isLoading,
    isAuthenticated,
    hasRole: user ? roles.includes(user.role) : false,
  };
}
