import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_ACCESS_TOKEN_COOKIE } from '@/lib/auth';

const PUBLIC_PATHS = ['/login', '/api/auth/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/api/')) {
    // API routes perform their own auth/role checks and should not redirect to HTML pages.
    return NextResponse.next();
  }

  const isPublicPath = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  const hasSession = Boolean(request.cookies.get(ADMIN_ACCESS_TOKEN_COOKIE)?.value);

  if (!isPublicPath && !hasSession) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === '/login' && hasSession) {
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
