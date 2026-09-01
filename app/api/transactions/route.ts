import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { ObjectId, getNeonClient, getCollection, COLLECTIONS } from "@/app/config/database"
import { Transaction, User } from "@/app/types"
import { verifyToken, handleError, AppError, getStartOfDay, getEndOfDay, AUTH_COOKIE_NAME } from "@/app/utils"

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value || cookieStore.get("token")?.value
    if (!token) {
      throw new AppError("Unauthorized", 401)
    }

    const decoded = verifyToken(token)

    const client = await getNeonClient()
    const transactionsCollection = getCollection<Transaction>(client, COLLECTIONS.TRANSACTIONS)

    const startDate = getStartOfDay()
    startDate.setDate(startDate.getDate() - 30) // Last 30 days
    const endDate = getEndOfDay()

    const transactions = await transactionsCollection
      .find({
        $or: [{ senderId: decoded.userId }, { receiverId: decoded.userId }],
        timestamp: { $gte: startDate, $lte: endDate },
      })
      .sort({ timestamp: -1 })
      .toArray()

    const usersCollection = getCollection<User>(client, COLLECTIONS.USERS)
    const userIds = new Set<string>()
    transactions.forEach((t) => {
      if (t.senderId !== "system") userIds.add(t.senderId)
      if (t.receiverId !== "system") userIds.add(t.receiverId)
    })

    const userMap = new Map<string, { id: string; firstName: string; lastName: string; phone: string }>()
    if (userIds.size > 0) {
      const userList = Array.from(userIds)
      const placeholders = userList.map((_, i) => `$${i + 1}`).join(", ")
      const usersRes = await client.query(
        `SELECT "_id", "firstName", "lastName", phone FROM users WHERE "_id" IN (${placeholders})`,
        userList
      )

      usersRes.rows.forEach((u) => {
        userMap.set(String(u._id), {
          id: String(u._id),
          firstName: u.firstName,
          lastName: u.lastName,
          phone: u.phone,
        })
      })
    }

    const formattedTransactions = transactions.map((t) => ({
      id: t._id.toString(),
      type: t.type,
      amount: Number(t.amount ?? 0),
      timestamp: t.timestamp,
      description: t.description,
      sender: t.senderId === "system" ? "System" : (userMap.get(t.senderId) ?? null),
      receiver: t.receiverId === "system" ? "System" : (userMap.get(t.receiverId) ?? null),
    }))

    return NextResponse.json({
      message: "Transactions retrieved successfully",
      data: formattedTransactions,
    })
  } catch (error) {
    return handleError(error)
  }
}
