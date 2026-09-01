/**
 * @deprecated Legacy database configuration module.
 * All database operations, connections, and transactional functions are canonically managed in `@/app/config/database`.
 * This module is maintained solely for backwards-compatibility and delegates to the hardened database core.
 */

export {
  ObjectId,
  getDatabaseUrl,
  getPool,
  getNeonClient,
  closeNeonClient,
  runInTransaction,
  ensureDatabaseIndexes,
  TransactionType,
  COLLECTIONS,
} from "./database.ts"
