import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { ObjectId } from "mongodb"
import { getMongoClient, closeMongoClient, getCollection } from "@/app/config/database"
import { User } from "@/app/types"
import { verifyToken, handleError, AppError } from "@/app/utils"

export async function PUT(request: Request) {
  let client = null

  try {
    // Get token from cookies
    const token = cookies().get("token")?.value

    if (!token) {
      throw new AppError("Unauthorized", 401)
    }

    // Verify token
    const decoded = verifyToken(token)
    if (!decoded || !decoded.userId) {
      throw new AppError("Invalid token", 401)
    }

    // Get update data from request body
    const { firstName, lastName, email, dob } = await request.json()

    // Connect to MongoDB
    client = await getMongoClient()
    const usersCollection = getCollection<User>(client, "USERS")

    // Basic validation (add more robust validation)
    if (!firstName || !lastName) {
      return NextResponse.json({ message: 'First and Last name are required' }, { status: 400 })
    }

    // Update user
    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(decoded.userId) },
      {
        $set: {
          firstName,
          lastName,
          email: email || null,
          dob: dob ? new Date(dob) : null,
          updatedAt: new Date()
        }
      },
      { returnDocument: "after", projection: { password: 0 } }
    )

    if (!result) {
      throw new AppError("User not found", 404)
    }

    return NextResponse.json(result)
  } catch (error) {
    return handleError(error)
  } finally {
    if (client) {
      await closeMongoClient()
    }
  }
}

