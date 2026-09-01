import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { AUTH_COOKIE_NAME, verifyToken } from "@/app/utils"

let ratelimit: Ratelimit | null = null
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(20, "10 s"),
    })
  } catch (error) {
    console.warn("Redis configuration error. Rate limiting disabled:", error)
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isApiRoute = pathname.startsWith("/api")

  // Request correlation: preserve incoming valid UUID or generate fresh correlation ID
  const incomingRequestId = request.headers.get("x-request-id")
  const requestId = incomingRequestId && /^[a-zA-Z0-9_-]{8,64}$/.test(incomingRequestId)
    ? incomingRequestId
    : crypto.randomUUID()

  // Handle CORS Preflight requests
  if (request.method === "OPTIONS" && isApiRoute) {
    const preflightResponse = new NextResponse(null, { status: 204 })
    attachCorsHeaders(preflightResponse)
    preflightResponse.headers.set("X-Request-ID", requestId)
    return preflightResponse
  }

  if (isApiRoute) {
    // 1. Rate Limiting Check (if configured)
    if (ratelimit) {
      const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "127.0.0.1"
      try {
        const { success, limit, reset, remaining } = await ratelimit.limit(ip)
        if (!success) {
          const rateLimitResponse = new NextResponse(
            JSON.stringify({
              message: "Too many requests. Please try again shortly.",
              limit,
              reset,
              remaining,
            }),
            {
              status: 429,
              headers: {
                "Content-Type": "application/json",
                "X-RateLimit-Limit": limit.toString(),
                "X-RateLimit-Remaining": remaining.toString(),
                "X-RateLimit-Reset": reset.toString(),
                "X-Request-ID": requestId,
              },
            }
          )
          attachCorsHeaders(rateLimitResponse)
          return rateLimitResponse
        }
      } catch (rateLimitErr) {
        console.error("Rate limiting evaluation error:", rateLimitErr)
      }
    }

    // 2. Authentication Check for Protected API Routes
    const isPublicAuthRoute =
      pathname.startsWith("/api/auth/login") ||
      pathname.startsWith("/api/auth/signup") ||
      pathname.startsWith("/api/auth/logout") ||
      pathname.startsWith("/api/health")

    if (!isPublicAuthRoute) {
      const token = request.cookies.get(AUTH_COOKIE_NAME)?.value

      if (!token) {
        const unauthResponse = new NextResponse(
          JSON.stringify({ message: "Unauthorized. Please log in." }),
          {
            status: 401,
            headers: {
              "Content-Type": "application/json",
              "X-Request-ID": requestId,
            },
          }
        )
        attachCorsHeaders(unauthResponse)
        return unauthResponse
      }

      try {
        verifyToken(token)
      } catch {
        const invalidTokenResponse = new NextResponse(
          JSON.stringify({ message: "Invalid or expired session. Please log in again." }),
          {
            status: 401,
            headers: {
              "Content-Type": "application/json",
              "X-Request-ID": requestId,
            },
          }
        )
        attachCorsHeaders(invalidTokenResponse)
        return invalidTokenResponse
      }
    }
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("X-Request-ID", requestId)

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  response.headers.set("X-Request-ID", requestId)
  if (isApiRoute) {
    attachCorsHeaders(response)
  }
  return response
}

function attachCorsHeaders(response: NextResponse) {
  response.headers.set(
    "Access-Control-Allow-Origin",
    process.env.NODE_ENV === "production" ? "https://ym-pay.vercel.app" : "*"
  )
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  response.headers.set("Access-Control-Max-Age", "86400")
}

export const config = {
  matcher: "/api/:path*",
}