import { randomUUID } from "crypto"
import { Pool, types, type PoolClient } from "pg"
import { AppError } from "../utils/index.ts"

// Parse PostgreSQL NUMERIC (OID 1700) as JavaScript number
types.setTypeParser(1700, (val: string) => (val === null ? 0 : parseFloat(val)))

export class ObjectId {
  private readonly value: string

  constructor(value?: string) {
    this.value = value ?? randomUUID()
  }

  toString() {
    return this.value
  }
}

export function getDatabaseUrl() {
  const configuredUri = process.env.NEON_DATABASE_URL?.trim() || process.env.DATABASE_URL?.trim()
  return configuredUri || "postgresql://neondb_owner:password@ep-example.us-east-1.aws.neon.tech/neondb?sslmode=require"
}

export const DB_CONFIG = {
  uri: getDatabaseUrl(),
}

export const TransactionType = {
  ADD: "add",
  TRANSFER: "transfer",
  WITHDRAW: "withdraw",
} as const

export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType]

export const COLLECTIONS = {
  USERS: "users",
  TRANSACTIONS: "transactions",
} as const

let pool: Pool | null = null

export function getPool(): Pool {
  if (!pool || (pool as any).ended || (pool as any).ending) {
    pool = new Pool({
      connectionString: getDatabaseUrl(),
      ssl: { rejectUnauthorized: false },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    })
  }

  return pool
}

/**
 * Executes a callback within a managed PostgreSQL ACID transaction.
 * Automatically runs BEGIN, COMMIT on success, ROLLBACK on error, and ensures the client is released.
 */
export async function runInTransaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
  const poolInstance = getPool()
  const client = await poolInstance.connect()
  try {
    await client.query("BEGIN")
    const result = await callback(client)
    await client.query("COMMIT")
    return result
  } catch (error) {
    try {
      await client.query("ROLLBACK")
    } catch (rollbackError) {
      console.error("Rollback failed:", rollbackError)
    }
    throw error
  } finally {
    client.release()
  }
}

function normalizeValue(value: unknown): unknown {
  if (value instanceof ObjectId) return value.toString()
  return value
}

function sqlEscape(value: unknown): string {
  if (value === null || value === undefined) return "NULL"
  if (typeof value === "string") return `'${value.replace(/'/g, "''")}'`
  if (typeof value === "number" || typeof value === "boolean") return String(value)
  if (value instanceof Date) return `'${value.toISOString()}'`
  if (value instanceof ObjectId) return `'${value.toString().replace(/'/g, "''")}'`
  if (Array.isArray(value)) return value.map((item) => sqlEscape(item)).join(", ")
  return `'${String(value).replace(/'/g, "''")}'`
}

function quoteIdentifier(value: string): string {
  return `"${value.replace(/"/g, '""')}"`
}

function buildWhereClause(filter: Record<string, any> | undefined): string {
  if (!filter || Object.keys(filter).length === 0) return "1 = 1"

  const clauses: string[] = []

  for (const [key, value] of Object.entries(filter)) {
    if (key === "$or") {
      clauses.push(`(${(value as any[]).map((item) => buildWhereClause(item)).join(" OR ")})`)
      continue
    }

    if (key === "$and") {
      clauses.push(`(${(value as any[]).map((item) => buildWhereClause(item)).join(" AND ")})`)
      continue
    }

    const normalizedValue = normalizeValue(value)

    if (normalizedValue && typeof normalizedValue === "object" && !Array.isArray(normalizedValue) && !(normalizedValue instanceof Date)) {
      const nested: string[] = []
      if ((normalizedValue as any).$in) {
        nested.push(`${quoteIdentifier(key)} IN (${(normalizedValue as any).$in.map((item: unknown) => sqlEscape(normalizeValue(item))).join(", ")})`)
      }
      if ((normalizedValue as any).$gte !== undefined) {
        nested.push(`${quoteIdentifier(key)} >= ${sqlEscape(normalizeValue((normalizedValue as any).$gte))}`)
      }
      if ((normalizedValue as any).$lte !== undefined) {
        nested.push(`${quoteIdentifier(key)} <= ${sqlEscape(normalizeValue((normalizedValue as any).$lte))}`)
      }
      if ((normalizedValue as any).$ne !== undefined) {
        nested.push(`${quoteIdentifier(key)} != ${sqlEscape(normalizeValue((normalizedValue as any).$ne))}`)
      }

      if (nested.length) {
        clauses.push(`(${nested.join(" AND ")})`)
        continue
      }
    }

    if (Array.isArray(normalizedValue)) {
      clauses.push(`${quoteIdentifier(key)} IN (${normalizedValue.map((item) => sqlEscape(normalizeValue(item))).join(", ")})`)
      continue
    }

    clauses.push(`${quoteIdentifier(key)} = ${sqlEscape(normalizeValue(value))}`)
  }

  return clauses.join(" AND ")
}

function buildSetClause(update: Record<string, any>): string {
  const clauses: string[] = []

  for (const [key, value] of Object.entries(update)) {
    if (key === "$set") {
      for (const [subKey, subValue] of Object.entries(value as Record<string, any>)) {
        clauses.push(`${quoteIdentifier(subKey)} = ${sqlEscape(normalizeValue(subValue))}`)
      }
      continue
    }

    if (key === "$inc") {
      for (const [subKey, subValue] of Object.entries(value as Record<string, any>)) {
        clauses.push(`${quoteIdentifier(subKey)} = ${quoteIdentifier(subKey)} + ${sqlEscape(normalizeValue(subValue))}`)
      }
      continue
    }

    clauses.push(`${quoteIdentifier(key)} = ${sqlEscape(normalizeValue(value))}`)
  }

  return clauses.join(", ")
}

function buildOrderBy(sort: Record<string, any> | undefined): string {
  if (!sort || Object.keys(sort).length === 0) return ""

  const entries = Object.entries(sort)
    .map(([key, value]) => `${quoteIdentifier(key)} ${value === -1 ? "DESC" : "ASC"}`)
    .join(", ")

  return entries ? `ORDER BY ${entries}` : ""
}

let indexesEnsured = false

export async function ensureDatabaseIndexes() {
  if (indexesEnsured) return
  const client = getPool()

  // 1. Create tables with initial schema
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      "_id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "firstName" TEXT NOT NULL,
      "lastName" TEXT NOT NULL,
      email TEXT,
      phone TEXT UNIQUE,
      password TEXT NOT NULL,
      balance NUMERIC(12,2) NOT NULL DEFAULT 0,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)

  await client.query(`
    CREATE TABLE IF NOT EXISTS transactions (
      "_id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "senderId" TEXT NOT NULL,
      "receiverId" TEXT NOT NULL,
      amount NUMERIC(12,2) NOT NULL,
      timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      description TEXT,
      type TEXT NOT NULL,
      status TEXT,
      "idempotencyKey" TEXT
    )
  `)

  // 2. Audit & enforce non-negative user balance constraint
  const negativeBalanceCheck = await client.query(`SELECT COUNT(*) as count FROM users WHERE balance < 0`)
  if (parseInt(negativeBalanceCheck.rows[0]?.count || "0", 10) > 0) {
    throw new Error("Financial invariant violation: Existing users table contains negative balances. Remediation required before adding constraint.")
  }

  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'check_user_balance_non_negative'
      ) THEN
        ALTER TABLE users ADD CONSTRAINT check_user_balance_non_negative CHECK (balance >= 0);
      END IF;
    END $$;
  `)

  // 3. Audit & enforce positive transaction amount constraint
  const invalidAmountCheck = await client.query(`SELECT COUNT(*) as count FROM transactions WHERE amount <= 0`)
  if (parseInt(invalidAmountCheck.rows[0]?.count || "0", 10) > 0) {
    throw new Error("Financial invariant violation: Existing transactions table contains amount <= 0. Remediation required before adding constraint.")
  }

  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'check_transaction_amount_positive'
      ) THEN
        ALTER TABLE transactions ADD CONSTRAINT check_transaction_amount_positive CHECK (amount > 0);
      END IF;
    END $$;
  `)

  // 4. Enforce true Database-Level Ledger Immutability via PostgreSQL Trigger
  await client.query(`
    CREATE OR REPLACE FUNCTION prevent_transaction_mutation()
    RETURNS TRIGGER AS $$
    BEGIN
      RAISE EXCEPTION 'Financial ledger immutability violation: UPDATE and DELETE operations are strictly prohibited on the transactions table.';
    END;
    $$ LANGUAGE plpgsql;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'enforce_transactions_immutable'
      ) THEN
        CREATE TRIGGER enforce_transactions_immutable
        BEFORE UPDATE OR DELETE ON transactions
        FOR EACH ROW
        EXECUTE FUNCTION prevent_transaction_mutation();
      END IF;
    END $$;
  `)

  // 4. Audit & enforce unique partial idempotency index
  const duplicateIdempotencyCheck = await client.query(`
    SELECT "idempotencyKey", COUNT(*) as count
    FROM transactions
    WHERE "idempotencyKey" IS NOT NULL
    GROUP BY "idempotencyKey"
    HAVING COUNT(*) > 1
  `)

  if (duplicateIdempotencyCheck.rows.length > 0) {
    throw new Error(`Financial invariant violation: Found duplicate idempotency keys in transactions table (${duplicateIdempotencyCheck.rows.length} collisions). Remediation required.`)
  }

  await client.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS transactions_idempotency_idx 
    ON transactions ("idempotencyKey") 
    WHERE "idempotencyKey" IS NOT NULL
  `)

  // 5. Query performance indexes
  await client.query(`CREATE INDEX IF NOT EXISTS users_phone_idx ON users (phone)`)
  await client.query(`CREATE INDEX IF NOT EXISTS users_name_idx ON users ("firstName", "lastName")`)
  await client.query(`CREATE INDEX IF NOT EXISTS tx_sender_idx ON transactions ("senderId", timestamp DESC)`)
  await client.query(`CREATE INDEX IF NOT EXISTS tx_receiver_idx ON transactions ("receiverId", timestamp DESC)`)

  indexesEnsured = true
}

type NeonSession = {
  withTransaction: (callback: () => Promise<void>) => Promise<void>
  endSession: () => Promise<void>
}

type FindCursor<T> = {
  sort(sortSpec?: Record<string, any>): FindCursor<T>
  toArray(): Promise<T[]>
}

type DatabaseCollection<T> = {
  findOne(filter?: Record<string, any>, options?: Record<string, any>): Promise<T | null>
  find(filter?: Record<string, any>): FindCursor<T>
  insertOne(document: Record<string, any>, options?: Record<string, any>): Promise<{ insertedId: string }>
  updateOne(filter: Record<string, any>, update: Record<string, any>, options?: Record<string, any>): Promise<{ modifiedCount: number; matchedCount: number }>
  findOneAndUpdate(filter: Record<string, any>, update: Record<string, any>, options?: Record<string, any>): Promise<T | null>
  createIndex(): Promise<null>
}

export async function getNeonClient(): Promise<Pool & { startSession: () => NeonSession }> {
  try {
    const client = getPool()
    await ensureDatabaseIndexes()

    ;(client as any).startSession = () => ({
      withTransaction: async (callback: () => Promise<void>) => callback(),
      endSession: async () => undefined,
    })

    return client as Pool & { startSession: () => NeonSession }
  } catch (error) {
    console.error("Database connection failed:", error)
    throw new AppError(
      "Database is temporarily unavailable. Please ensure your Neon database URL is valid and accessible.",
      503,
      "NEON_DB_UNAVAILABLE",
    )
  }
}

export async function closeNeonClient() {
  // In serverless / long-running environments, keep pool alive across requests.
  // Only explicitly end pool during tests or process shutdown.
  if (process.env.NODE_ENV === "test" && pool) {
    try {
      await pool.end()
    } catch {
      // ignore
    }
    pool = null
    indexesEnsured = false
  }
}

export function getDatabase(client: any) {
  return client
}

export function getCollection<T>(client: any, collectionName: string): DatabaseCollection<T> {
  const tableName = collectionName
  const isImmutableLedger = tableName === COLLECTIONS.TRANSACTIONS

  return {
    async findOne(filter: Record<string, any> = {}, options?: Record<string, any>) {
      const projection = options?.projection
      const select = projection
        ? Object.entries(projection)
            .filter(([, enabled]) => enabled)
            .map(([key]) => quoteIdentifier(key))
            .join(", ") || "*"
        : "*"

      const sql = `SELECT ${select} FROM ${quoteIdentifier(tableName)} WHERE ${buildWhereClause(filter)} LIMIT 1`
      const result = await client.query(sql)
      return (result.rows[0] ?? null) as T | null
    },

    find(filter: Record<string, any> = {}): FindCursor<T> {
      const cursor: FindCursor<T> = {
        sort(sortSpec: Record<string, any> = {}) {
          return {
            async toArray() {
              const sql = `SELECT * FROM ${quoteIdentifier(tableName)} WHERE ${buildWhereClause(filter)} ${buildOrderBy(sortSpec)}`
              const result = await client.query(sql)
              return result.rows as T[]
            },
            sort: () => this,
          }
        },
        toArray: async () => {
          const sql = `SELECT * FROM ${quoteIdentifier(tableName)} WHERE ${buildWhereClause(filter)}`
          const result = await client.query(sql)
          return result.rows as T[]
        },
      }

      return cursor
    },

    async insertOne(document: Record<string, any>, _options?: Record<string, any>) {
      const columns = Object.keys(document).map((key) => quoteIdentifier(key)).join(", ")
      const values = Object.values(document).map((value) => sqlEscape(normalizeValue(value))).join(", ")
      const sql = `INSERT INTO ${quoteIdentifier(tableName)} (${columns}) VALUES (${values}) RETURNING "_id"`
      const result = await client.query(sql)
      return { insertedId: result.rows[0]?._id ?? randomUUID() }
    },

    async updateOne(filter: Record<string, any>, update: Record<string, any>, _options?: Record<string, any>) {
      if (isImmutableLedger) {
        throw new Error("Financial ledger immutability violation: UPDATE operations on transactions table are strictly forbidden.")
      }
      const sql = `UPDATE ${quoteIdentifier(tableName)} SET ${buildSetClause(update)} WHERE ${buildWhereClause(filter)}`
      const result = await client.query(sql)
      return { modifiedCount: result.rowCount ?? 0, matchedCount: result.rowCount ?? 0 }
    },

    async findOneAndUpdate(filter: Record<string, any>, update: Record<string, any>, options?: Record<string, any>) {
      if (isImmutableLedger) {
        throw new Error("Financial ledger immutability violation: UPDATE operations on transactions table are strictly forbidden.")
      }
      const current = await this.findOne(filter, options)
      if (!current) return null
      await this.updateOne(filter, update)
      return (await this.findOne(filter, options)) as T | null
    },

    async createIndex() {
      return null
    },
  }
}
