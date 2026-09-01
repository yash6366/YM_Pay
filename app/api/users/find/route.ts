import { NextResponse } from "next/server"
import { getNeonClient, getCollection, COLLECTIONS } from "@/app/config/database"
import { User } from "@/app/types"
import { handleError, AppError } from "@/app/utils"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const phone = searchParams.get("phone")

    if (!phone) {
      throw new AppError("Phone number is required", 400)
    }

    const client = await getNeonClient()
    const usersCollection = getCollection<User>(client, COLLECTIONS.USERS)

    const user = await usersCollection.findOne(
      { phone: phone.trim() },
      { projection: { _id: 1, firstName: 1, lastName: 1, phone: 1 } }
    )

    if (!user) {
      throw new AppError("User not found", 404)
    }

    return NextResponse.json(user)
  } catch (error) {
    return handleError(error)
  }
}
