# YM-Pay System Architecture

## 1. High-Level Architectural Blueprint

YM-Pay is built on Next.js, TypeScript, and PostgreSQL. It models a transactional digital wallet system prioritizing strict financial consistency, database-enforced invariants, deterministic concurrency control, and immutable ledger auditing.

```mermaid
flowchart TD
    Client["Client Browser / UI"]
    NextJS["Next.js Edge / App Router Layer"]
    Middleware["Middleware (Correlation ID, Rate Limiting, JWT Verification)"]
    API["API Route Handlers (/api/transactions/*, /api/auth/*)"]
    Service["Financial Domain Logic & Idempotency Check"]
    TxBoundary["ACID Transaction Boundary (runInTransaction)"]
    PgLocks["PostgreSQL Row Locks (SELECT ... FOR UPDATE)"]
    PgTables["PostgreSQL Schema & Constraints (users, transactions)"]
    PgTrigger["PostgreSQL Trigger (enforce_transactions_immutable)"]

    Client -->|HTTP Request with JWT Cookie| NextJS
    NextJS --> Middleware
    Middleware -->|Attach X-Request-ID| API
    API --> Service
    Service --> TxBoundary
    TxBoundary -->|Deterministic Lock Ordering| PgLocks
    PgLocks -->|Atomic Debit & Credit| PgTables
    TxBoundary -->|Append-Only Ledger Insert| PgTrigger
    PgTrigger -->|Persist Ledger Entry| PgTables
```

---

## 2. Request Lifecycle & Layer Breakdown

### Layer 1: Edge Middleware (`app/middleware.ts`)
1. **Request Correlation**: Generates or preserves an incoming `X-Request-ID` UUID and propagates it through request headers and response headers.
2. **Rate Limiting**: Integrated with `@upstash/ratelimit` when Redis credentials are provided; falls back gracefully if unconfigured.
3. **Authentication Guard**: Intercepts protected `/api/*` routes, reads HTTP-only JWT auth cookies (`token`), verifies signatures with `verifyToken()`, and rejects unauthorized requests with HTTP 401. Public auth routes (`/api/auth/*`) and health probes (`/api/health`) are whitelisted.
4. **CORS & Preflight Handling**: Intercepts `OPTIONS` requests, returning HTTP 204 with strict origin, method, and header whitelists.

### Layer 2: API Route Handlers (`app/api/*`)
- **Input Validation**: Validates user inputs with Zod schemas and utility guards (`isValidPhone`, `isValidAmount`, `isValidPassword`).
- **Identity Derivation**: Extracts the authenticated user ID strictly from the verified JWT payload (`decoded.userId`). Client-provided IDs in request bodies are ignored for authorization decisions.
- **Intent-Based Idempotency**: Prior to initiating transactional mutations, checks whether an idempotency key exists in the database. Returns the cached success representation if intent matches, or HTTP 409 Conflict if parameters differ.

### Layer 3: Financial Transaction Engine (`app/config/database.ts`)
- **Managed ACID Boundary**: Encapsulates operations inside `runInTransaction(async (client) => { ... })` using explicit `BEGIN`, `COMMIT`, and `ROLLBACK` handling.
- **Deterministic Row Locking**: Sorts sender and receiver UUIDs lexicographically before acquiring row locks (`SELECT "_id" FROM users WHERE ... ORDER BY "_id" FOR UPDATE`) to eliminate circular wait deadlocks on concurrent bidirectional transfers ($A \rightarrow B$ vs $B \rightarrow A$).
- **Atomic Balance Updates**: Applies conditional SQL balance deductions (`WHERE "_id" = $1 AND balance >= $2`) and recipient additions, guaranteeing atomic updates without race conditions.
- **Immutable Ledger Recording**: In the same database transaction, inserts an immutable ledger entry with sender, receiver, amount, timestamp, description, status, and idempotency key.

### Layer 4: PostgreSQL Storage & Invariant Enforcement
- **Constraint Guarantees**:
  - `check_user_balance_non_negative`: `CHECK (balance >= 0)`
  - `check_transaction_amount_positive`: `CHECK (amount > 0)`
  - `transactions_idempotency_idx`: `UNIQUE INDEX ("idempotencyKey") WHERE "idempotencyKey" IS NOT NULL`
- **Database Trigger**:
  - `enforce_transactions_immutable`: A PL/pgSQL trigger executing `BEFORE UPDATE OR DELETE ON transactions` that raises an exception, guaranteeing append-only immutability even if application logic were compromised.

---

## 3. Data Flow: Peer-to-Peer Transfer Sequence

```mermaid
sequenceDiagram
    autonumber
    actor UserA as Sender (User A)
    participant Client as Web Client
    participant MW as Middleware
    participant API as Send Route Handler
    participant DB as PostgreSQL (Neon)

    UserA->>Client: Submit transfer (Receiver Phone, Amount, IdempotencyKey)
    Client->>MW: POST /api/transactions/send
    MW->>MW: Generate X-Request-ID & Verify JWT Cookie
    MW->>API: Forward with X-Request-ID & Authenticated Context
    API->>API: Validate input (Amount > 0, Phone format, Self-transfer check)
    API->>DB: Query Idempotency Key
    alt Idempotency Key Exists (Same Intent)
        DB-->>API: Existing Transaction Record
        API-->>Client: 200 OK (Cached Success Result)
    else Idempotency Key Exists (Different Intent)
        DB-->>API: Existing Transaction Record (Mismatched)
        API-->>Client: 409 Conflict (Idempotency Mismatch)
    else New Request
        API->>DB: BEGIN Transaction
        API->>DB: SELECT "_id" FROM users WHERE "_id" IN (A, B) ORDER BY "_id" FOR UPDATE
        Note over API,DB: Deterministic lock order prevents deadlocks
        API->>DB: UPDATE users SET balance = balance - X WHERE "_id" = A AND balance >= X
        alt Insufficient Balance (rowCount = 0)
            API->>DB: ROLLBACK
            API-->>Client: 400 Bad Request (Insufficient Balance)
        else Sufficient Balance
            API->>DB: UPDATE users SET balance = balance + X WHERE "_id" = B
            API->>DB: INSERT INTO transactions (senderId, receiverId, amount, ...)
            API->>DB: COMMIT
            API-->>Client: 200 OK (Transfer Successful)
        end
    end
```

---

## 4. Key Architectural Trade-offs

1. **Monolithic Next.js App Router vs Microservices**:
   - *Decision*: Co-locate API routes, server actions, and UI in Next.js.
   - *Rationale*: Eliminates distributed transaction complexity (two-phase commit / saga orchestration), network hops, and operational overhead while maintaining clear layered separation.
2. **PostgreSQL Row Locks vs Application-Level Mutexes**:
   - *Decision*: Rely on PostgreSQL `FOR UPDATE` row locks with deterministic sorting.
   - *Rationale*: Serverless / multi-instance web deployments render in-memory Node.js mutexes ineffective across processes. PostgreSQL provides atomic, distributed coordination natively.
3. **Database-Level Immutability Trigger vs Application Guard**:
   - *Decision*: Enforce immutable ledger with a PL/pgSQL trigger on the database table.
   - *Rationale*: Guarantees that no raw query, developer error, or compromised server action can alter or delete ledger entries.
