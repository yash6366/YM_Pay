import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { runInTransaction, ensureDatabaseIndexes, getPool, TransactionType } from "@/app/config/database"
import { verifyToken, handleError, AppError, isValidAmount, isValidPhone, AUTH_COOKIE_NAME } from "@/app/utils"

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
    if (!token) {
      throw new AppError("Unauthorized", 401)
    }

    const decoded = verifyToken(token)
    const { mobileNumber, operator, amount, idempotencyKey } = await request.json()

    if (!mobileNumber || !operator || !amount) {
      throw new AppError("Mobile number, operator and amount are required", 400)
    }

    const numericAmount = Number(amount)
    if (!isValidAmount(numericAmount) || Number.isNaN(numericAmount) || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      throw new AppError("Invalid amount. Must be a positive number up to ₹10,00,000", 400)
    }

    if (!isValidPhone(mobileNumber)) {
      throw new AppError("Invalid mobile number format", 400)
    }

    const standardizedAmount = Math.round(numericAmount * 100) / 100
    const cleanMobile = String(mobileNumber).trim()
    const cleanOperator = String(operator).trim()
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
        const isSameSender = String(existingTx.senderId) === String(user._id)
        const isSameReceiver = String(existingTx.receiverId) === "system"
        const isSameAmount = Math.abs(Number(existingTx.amount) - standardizedAmount) < 0.001
        const isSameType = existingTx.type === TransactionType.TRANSFER

        if (isSameSender && isSameReceiver && isSameAmount && isSameType) {
          return NextResponse.json({
            message: "Duplicate request processed successfully",
            data: {
              balance: Number(user.balance),
              amount: standardizedAmount,
              mobileNumber: cleanMobile,
              operator: cleanOperator,
            },
          })
        } else {
          throw new AppError("Idempotency conflict: The provided idempotency key has already been used for a different transaction.", 409)
        }
      }
    }

    // 3. ACID Execution: Atomic Conditional Debit & Immutable Ledger Insert
    const resultData = await runInTransaction(async (client) => {
      const debitRes = await client.query(
        `UPDATE users 
         SET balance = balance - $1, "updatedAt" = NOW() 
         WHERE "_id" = $2 AND balance >= $1 
         RETURNING balance`,
        [standardizedAmount, user._id]
      )

      if (debitRes.rowCount === 0) {
        throw new AppError(`Insufficient balance. Your current balance is ₹${Number(user.balance).toFixed(2)}`, 400)
      }

      const updatedBalance = Number(debitRes.rows[0].balance)

      await client.query(
        `INSERT INTO transactions ("senderId", "receiverId", amount, timestamp, description, type, status, "idempotencyKey")
         VALUES ($1, $2, $3, NOW(), $4, $5, $6, $7)`,
        [
          String(user._id),
          "system",
          standardizedAmount,
          `Mobile recharge for ${cleanMobile} (${cleanOperator})`,
          TransactionType.TRANSFER,
          "success",
          cleanIdempotencyKey,
        ]
      )

      return {
        balance: updatedBalance,
        amount: standardizedAmount,
        mobileNumber: cleanMobile,
        operator: cleanOperator,
      }
    })

    return NextResponse.json({
      message: "Recharge successful",
      data: resultData,
    })
  } catch (error: any) {
    if (error?.code === "23505" && error?.constraint === "transactions_idempotency_idx") {
      return handleError(new AppError("Duplicate transaction detected. Request already completed.", 409))
    }
    return handleError(error)
  }
}