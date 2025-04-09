import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { ObjectId } from "mongodb"
import { getMongoClient, closeMongoClient, getCollection, TransactionType } from "@/app/config/database"
import { Transaction, User } from "@/app/types"
import { verifyToken, handleError, AppError, isValidAmount } from "@/app/utils"

export async function POST(request: Request) {
  let client = null

  try {
    // Get token from cookie
    const token = cookies().get("token")?.value
    if (!token) {
      throw new AppError("Unauthorized", 401)
    }

    // Verify token
    const decoded = verifyToken(token)

    // Get request body
    const { amount, method } = await request.json()

    // Validate input
    if (!amount || !method) {
      throw new AppError("Amount and method are required")
    }

    if (!isValidAmount(amount)) {
      throw new AppError("Invalid amount")
    }

    // Connect to database
    client = await getMongoClient()
    const usersCollection = getCollection<User>(client, "USERS")
    const transactionsCollection = getCollection<Transaction>(client, "TRANSACTIONS")

    // Get user
    const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) })
    if (!user) {
      throw new AppError("User not found", 404)
    }

    // Start a session for transaction
    const session = client.startSession()

    try {
      await session.withTransaction(async () => {
        // Update user balance
        const updateResult = await usersCollection.updateOne(
          { _id: user._id },
          { $inc: { balance: amount } },
          { session },
        )

        if (updateResult.modifiedCount === 0) {
          throw new AppError("Failed to update balance", 500)
        }

        // Create transaction record
        const transaction: Omit<Transaction, "_id"> = {
          senderId: "system",
          receiverId: user._id.toString(),
          amount,
          timestamp: new Date(),
          description: `Added money via ${method}`,
          type: TransactionType.ADD,
        }

        const result = await transactionsCollection.insertOne(transaction as Transaction, { session })
        if (!result.insertedId) {
          throw new AppError("Failed to create transaction record", 500)
        }
      })

      // Get updated user
      const updatedUser = await usersCollection.findOne({ _id: user._id })
      if (!updatedUser) {
        throw new AppError("Failed to get updated user", 500)
      }

      return NextResponse.json({
        message: "Money added successfully",
        data: {
          balance: updatedUser.balance,
          amount,
        },
      })
    } finally {
      await session.endSession()
    }
  } catch (error) {
    return handleError(error)
  } finally {
    if (client) {
      await closeMongoClient()
    }
  }
}

