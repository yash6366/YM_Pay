import { NextResponse } from "next/server"
import { ApiResponse } from "../types"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set")
}

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = "7d"

// Validation functions
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[0-9]{10}$/
  return phoneRegex.test(phone)
}

export function isValidPassword(password: string): boolean {
  return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)
}

export function isValidAmount(amount: number): boolean {
  return amount > 0 && Number.isFinite(amount)
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
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): { userId: string } {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string }
  } catch (error) {
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
  constructor(public message: string, public status: number = 400) {
    super(message)
    this.name = "AppError"
  }
}

export function handleError(error: unknown): NextResponse<ApiResponse> {
  if (error instanceof AppError) {
    return errorResponse(error.message, error.status)
  }
  
  console.error("Unhandled error:", error)
  return errorResponse("An unexpected error occurred", 500)
} 