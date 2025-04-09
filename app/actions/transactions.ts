'use server'

import { cookies } from "next/headers"
import { ObjectId } from "mongodb"
import { getMongoClient, closeMongoClient, getCollection, TransactionType } from "@/app/config/database"
import { Transaction, User } from "@/app/types"
import { verifyToken } from "@/app/utils"

export interface DisplayTransaction {
  id: string
  amount: number
  type: "sent" | "received" | "added"
  otherParty: string
  timestamp: string
  description: string
}

export async function fetchTransactions(): Promise<DisplayTransaction[]> {
  let client = null

  try {
    const token = cookies().get("token")?.value
    if (!token) {
      throw new Error("Unauthorized")
    }

    const decoded = verifyToken(token)
    if (!decoded || !decoded.userId) {
      throw new Error("Invalid token")
    }

    client = await getMongoClient()
    const transactionsCollection = getCollection<Transaction>(client, "TRANSACTIONS")

    // Get transactions
    const transactions = await transactionsCollection
      .find({
        $or: [{ senderId: decoded.userId }, { receiverId: decoded.userId }],
      })
      .sort({ timestamp: -1 })
      .toArray()

    // Get user details
    const usersCollection = getCollection<User>(client, "USERS")
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
      } else if (t.senderId === "system") {
        type = "received"
        const receiver = userMap.get(t.receiverId)
        otherParty = receiver ? `${receiver.firstName} ${receiver.lastName}` : "Unknown"
      } else {
        type = "sent"
        const receiver = userMap.get(t.receiverId)
        otherParty = receiver ? `${receiver.firstName} ${receiver.lastName}` : "Unknown"
      }

      return {
        id: t._id.toString(),
        amount: t.amount,
        type,
        otherParty,
        timestamp: t.timestamp.toISOString(),
        description: t.description
      }
    })
  } catch (error) {
    console.error("Failed to fetch transactions:", error)
    throw error
  } finally {
    if (client) {
      await closeMongoClient()
    }
  }
} 