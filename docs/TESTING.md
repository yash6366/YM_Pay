# YM-Pay Testing Architecture & Verification Guide

## 1. Test Suite Philosophy & Organization

YM-Pay uses Node.js's native test runner (`node:test` + `node:assert/strict`) with TypeScript strip-types support to deliver ultra-fast, zero-overhead automated testing without heavy test runner bloat.

```text
tests/
├── auth-config.test.ts                     # Unit: Auth, Validation, JWT, Money normalization, Error classes
├── financial-transactions.test.ts          # Unit: Business invariants, precision rounding, idempotency logic
└── financial-transactions.integration.test.ts  # Integration: Live PostgreSQL constraints, triggers, concurrency
```

---

## 2. Test Execution Commands

| Target | Command | Purpose |
|---|---|---|
| **Unit & Invariant Tests** | `npm test` | Executes all isolated unit, validation, precision, and business logic tests. |
| **Live Integration Tests** | `npm run test:integration` | Executes full live PostgreSQL concurrency, constraint, rollback, and trigger tests. |
| **Typecheck** | `npm run typecheck` | Validates TypeScript compilation with `--noEmit`. |
| **Lint** | `npm run lint` | Runs ESLint 9 across `app`, `components`, `lib`, `hooks`, and `tests`. |
| **Production Build** | `npm run build` | Builds optimized Next.js production bundle. |

---

## 3. Catalog of Test Scenarios

### 3.1 Unit Test Catalog (`tests/auth-config.test.ts` & `tests/financial-transactions.test.ts`)
1. **Phone Validation**: Accepts valid E.164 and 10-15 digit formats; rejects malformed inputs and alphabets.
2. **Password Validation**: Enforces length, uppercase, lowercase, numeric, and special character requirements.
3. **Amount Validation**: Enforces bounds ($0 < \text{Amount} \le 1,000,000$); rejects zero, negative, NaN, and infinite values.
4. **Money Normalization**: Rounds to 2 decimal places and throws `AppError` on invalid amounts.
5. **JWT Lifecycle**: Generates signed token, verifies signature, decodes payload, and rejects tampered tokens.
6. **Cookie Security**: Verifies `HttpOnly`, `SameSite=Lax`, and `Secure` attributes.
7. **Date Calculation**: Tests start-of-day and end-of-day boundary computations.
8. **AppError Structure**: Confirms status codes, error codes, and messages.
9. **Self-Transfer Prevention**: Detects identical sender and receiver IDs.
10. **Idempotency Match**: Confirms identical intent produces success representation.
11. **Idempotency Conflict**: Confirms mismatched amounts or recipients trigger 409 conflict detection.
12. **Lock Order Stability**: Demonstrates that sorting participant UUIDs produces identical order regardless of call direction.
13. **Data Sanitization**: Verifies that user projection never exposes password or hash fields.

### 3.2 Live Database Integration Catalog (`tests/financial-transactions.integration.test.ts`)
1. **Balance Non-Negative Constraint**: Attempts direct SQL update to set `balance = -10`; verifies PostgreSQL rejects with constraint error `23514`.
2. **Transaction Positive Amount Constraint**: Attempts inserting transactions with `amount = 0` and `amount = -50`; verifies PostgreSQL rejects with constraint error `23514`.
3. **Ledger Immutability Trigger**: Attempts executing `UPDATE transactions` and `DELETE FROM transactions`; verifies PostgreSQL trigger aborts with custom exception.
4. **ACID Transfer**: Verifies atomic debit, credit, and immutable ledger entry in a single transaction.
5. **Rollback Correctness**: Simulates mid-transaction error; proves sender balance, receiver balance, and ledger count remain untouched.
6. **Concurrent Overdraft Protection**: Fires concurrent requests ($80 + 80$) against a ₹100 balance; proves exactly one succeeds and the other is rejected.
7. **Opposing Transfers Deadlock Prevention**: Executes concurrent bidirectional transfers ($A \rightarrow B$ & $B \rightarrow A$); proves transactions complete with zero deadlocks.
8. **Idempotency Race Protection**: Fires simultaneous duplicate requests with identical idempotency keys; proves database unique index catches race condition.
9. **Wealth Conservation Invariant**: Executes a series of peer-to-peer transfers; proves $\sum \text{Balances}_{\text{before}} \equiv \sum \text{Balances}_{\text{after}}$.

---

## 4. Integration Test Environment Handling

When running in CI or local environments without active PostgreSQL connection strings, `tests/financial-transactions.integration.test.ts` automatically probes database connectivity via `SELECT 1`. If the database is unreachable, it logs a clear diagnostic message and skips the live suite cleanly, preventing CI pipeline breakage while preserving full execution capability when a database is provisioned.
