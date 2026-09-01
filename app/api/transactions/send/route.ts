import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { runInTransaction, ensureDatabaseIndexes, getPool, TransactionType } from "@/app/config/database"
import { SendMoneyRequest } from "@/app/types"
import { verifyToken, handleError, AppError, isValidAmount, isValidPhone, AUTH_COOKIE_NAME } from "@/app/utils"

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
    if (!token) {
      throw new AppError("Please login to continue", 401)
    }

    const decoded = verifyToken(token)
    const body: SendMoneyRequest & { idempotencyKey?: string } = await request.json()
    const { amount, receiverPhone, description, idempotencyKey } = body

    if (!amount || !receiverPhone) {
      throw new AppError("Please provide both amount and receiver's phone number", 400)
    }

    const numericAmount = Number(amount)
    if (!isValidAmount(numericAmount) || Number.isNaN(numericAmount) || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      throw new AppError("Please enter a valid positive amount (minimum ₹1, maximum ₹10,00,000)", 400)
    }

    // Standardize to 2 decimal places to eliminate floating point precision issues
    const standardizedAmount = Math.round(numericAmount * 100) / 100

    if (!isValidPhone(receiverPhone)) {
      throw new AppError("Please enter a valid phone number", 400)
    }

    await ensureDatabaseIndexes()
    const pool = getPool()

    // 1. Verify Sender Account
    const senderRes = await pool.query(
      `SELECT "_id", "firstName", "lastName", balance FROM users WHERE "_id" = $1 LIMIT 1`,
      [decoded.userId]
    )
    const sender = senderRes.rows[0]
    if (!sender) {
      throw new AppError("Your account not found. Please try logging in again", 404)
    }

    // 2. Verify Receiver Account
    const receiverRes = await pool.query(
      `SELECT "_id", "firstName", "lastName", phone, balance FROM users WHERE phone = $1 LIMIT 1`,
      [receiverPhone.trim()]
    )
    const receiver = receiverRes.rows[0]
    if (!receiver) {
      throw new AppError("Recipient not found. Please check the phone number", 404)
    }

    if (String(sender._id) === String(receiver._id)) {
      throw new AppError("You cannot send money to your own account", 400)
    }

    // 3. Idempotency Intent Verification
    const cleanIdempotencyKey = idempotencyKey?.trim() || null
    if (cleanIdempotencyKey) {
      const existingTxRes = await pool.query(
        `SELECT "_id", "senderId", "receiverId", amount, type, status FROM transactions WHERE "idempotencyKey" = $1 LIMIT 1`,
        [cleanIdempotencyKey]
      )

      if (existingTxRes.rows.length > 0) {
        const existingTx = existingTxRes.rows[0]
        const isSameSender = String(existingTx.senderId) === String(sender._id)
        const isSameReceiver = String(existingTx.receiverId) === String(receiver._id)
        const isSameAmount = Math.abs(Number(existingTx.amount) - standardizedAmount) < 0.001
        const isSameType = existingTx.type === TransactionType.TRANSFER

        if (isSameSender && isSameReceiver && isSameAmount && isSameType) {
          // Exactly matching intent: Return original success representation
          return NextResponse.json({
            success: true,
            message: "Duplicate request processed successfully",
            data: {
              balance: Number(sender.balance),
              amount: standardizedAmount,
              receiverName: `${receiver.firstName} ${receiver.lastName}`,
            },
          })
        } else {
          // Idempotency key reused for differing financial parameters
          throw new AppError("Idempotency conflict: The provided idempotency key has already been used for a different transaction.", 409)
        }
      }
    }

    // 4. ACID Execution: Deterministic Lock Acquisition, Atomic Conditional Debit, Credit & Immutable Ledger Insert
    const transactionResult = await runInTransaction(async (client) => {
      // Step A: Acquire row locks in deterministic ID order to prevent deadlocks on concurrent bidirectional transfers (A->B & B->A)
      const sortedIds = [String(sender._id), String(receiver._id)].sort()
      await client.query(
        `SELECT "_id" FROM users WHERE "_id" = $1 OR "_id" = $2 ORDER BY "_id" FOR UPDATE`,
        [sortedIds[0], sortedIds[1]]
      )

      // Step B: Atomic conditional debit with row verification
      const debitRes = await client.query(
        `UPDATE users 
         SET balance = balance - $1, "updatedAt" = NOW() 
         WHERE "_id" = $2 AND balance >= $1 
         RETURNING balance`,
        [standardizedAmount, sender._id]
      )

      if (debitRes.rowCount === 0) {
        throw new AppError(`Insufficient balance. Your current balance is ₹${Number(sender.balance).toFixed(2)}`, 400)
      }

      const updatedSenderBalance = Number(debitRes.rows[0].balance)

      // Step B: Atomic credit to receiver
      const creditRes = await client.query(
        `UPDATE users 
         SET balance = balance + $1, "updatedAt" = NOW() 
         WHERE "_id" = $2 
         RETURNING balance`,
        [standardizedAmount, receiver._id]
      )

      if (creditRes.rowCount === 0) {
        throw new AppError("Failed to credit recipient account. Transaction rolled back.", 500)
      }

      // Step C: Insert immutable ledger record
      const ledgerDesc = description?.trim() || `Payment to ${receiver.firstName} ${receiver.lastName}`
      await client.query(
        `INSERT INTO transactions ("senderId", "receiverId", amount, timestamp, description, type, status, "idempotencyKey")
         VALUES ($1, $2, $3, NOW(), $4, $5, $6, $7)`,
        [
          String(sender._id),
          String(receiver._id),
          standardizedAmount,
          ledgerDesc,
          TransactionType.TRANSFER,
          "success",
          cleanIdempotencyKey,
        ]
      )

      return {
        balance: updatedSenderBalance,
        amount: standardizedAmount,
        receiverName: `${receiver.firstName} ${receiver.lastName}`,
      }
    })

    return NextResponse.json({
      success: true,
      message: "Money sent successfully",
      data: transactionResult,
    })
  } catch (error: any) {
    if (error?.code === "23505" && error?.constraint === "transactions_idempotency_idx") {
      return handleError(new AppError("Duplicate transaction detected. Request already completed.", 409))
    }
    return handleError(error)
  }
}
