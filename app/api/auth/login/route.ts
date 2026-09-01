import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getNeonClient, getCollection, COLLECTIONS } from "@/app/config/database"
import { LoginRequest, LoginResponse, User } from "@/app/types"
import {
  comparePasswords,
  generateToken,
  handleError,
  AppError,
  AUTH_COOKIE_NAME,
  getAuthCookieOptions,
} from "@/app/utils"
import { phoneSchema, passwordSchema } from "@/app/utils/validation"

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const body: LoginRequest = await request.json()
    const { phone, password } = body

    // Validate input
    try {
      phoneSchema.parse(phone)
      passwordSchema.parse(password)
    } catch (error) {
      throw new AppError(error instanceof Error ? error.message : "Invalid input", 400)
    }

    // Connect to database
    const client = await getNeonClient()
    const usersCollection = getCollection<User>(client, COLLECTIONS.USERS)

    // Find user
    const user = await usersCollection.findOne({ phone })
    if (!user) {
      throw new AppError("User not found", 404)
    }

    // Verify password
    const isValid = await comparePasswords(password, user.password)
    if (!isValid) {
      throw new AppError("Invalid credentials", 401)
    }

    // Generate token
    const token = generateToken(user._id.toString())

    // Set cookie
    cookieStore.set(AUTH_COOKIE_NAME, token, getAuthCookieOptions())

    // Return response
    const response: LoginResponse = {
      token,
      user: {
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        balance: Number(user.balance ?? 0),
      },
    }

    return NextResponse.json({ message: "Login successful", data: response })
  } catch (error) {
    return handleError(error)
  }
}
