import { cookies } from "next/headers"
import { AppError, AUTH_COOKIE_NAME, getAuthCookieOptions, getJwtSecret, verifyToken } from "@/app/utils"

export async function verifyAuthToken(token: string) {
  return verifyToken(token)
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value

  if (!token) {
    throw new AppError("Unauthorized", 401)
  }

  try {
    return verifyAuthToken(token)
  } catch {
    throw new AppError("Unauthorized", 401)
  }
}

export function generateAuthToken(userId: string) {
  return require("jsonwebtoken").sign({ userId }, getJwtSecret(), { expiresIn: "7d" })
}

export function getAuthCookieName() {
  return AUTH_COOKIE_NAME
}

export function getCookieOptions() {
  return getAuthCookieOptions()
} 