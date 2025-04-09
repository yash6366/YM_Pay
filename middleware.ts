import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Create a new ratelimiter if Redis is configured
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

export async function middleware(request: NextRequest) {
  // Get the IP address of the request
  const ip = request.ip ?? '127.0.0.1'

  // Rate limit all API endpoints if Redis is configured
  if (request.nextUrl.pathname.startsWith('/api') && ratelimit) {
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
      // Continue without rate limiting if there's an error
    }
  }

  // Add CORS headers
  const response = NextResponse.next()
  response.headers.set('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' ? 'https://ym-pay.vercel.app' : '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Max-Age', '86400')

  return response
}

export const config = {
  matcher: '/api/:path*',
} 