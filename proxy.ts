import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { getCurrentUser } from './app/utils/auth'

let ratelimit: Ratelimit | null = null
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, '10 s'),
    })
  } catch (error) {
    console.warn('Redis configuration error. Rate limiting is disabled:', error)
  }
}

export async function proxy(request: NextRequest) {
  const isApiRoute = request.nextUrl.pathname.startsWith('/api')
  const isPublicApiRoute =
    request.nextUrl.pathname.startsWith('/api/auth/login') ||
    request.nextUrl.pathname.startsWith('/api/auth/signup')

  if (isApiRoute && !isPublicApiRoute) {
    try {
      await getCurrentUser()
    } catch (error) {
      return new NextResponse(
        JSON.stringify({ message: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }
  }

  if (isApiRoute && ratelimit) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'

    try {
      const { success, limit, reset, remaining } = await ratelimit.limit(ip)

      if (!success) {
        return new NextResponse(
          JSON.stringify({
            message: 'Too many requests',
            limit,
            reset,
            remaining,
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': reset.toString(),
            },
          }
        )
      }
    } catch (error) {
      console.error('Rate limiting error:', error)
    }
  }

  const response = NextResponse.next()
  response.headers.set(
    'Access-Control-Allow-Origin',
    process.env.NODE_ENV === 'production' ? 'https://ym-pay.vercel.app' : '*'
  )
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Max-Age', '86400')

  return response
}

export const config = {
  matcher: '/api/:path*',
}
