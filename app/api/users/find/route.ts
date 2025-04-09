import { NextResponse } from "next/server"
import { getMongoClient, closeMongoClient, getCollection } from "@/app/config/database"
import { User } from "@/app/types"
import { handleError, AppError } from "@/app/utils"

export async function GET(request: Request) {
  let client = null

  try {
    const { searchParams } = new URL(request.url)
    const phone = searchParams.get("phone")

    if (!phone) {
      throw new AppError("Phone number is required")
    }

    // Connect to MongoDB
    client = await getMongoClient()
    const usersCollection = getCollection<User>(client, "USERS")

    // Find user by phone
    const user = await usersCollection.findOne(
      { phone },
      { projection: { _id: 1, firstName: 1, lastName: 1, phone: 1 } }
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

