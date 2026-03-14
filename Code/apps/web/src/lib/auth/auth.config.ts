import bcrypt from 'bcryptjs';
import NextAuth, { type NextAuthResult } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import MicrosoftEntraID from 'next-auth/providers/microsoft-entra-id';

import { loginSchema, type UserRole } from '@edumind/shared';

import { db } from '../db';

const nextAuth: NextAuthResult = NextAuth({
  pages: {
    signIn: '/login',
    newUser: '/register',
  },
  session: { strategy: 'jwt' },
  providers: [
    MicrosoftEntraID({
      clientId: process.env.MICROSOFT_CLIENT_ID!,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
      issuer: `https://login.microsoftonline.com/common/v2.0`,
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await db.user.findUnique({
          where: { email: parsed.data.email },
        });

        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
          tenantId: user.tenantId,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.tenantId = user.tenantId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as UserRole;
        session.user.tenantId = token.tenantId as string;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === 'microsoft-entra-id') {
        const existingUser = await db.user.findUnique({
          where: { email: user.email! },
        });

        if (existingUser) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (user as any).role = existingUser.role;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (user as any).tenantId = existingUser.tenantId;
          return true;
        }

        return '/register';
      }
      return true;
    },
  },
});

export const { handlers, signIn, signOut, auth } = nextAuth;
