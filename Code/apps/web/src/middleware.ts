import { NextResponse } from 'next/server';

import { auth } from '@/lib/auth/auth.config';

const publicPaths = ['/login', '/register', '/forgot-password', '/join', '/api/auth'];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  const isPublic = publicPaths.some((path) => pathname.startsWith(path));
  if (isPublic) return NextResponse.next();

  if (!req.auth) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = req.auth.user.role;

  if (pathname.startsWith('/t/') && role !== 'TEACHER') {
    return NextResponse.redirect(new URL('/', req.url));
  }
  if (pathname.startsWith('/s/') && role !== 'STUDENT') {
    return NextResponse.redirect(new URL('/', req.url));
  }
  if (pathname.startsWith('/p/') && role !== 'PARENT') {
    return NextResponse.redirect(new URL('/', req.url));
  }
  if (pathname.startsWith('/a/') && !['TECH_ADMIN', 'SCHOOL_ADMIN'].includes(role)) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
