import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { ObjectId, getNeonClient, getCollection, COLLECTIONS } from "@/app/config/database"
import { User } from "@/app/types"
import { verifyToken, handleError, AppError, AUTH_COOKIE_NAME } from "@/app/utils"

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value || cookieStore.get("token")?.value

    if (!token) {
      throw new AppError("Unauthorized", 401)
    }

    const decoded = verifyToken(token)
    if (!decoded || !decoded.userId) {
      throw new AppError("Invalid token", 401)
    }

    const { firstName, lastName, email, dob } = await request.json()

    if (!firstName || !lastName) {
      return NextResponse.json({ message: "First and Last name are required" }, { status: 400 })
    }

    const client = await getNeonClient()
    const usersCollection = getCollection<User>(client, COLLECTIONS.USERS)

    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(decoded.userId) },
      {
        $set: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email?.trim() || null,
          dob: dob ? new Date(dob) : null,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after", projection: { password: 0 } }
    )

    if (!result) {
      throw new AppError("User not found", 404)
    }

    return NextResponse.json({
      ...result,
      balance: Number(result.balance ?? 0),
    })
  } catch (error) {
    return handleError(error)
  }
}
