import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { runInTransaction, ensureDatabaseIndexes, getPool, TransactionType } from "@/app/config/database"
import { verifyToken, handleError, AppError, isValidAmount, AUTH_COOKIE_NAME } from "@/app/utils"

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
    if (!token) {
      throw new AppError("Unauthorized", 401)
    }

    const decoded = verifyToken(token)
    const { amount, method, idempotencyKey } = await request.json()

    if (!amount || !method) {
      throw new AppError("Amount and payment method are required", 400)
    }

    const numericAmount = Number(amount)
    if (!isValidAmount(numericAmount) || Number.isNaN(numericAmount) || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      throw new AppError("Invalid amount. Must be a positive number up to ₹10,00,000", 400)
    }

    const standardizedAmount = Math.round(numericAmount * 100) / 100
    const cleanMethod = String(method).trim()
    const cleanIdempotencyKey = idempotencyKey?.trim() || null

    await ensureDatabaseIndexes()
    const pool = getPool()

    // 1. Verify User Account
    const userRes = await pool.query(
      `SELECT "_id", balance FROM users WHERE "_id" = $1 LIMIT 1`,
      [decoded.userId]
    )
    const user = userRes.rows[0]
    if (!user) {
      throw new AppError("User account not found", 404)
    }

    // 2. Idempotency Intent Verification
    if (cleanIdempotencyKey) {
      const existingTxRes = await pool.query(
        `SELECT "_id", "senderId", "receiverId", amount, type, status FROM transactions WHERE "idempotencyKey" = $1 LIMIT 1`,
        [cleanIdempotencyKey]
      )

      if (existingTxRes.rows.length > 0) {
        const existingTx = existingTxRes.rows[0]
        const isSameReceiver = String(existingTx.receiverId) === String(user._id)
        const isSameSender = String(existingTx.senderId) === "system"
        const isSameAmount = Math.abs(Number(existingTx.amount) - standardizedAmount) < 0.001
        const isSameType = existingTx.type === TransactionType.ADD

        if (isSameReceiver && isSameSender && isSameAmount && isSameType) {
          return NextResponse.json({
            message: "Duplicate request processed successfully",
            data: {
              balance: Number(user.balance),
              amount: standardizedAmount,
            },
          })
        } else {
          throw new AppError("Idempotency conflict: The provided idempotency key has already been used for a different transaction.", 409)
        }
      }
    }

    // 3. ACID Execution: Credit User Balance & Insert Immutable Ledger Record
    const resultData = await runInTransaction(async (client) => {
      const updateResult = await client.query(
        `UPDATE users 
         SET balance = balance + $1, "updatedAt" = NOW() 
         WHERE "_id" = $2 
         RETURNING balance`,
        [standardizedAmount, user._id]
      )

      if (updateResult.rowCount === 0) {
        throw new AppError("Failed to update wallet balance. Transaction rolled back.", 500)
      }

      const updatedBalance = Number(updateResult.rows[0].balance)

      await client.query(
        `INSERT INTO transactions ("senderId", "receiverId", amount, timestamp, description, type, status, "idempotencyKey")
         VALUES ($1, $2, $3, NOW(), $4, $5, $6, $7)`,
        [
          "system",
          String(user._id),
          standardizedAmount,
          `Added money via ${cleanMethod}`,
          TransactionType.ADD,
          "success",
          cleanIdempotencyKey,
        ]
      )

      return {
        balance: updatedBalance,
        amount: standardizedAmount,
      }
    })

    return NextResponse.json({
      message: "Money added successfully",
      data: resultData,
    })
  } catch (error: any) {
    if (error?.code === "23505" && error?.constraint === "transactions_idempotency_idx") {
      return handleError(new AppError("Duplicate transaction detected. Request already completed.", 409))
    }
    return handleError(error)
  }
}
