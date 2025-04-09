import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getCurrentUser } from './utils/auth'

export async function middleware(request: NextRequest) {
  // Skip middleware for public routes
  if (
    request.nextUrl.pathname.startsWith('/api/auth/login') ||
    request.nextUrl.pathname.startsWith('/api/auth/signup')
  ) {
    return NextResponse.next()
  }

  // Protect all other API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    try {
      await getCurrentUser()
      return NextResponse.next()
    } catch (error) {
      return new NextResponse(
        JSON.stringify({ message: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
} 