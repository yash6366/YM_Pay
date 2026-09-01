import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getNeonClient, getCollection, COLLECTIONS } from "@/app/config/database"
import { SignupRequest, LoginResponse, User } from "@/app/types"
import {
  hashPassword,
  generateToken,
  isValidPhone,
  isValidPassword,
  handleError,
  AppError,
  AUTH_COOKIE_NAME,
  getAuthCookieOptions,
} from "@/app/utils"

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const body: SignupRequest = await request.json()
    const { firstName, lastName, email, phone, password } = body

    // Validate input
    if (!firstName || !lastName || !phone || !password) {
      throw new AppError("All fields are required", 400)
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new AppError("Invalid email format", 400)
    }

    if (!isValidPhone(phone)) {
      throw new AppError("Invalid phone number format", 400)
    }

    if (!isValidPassword(password)) {
      throw new AppError("Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character", 400)
    }

    // Connect to database
    const client = await getNeonClient()
    const usersCollection = getCollection<User>(client, COLLECTIONS.USERS)

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ phone })
    if (existingUser) {
      throw new AppError("User already exists with this phone number", 409)
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const newUser: Omit<User, "_id"> = {
      firstName,
      lastName,
      email: email?.trim() || null,
      phone,
      password: hashedPassword,
      balance: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await usersCollection.insertOne(newUser as User)
    const user = await usersCollection.findOne({ _id: result.insertedId })

    if (!user) {
      throw new AppError("Failed to create user", 500)
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

    return NextResponse.json({ message: "User created successfully", data: response })
  } catch (error) {
    return handleError(error)
  }
}
