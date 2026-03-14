import type { UserRole } from '@edumind/shared';
import 'next-auth';

declare module 'next-auth' {
  interface User {
    role: UserRole;
    tenantId: string;
  }

  interface Session {
    user: User & {
      id: string;
      role: UserRole;
      tenantId: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole;
    tenantId: string;
  }
}
