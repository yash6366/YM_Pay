import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { AUTH_COOKIE_NAME, clearAuthCookie } from "@/app/utils"

export async function POST() {
  try {
    const cookieStore = await cookies()
    cookieStore.set(AUTH_COOKIE_NAME, "", clearAuthCookie())
    cookieStore.delete(AUTH_COOKIE_NAME)

    return NextResponse.json({ message: "Logged out successfully" }, { status: 200 })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json(
      {
        message: "Failed to logout",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

