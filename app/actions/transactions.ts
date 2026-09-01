'use server'

import { cookies } from "next/headers"
import { ObjectId, getNeonClient, getCollection, TransactionType, COLLECTIONS } from "@/app/config/database"
import { Transaction, User } from "@/app/types"
import { verifyToken, AUTH_COOKIE_NAME } from "@/app/utils"

export interface DisplayTransaction {
  id: string
  amount: number
  type: "sent" | "received" | "added"
  otherParty: string
  timestamp: string
  description: string
}

export async function fetchTransactions(): Promise<DisplayTransaction[]> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value || cookieStore.get("token")?.value
    if (!token) {
      throw new Error("Unauthorized")
    }

    const decoded = verifyToken(token)
    if (!decoded || !decoded.userId) {
      throw new Error("Invalid token")
    }

    const client = await getNeonClient()
    const transactionsCollection = getCollection<Transaction>(client, COLLECTIONS.TRANSACTIONS)

    // Get transactions
    const transactions = await transactionsCollection
      .find({
        $or: [{ senderId: decoded.userId }, { receiverId: decoded.userId }],
      })
      .sort({ timestamp: -1 })
      .toArray()

    // Get user details
    const usersCollection = getCollection<User>(client, COLLECTIONS.USERS)
    const userIds = new Set<string>()
    transactions.forEach((t) => {
      if (t.senderId !== "system") userIds.add(t.senderId)
      if (t.receiverId !== "system") userIds.add(t.receiverId)
    })

    const users = await usersCollection
      .find({
        _id: {
          $in: Array.from(userIds).map(id => new ObjectId(id))
        }
      })
      .toArray()

    const userMap = new Map(users.map((u) => [u._id.toString(), u]))

    // Transform transactions
    return transactions.map((t) => {
      let type: "sent" | "received" | "added"
      let otherParty = ""

      if (t.type === TransactionType.ADD) {
        type = "added"
      } else if (t.receiverId === decoded.userId) {
        type = "received"
        const sender = userMap.get(t.senderId)
        otherParty = sender ? `${sender.firstName} ${sender.lastName}` : (t.senderId === "system" ? "System" : "Unknown")
      } else {
        type = "sent"
        const receiver = userMap.get(t.receiverId)
        otherParty = receiver ? `${receiver.firstName} ${receiver.lastName}` : (t.receiverId === "system" ? "System" : "Unknown")
      }

      return {
        id: t._id.toString(),
        amount: Number(t.amount ?? 0),
        type,
        otherParty,
        timestamp: t.timestamp.toISOString(),
        description: t.description || ""
      }
    })
  } catch (error) {
    console.error("Failed to fetch transactions:", error)
    throw error
  }
}