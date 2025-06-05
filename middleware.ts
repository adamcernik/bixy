import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add paths that should be protected
const protectedPaths = ['/admin', '/partners', '/stock', '/export'];

// Get the base path based on environment
const basePath = process.env.NODE_ENV === 'production' ? '/bixy' : '';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some(path => 
    pathname.startsWith(`${basePath}${path}`) || pathname.startsWith(path)
  );

  if (isProtectedPath) {
    // Get the token from the cookies
    const token = request.cookies.get('auth-token')?.value;

    // If there's no token, redirect to the login page
    if (!token) {
      const url = new URL(`${basePath}/login`, request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
  }

  // If the path is /catalog, redirect to the homepage
  if (pathname === '/catalog' || pathname === `${basePath}/catalog`) {
    return NextResponse.redirect(new URL(basePath || '/', request.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/catalog',
    '/admin/:path*',
    '/partners/:path*',
    '/stock/:path*',
    '/export/:path*',
    '/bixy/catalog',
    '/bixy/admin/:path*',
    '/bixy/partners/:path*',
    '/bixy/stock/:path*',
    '/bixy/export/:path*'
  ]
}; 