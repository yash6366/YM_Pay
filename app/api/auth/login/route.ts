import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getMongoClient, closeMongoClient, getCollection } from "@/app/config/database"
import { LoginRequest, LoginResponse, User } from "@/app/types"
import { comparePasswords, generateToken, isValidPhone, isValidPassword, handleError, AppError } from "@/app/utils"
import { phoneSchema, passwordSchema } from "@/app/utils/validation"

export async function POST(request: Request) {
  let client = null

  try {
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
    client = await getMongoClient()
    const usersCollection = getCollection<User>(client, "USERS")

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
    cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    // Return response
    const response: LoginResponse = {
      token,
      user: {
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        balance: user.balance,
      },
    }

    return NextResponse.json({ message: "Login successful", data: response })
  } catch (error) {
    return handleError(error)
  } finally {
    if (client) {
      await closeMongoClient()
    }
  }
}

