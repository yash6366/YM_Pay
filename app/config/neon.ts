import { randomUUID } from "crypto"
import { Pool } from "pg"
import { AppError } from "@/app/utils"

export class ObjectId {
  private readonly value: string

  constructor(value?: string) {
    this.value = value || randomUUID()
  }

  toString() {
    return this.value
  }
}

export function getDatabaseUrl() {
  const configuredUri = process.env.NEON_DATABASE_URL?.trim() || process.env.DATABASE_URL?.trim()
  return configuredUri || "postgresql://neondb_owner:password@ep-example.us-east-1.aws.neon.tech/neondb?sslmode=require"
}

let pool: Pool | null = null

export function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: getDatabaseUrl(),
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    })
  }

  return pool
}

export async function getNeonClient() {
  try {
    const client = getPool()
    await client.query(`CREATE TABLE IF NOT EXISTS users (
      "_id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "firstName" TEXT NOT NULL,
      "lastName" TEXT NOT NULL,
      email TEXT,
      phone TEXT UNIQUE,
      password TEXT NOT NULL,
      balance NUMERIC(12,2) NOT NULL DEFAULT 0,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`)

    await client.query(`CREATE TABLE IF NOT EXISTS transactions (
      "_id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "senderId" TEXT NOT NULL,
      "receiverId" TEXT NOT NULL,
      amount NUMERIC(12,2) NOT NULL,
      timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      description TEXT,
      type TEXT NOT NULL,
      status TEXT,
      "idempotencyKey" TEXT
    )`)

    await client.query(`CREATE INDEX IF NOT EXISTS users_phone_idx ON users (phone)`)
    await client.query(`CREATE INDEX IF NOT EXISTS transactions_sender_idx ON transactions ("senderId", timestamp DESC)`)
    await client.query(`CREATE INDEX IF NOT EXISTS transactions_receiver_idx ON transactions ("receiverId", timestamp DESC)`)

    return client
  } catch (error) {
    console.error("Neon DB connection failed:", error)
    throw new AppError(
      "Database is temporarily unavailable. Please ensure your Neon database URL is valid and accessible.",
      503,
      "NEON_DB_UNAVAILABLE",
    )
  }
}

export async function closeNeonClient() {
  if (pool) {
    await pool.end()
    pool = null
  }
}
