import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { ObjectId } from "mongodb"
import { getMongoClient, closeMongoClient, getCollection } from "@/app/config/database"
import { User } from "@/app/types"
import { verifyToken, handleError, AppError } from "@/app/utils"

export async function GET() {
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

    // Connect to MongoDB
    client = await getMongoClient()
    const usersCollection = getCollection<User>(client, "USERS")

    // Find user
    const user = await usersCollection.findOne(
      { _id: new ObjectId(decoded.userId) },
      { projection: { password: 0 } }
    )

    if (!user) {
      throw new AppError("User not found", 404)
    }

    return NextResponse.json(user)
  } catch (error) {
    return handleError(error)
  } finally {
    if (client) {
      await closeMongoClient()
    }
  }
}

