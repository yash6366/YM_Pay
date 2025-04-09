import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { ObjectId } from "mongodb"
import { getMongoClient, closeMongoClient, getCollection, TransactionType } from "@/app/config/database"
import { Transaction, User, SendMoneyRequest } from "@/app/types"
import { verifyToken, handleError, AppError, isValidAmount, isValidPhone } from "@/app/utils"

export async function POST(request: Request) {
  let client = null

  try {
    // Get token from cookie
    const token = cookies().get("token")?.value
    if (!token) {
      throw new AppError("Please login to continue", 401)
    }

    // Verify token
    const decoded = verifyToken(token)

    // Get request body
    const body: SendMoneyRequest = await request.json()
    const { amount, receiverPhone, description } = body

    // Validate input
    if (!amount || !receiverPhone) {
      throw new AppError("Please provide both amount and receiver's phone number")
    }

    if (!isValidAmount(amount)) {
      throw new AppError("Please enter a valid amount (minimum ₹1)")
    }

    if (!isValidPhone(receiverPhone)) {
      throw new AppError("Please enter a valid 10-digit phone number")
    }

    // Connect to database
    client = await getMongoClient()
    const usersCollection = getCollection<User>(client, "USERS")
    const transactionsCollection = getCollection<Transaction>(client, "TRANSACTIONS")

    // Get sender
    const sender = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) })
    if (!sender) {
      throw new AppError("Your account not found. Please try logging in again", 404)
    }

    // Check sender's balance
    if (sender.balance < amount) {
      throw new AppError(`Insufficient balance. Your current balance is ₹${sender.balance}`, 400)
    }

    // Get receiver
    const receiver = await usersCollection.findOne({ phone: receiverPhone })
    if (!receiver) {
      throw new AppError("Recipient not found. Please check the phone number", 404)
    }

    // Prevent self-transfer
    if (sender._id.toString() === receiver._id.toString()) {
      throw new AppError("You cannot send money to your own account", 400)
    }

    // Start a session for transaction
    const session = client.startSession()

    try {
      await session.withTransaction(async () => {
        // Update sender's balance
        const senderUpdateResult = await usersCollection.updateOne(
          { _id: sender._id },
          { $inc: { balance: -amount } },
          { session },
        )

        if (senderUpdateResult.modifiedCount === 0) {
          throw new AppError("Failed to process payment. Please try again", 500)
        }

        // Update receiver's balance
        const receiverUpdateResult = await usersCollection.updateOne(
          { _id: receiver._id },
          { $inc: { balance: amount } },
          { session },
        )

        if (receiverUpdateResult.modifiedCount === 0) {
          throw new AppError("Failed to process payment. Please try again", 500)
        }

        // Create transaction record
        const transaction: Omit<Transaction, "_id"> = {
          senderId: sender._id.toString(),
          receiverId: receiver._id.toString(),
          amount,
          timestamp: new Date(),
          description: description || `Payment to ${receiver.firstName} ${receiver.lastName}`,
          type: TransactionType.TRANSFER,
        }

        const result = await transactionsCollection.insertOne(transaction as Transaction, { session })
        if (!result.insertedId) {
          throw new AppError("Failed to create transaction record. Please try again", 500)
        }
      })

      // Get updated sender
      const updatedSender = await usersCollection.findOne({ _id: sender._id })
      if (!updatedSender) {
        throw new AppError("Failed to get updated balance. Please refresh the page", 500)
      }

      return NextResponse.json({
        success: true,
        message: "Money sent successfully",
        data: {
          balance: updatedSender.balance,
          amount,
          receiverName: `${receiver.firstName} ${receiver.lastName}`,
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

