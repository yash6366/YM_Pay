import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { ObjectId, getNeonClient, getCollection, COLLECTIONS } from "@/app/config/database"
import { User } from "@/app/types"
import { verifyToken, AUTH_COOKIE_NAME } from "@/app/utils"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value || cookieStore.get("token")?.value

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const client = await getNeonClient()
    const usersCollection = getCollection<User>(client, COLLECTIONS.USERS)

    const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const { password, ...userData } = user

    return NextResponse.json({
      ...userData,
      balance: Number(userData.balance ?? 0),
    })
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json(
      { message: "Unauthorized", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 401 }
    )
  }
}
