import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add paths that should be protected
const protectedPaths = ['/admin', '/partners', '/stock'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtectedPath) {
    // Get the token from the cookies
    const token = request.cookies.get('auth-token')?.value;

    // If there's no token, redirect to the login page
    if (!token) {
      const url = new URL('/login', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
  }

  // If the path is /catalog, redirect to the homepage
  if (pathname === '/catalog') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/catalog',
    '/admin/:path*',
    '/partners/:path*',
    '/stock/:path*'
  ]
}; 