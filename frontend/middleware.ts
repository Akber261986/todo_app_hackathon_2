import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Simple middleware to handle authentication redirects
  const token = request.cookies.get('token')?.value;
  
  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }
  
  // Redirect authenticated users from auth pages
  if ((request.nextUrl.pathname === '/signin' || request.nextUrl.pathname === '/signup') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Redirect unauthenticated users from home to signin
  if (request.nextUrl.pathname === '/' && !token) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }
  
  // Redirect authenticated users from home to dashboard
  if (request.nextUrl.pathname === '/' && token) {
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};