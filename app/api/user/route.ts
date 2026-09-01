import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { ObjectId, getNeonClient, getCollection, COLLECTIONS } from "@/app/config/database"
import { User } from "@/app/types"
import { verifyToken, handleError, AppError } from "@/app/utils"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      throw new AppError("Unauthorized", 401)
    }

    const decoded = verifyToken(token)
    if (!decoded || !decoded.userId) {
      throw new AppError("Invalid token", 401)
    }

    const client = await getNeonClient()
    const usersCollection = getCollection<User>(client, COLLECTIONS.USERS)

    const user = await usersCollection.findOne(
      { _id: new ObjectId(decoded.userId) },
      { projection: { password: 0 } }
    )

    if (!user) {
      throw new AppError("User not found", 404)
    }

    return NextResponse.json({
      ...user,
      balance: Number(user.balance ?? 0),
    })
  } catch (error) {
    return handleError(error)
  }
}
