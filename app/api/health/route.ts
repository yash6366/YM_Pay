import { NextResponse } from "next/server"
import { getPool } from "@/app/config/database"

export const dynamic = "force-dynamic"

export async function GET() {
  const startTime = Date.now()
  const pool = getPool()

  try {
    const result = await pool.query("SELECT 1 as healthy")
    const latencyMs = Date.now() - startTime

    const isConnected = result.rows[0]?.healthy === 1

    if (!isConnected) {
      return NextResponse.json(
        {
          status: "unhealthy",
          timestamp: new Date().toISOString(),
          database: {
            status: "disconnected",
            latencyMs,
          },
        },
        { status: 503 }
      )
    }

    return NextResponse.json(
      {
        status: "healthy",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV ?? "development",
        database: {
          status: "connected",
          latencyMs,
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    )
  } catch (error) {
    const latencyMs = Date.now() - startTime
    console.error("Health check database probe failed:", error)

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        database: {
          status: "unavailable",
          latencyMs,
        },
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    )
  }
}
