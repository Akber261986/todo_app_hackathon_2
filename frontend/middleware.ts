import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the token from cookies or localStorage (we'll check both)
  const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');

  // Define protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/dashboard/chat'];

  // Define public routes that don't require authentication
  const publicRoutes = ['/signin', '/signup'];

  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  const isPublicRoute = publicRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  // If user is on a protected route but not authenticated
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // If user is on a public route but is authenticated and trying to access signin/signup
  if (isPublicRoute && token && request.nextUrl.pathname !== request.nextUrl.pathname) {
    // For the home page specifically, if authenticated, redirect to dashboard
    if (request.nextUrl.pathname === '/' && token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // If user is authenticated and on the home page, redirect to dashboard
  if (request.nextUrl.pathname === '/' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user is authenticated and tries to access signin/signup, redirect to dashboard
  if ((request.nextUrl.pathname === '/signin' || request.nextUrl.pathname === '/signup') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};