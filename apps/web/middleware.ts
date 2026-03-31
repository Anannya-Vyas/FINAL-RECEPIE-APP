import { NextRequest, NextResponse } from 'next/server';

// Routes that don't require authentication
const PUBLIC_PATHS = [
  '/',           // splash screen
  '/login',
  '/register',
  '/auth/callback',
  '/onboarding',
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}

function getTokenFromRequest(req: NextRequest): string | null {
  // Check cookie first
  const cookieToken = req.cookies.get('cc_access_token')?.value;
  if (cookieToken) return cookieToken;
  // Check Authorization header
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) return authHeader.slice(7);
  return null;
}

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const token = getTokenFromRequest(req);

  if (!token || isTokenExpired(token)) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};
