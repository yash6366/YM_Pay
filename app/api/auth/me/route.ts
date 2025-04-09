import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { ObjectId } from "mongodb"
import { getMongoClient, closeMongoClient, getCollection } from "@/app/config/database"
import { User } from "@/app/types"
import { verifyToken } from "@/app/utils"

export async function GET() {
  let client = null

  try {
    // Get token from cookies
    const token = cookies().get("token")?.value

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Verify token
    const decoded = verifyToken(token)
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    // Connect to MongoDB
    client = await getMongoClient()
    const usersCollection = getCollection<User>(client, "USERS")

    // Find user using ObjectId
    const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Remove sensitive data
    const { password, ...userData } = user

    return NextResponse.json(userData)
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json(
      { message: "Unauthorized", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 401 }
    )
  } finally {
    if (client) {
      await closeMongoClient()
    }
  }
}

