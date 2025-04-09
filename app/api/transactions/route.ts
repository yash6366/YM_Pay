import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { ObjectId } from "mongodb"
import { getMongoClient, closeMongoClient, getCollection } from "@/app/config/database"
import { Transaction, User } from "@/app/types"
import { verifyToken, handleError, AppError, getStartOfDay, getEndOfDay } from "@/app/utils"

export async function GET(request: Request) {
  let client = null

  try {
    // Get token from cookie
    const token = cookies().get("token")?.value
    if (!token) {
      throw new AppError("Unauthorized", 401)
    }

    // Verify token
    const decoded = verifyToken(token)

    // Connect to database
    client = await getMongoClient()
    const transactionsCollection = getCollection<Transaction>(client, "TRANSACTIONS")

    // Get date range
    const startDate = getStartOfDay()
    startDate.setDate(startDate.getDate() - 30) // Last 30 days
    const endDate = getEndOfDay()

    // Get transactions
    const transactions = await transactionsCollection
      .find({
        $or: [{ senderId: decoded.userId }, { receiverId: decoded.userId }],
        timestamp: { $gte: startDate, $lte: endDate },
      })
      .sort({ timestamp: -1 })
      .toArray()

    // Get user details for each transaction
    const usersCollection = getCollection<User>(client, "USERS")
    const userIds = new Set<string>()
    transactions.forEach((t) => {
      if (t.senderId !== "system") userIds.add(t.senderId)
      if (t.receiverId !== "system") userIds.add(t.receiverId)
    })

    const users = await usersCollection
      .find({ _id: { $in: Array.from(userIds).map((id) => new ObjectId(id)) } })
      .toArray()

    const userMap = new Map(users.map((u) => [u._id.toString(), u]))

    // Format transactions
    const formattedTransactions = transactions.map((t) => ({
      id: t._id.toString(),
      type: t.type,
      amount: t.amount,
      timestamp: t.timestamp,
      description: t.description,
      sender: t.senderId === "system" ? "System" : userMap.get(t.senderId),
      receiver: t.receiverId === "system" ? "System" : userMap.get(t.receiverId),
    }))

    return NextResponse.json({
      message: "Transactions retrieved successfully",
      data: formattedTransactions,
    })
  } catch (error) {
    return handleError(error)
  } finally {
    if (client) {
      await closeMongoClient()
    }
  }
}

