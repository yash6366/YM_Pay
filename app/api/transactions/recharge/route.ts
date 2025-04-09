import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { ObjectId } from "mongodb"
import { getMongoClient, closeMongoClient, getCollection, TransactionType } from "@/app/config/database"
import { Transaction, User } from "@/app/types"
import { verifyToken, handleError, AppError, isValidAmount, isValidPhone } from "@/app/utils"

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
    const { mobileNumber, operator, amount } = await request.json()

    // Validate input
    if (!mobileNumber || !operator || !amount) {
      throw new AppError("Mobile number, operator and amount are required")
    }

    if (!isValidAmount(amount)) {
      throw new AppError("Invalid amount")
    }

    if (!isValidPhone(mobileNumber)) {
      throw new AppError("Invalid mobile number")
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

    // Check user's balance
    if (user.balance < amount) {
      throw new AppError("Insufficient balance", 400)
    }

    // Start a session for transaction
    const session = client.startSession()

    try {
      await session.withTransaction(async () => {
        // Update user balance
        const updateResult = await usersCollection.updateOne(
          { _id: user._id },
          { $inc: { balance: -amount } },
          { session },
        )

        if (updateResult.modifiedCount === 0) {
          throw new AppError("Failed to update balance", 500)
        }

        // Create transaction record
        const transaction: Omit<Transaction, "_id"> = {
          senderId: user._id.toString(),
          receiverId: "system",
          amount,
          timestamp: new Date(),
          description: `Mobile recharge for ${mobileNumber} (${operator})`,
          type: TransactionType.TRANSFER,
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
        message: "Recharge successful",
        data: {
          balance: updatedUser.balance,
          amount,
          mobileNumber,
          operator,
          timestamp: new Date(),
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