import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const { pathname } = request.nextUrl

  // Check if user has a token (simple check for JWT in cookies)
  const token = request.cookies.get('auth-token')?.value

  // If user is not authenticated and trying to access dashboard or protected routes
  if (!token && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // If user is authenticated and trying to access auth page, redirect to dashboard
  if (token && pathname === '/auth') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If user is not authenticated and accessing root, redirect to auth
  if (!token && pathname === '/') {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/auth', '/dashboard/:path*']
}