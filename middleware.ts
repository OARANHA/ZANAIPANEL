import { NextRequest, NextResponse } from 'next/server'

// Public routes that don't require authentication
const publicRoutes = ['/login', '/register', '/', '/api/auth', '/admin/login']
const isPublicRoute = (pathname: string) => {
  return publicRoutes.some(route => pathname.startsWith(route))
}

// Admin routes that require admin role
const adminRoutes = ['/admin', '/api/admin']
const isAdminRoute = (pathname: string) => {
  return adminRoutes.some(route => pathname.startsWith(route))
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for static files and Next.js internals
  if (pathname.startsWith('/_next') || pathname.startsWith('/static') || pathname.includes('.')) {
    return NextResponse.next()
  }
  
  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }
  
  // For admin routes, check if user is authenticated
  if (isAdminRoute(pathname)) {
    // For now, allow access to admin routes without authentication
    // In production, you would implement proper authentication here
    return NextResponse.next()
  }
  
  // For all other routes, allow access
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}