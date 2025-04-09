import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getMongoClient, closeMongoClient, getCollection } from "@/app/config/database"
import { SignupRequest, LoginResponse, User } from "@/app/types"
import { hashPassword, generateToken, isValidPhone, isValidPassword, handleError, AppError } from "@/app/utils"

export async function POST(request: Request) {
  let client = null

  try {
    const body: SignupRequest = await request.json()
    const { firstName, lastName, phone, password } = body

    // Validate input
    if (!firstName || !lastName || !phone || !password) {
      throw new AppError("All fields are required")
    }

    if (!isValidPhone(phone)) {
      throw new AppError("Invalid phone number format")
    }

    if (!isValidPassword(password)) {
      throw new AppError("Password must be at least 6 characters long")
    }

    // Connect to database
    client = await getMongoClient()
    const usersCollection = getCollection<User>(client, "USERS")

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ phone })
    if (existingUser) {
      throw new AppError("User already exists", 409)
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const newUser: Omit<User, "_id"> = {
      firstName,
      lastName,
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

    return NextResponse.json({ message: "User created successfully", data: response })
  } catch (error) {
    return handleError(error)
  } finally {
    if (client) {
      await closeMongoClient()
    }
  }
}

