import { NextResponse } from "next/server.js"
import type { ApiResponse } from "../types/index.ts"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { AUTH_COOKIE_NAME, JWT_EXPIRES_IN, getJwtSecret, getAuthCookieOptions, clearAuthCookie } from "./auth-config.ts"

export { AUTH_COOKIE_NAME, JWT_EXPIRES_IN, getJwtSecret, getAuthCookieOptions, clearAuthCookie }

// Validation functions
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.trim().replace(/[\s-]/g, "")
  return /^\+?[0-9]{10,15}$/.test(cleaned)
}

export function isValidPassword(password: string): boolean {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  )
}

export function normalizeMoney(amount: number): number {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new AppError("Please enter a valid amount greater than zero", 400)
  }

  return Number(amount.toFixed(2))
}

export function isValidAmount(amount: number): boolean {
  return Number.isFinite(amount) && amount > 0 && amount <= 1000000
}

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// JWT functions
export function generateToken(userId: string): string {
  const secret = getJwtSecret()
  return jwt.sign({ userId }, secret, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): { userId: string } {
  const secret = getJwtSecret()

  try {
    const payload = jwt.verify(token, secret) as { userId?: unknown }

    if (!payload || typeof payload !== "object" || typeof payload.userId !== "string") {
      throw new AppError("Invalid token", 401)
    }

    return { userId: payload.userId }
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }

    throw new AppError("Invalid token", 401)
  }
}

// Date functions
export function getStartOfDay(date: Date = new Date()): Date {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)
  return start
}

export function getEndOfDay(date: Date = new Date()): Date {
  const end = new Date(date)
  end.setHours(23, 59, 59, 999)
  return end
}

// API response helpers
export function successResponse<T>(data: T, message: string = "Success"): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ message, data }, { status: 200 })
}

export function errorResponse(message: string, status: number = 400): NextResponse<ApiResponse> {
  return NextResponse.json({ message, error: message }, { status })
}

// Error handling
export class AppError extends Error {
  public statusCode: number
  public code?: string

  constructor(message: string, statusCode: number = 400, code?: string) {
    super(message)
    this.name = "AppError"
    this.statusCode = statusCode
    this.code = code
  }

  get status() {
    return this.statusCode
  }
}

export function handleError(error: unknown): NextResponse<ApiResponse> {
  if (error instanceof AppError) {
    return errorResponse(error.message, error.statusCode)
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    if (message.includes("ecconnrefused") || message.includes("querysrv") || message.includes("neon")) {
      return errorResponse("Database is temporarily unavailable. Please ensure your Neon database URL is valid and accessible.", 503)
    }
  }

  console.error("Unhandled error:", error)
  return errorResponse("An unexpected error occurred", 500)
} 