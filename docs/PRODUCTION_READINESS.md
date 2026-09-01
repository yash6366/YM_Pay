# YM-Pay Production Readiness & Boundary Analysis

## 1. Executive Statement

YM-Pay is an interview-ready, production-quality digital wallet engineering demonstration. It demonstrates core payment system engineering: ACID transaction design, deterministic row locking, database-backed idempotency, database-level ledger immutability triggers, and defensive security.

To maintain engineering integrity, this document explicitly delineates what is implemented and verified versus what real-world regulatory and external rail integrations would require.

---

## 2. Capability Matrix

### 2.1 Implemented & Verified
- **ACID Transaction Boundaries**: Atomic balance debit and credit via `runInTransaction`.
- **Concurrency & Double-Spend Protection**: Row-level locking (`SELECT ... FOR UPDATE`) preventing concurrent overdraft.
- **Deadlock Prevention**: Lexicographical UUID sorting order for bidirectional transfers.
- **Database Constraints**: Non-negative balance (`CHECK (balance >= 0)`) and positive amount (`CHECK (amount > 0)`).
- **Immutable Financial Ledger**: PostgreSQL trigger blocking `UPDATE` and `DELETE` on ledger table.
- **Database-Backed Idempotency**: Partial unique index on `"idempotencyKey"` with intent comparison.
- **Security Defenses**: Bcrypt password hashing, JWT stateless authentication, HTTP-only cookie transport, sanitized user projections (SEC-01), parameterized SQL queries.
- **Health & Readiness Monitoring**: `/api/health` endpoint measuring database latency and readiness status.
- **Request Correlation**: Distributed `X-Request-ID` propagation across middleware and responses.

### 2.2 Out of Scope / Real-World Production Gaps

| Production Requirement | Real-World Financial Need | How it Differs from YM-Pay |
|---|---|---|
| **KYC / AML (Know Your Customer / Anti-Money Laundering)** | Legal requirement to verify customer identity (government ID, passport, Aadhaar, SSN) and screen against sanctions lists (OFAC). | YM-Pay uses simple phone/email signup without third-party identity verification vendors (e.g. Persona, Trulioo). |
| **External Payment Rails (UPI / IMPS / ACH / SEPA / FedNow)** | Real-world money movement between external banks and settlement clearinghouses. | YM-Pay models an internal closed-loop wallet ledger where value transfers between internal accounts. |
| **PCI DSS Level 1 Compliance** | Strict security compliance required when storing, processing, or transmitting primary card account numbers (PAN). | YM-Pay delegates payment methods to simulated channels and does not store raw card numbers. |
| **Two-Phase Commit & Asynchronous Settlement** | Multi-party clearing where transactions transition from `AUTHORIZED` $\rightarrow$ `CAPTURED` $\rightarrow$ `SETTLED`. | YM-Pay transactions execute synchronously in a single PostgreSQL database instance. |
| **Automated Daily Reconciliation** | Ingestion of end-of-day bank settlement files to verify that internal ledger balances match physical bank reserve accounts. | Closed-loop ledger; no external bank statement reconciliation pipeline. |
| **Real-Time Fraud & Anomaly Detection** | Rule engines (e.g. Radar, Sift) analyzing velocity, device fingerprinting, geolocation anomalies, and behavioral risk scores. | Basic sliding-window rate limiting; no machine-learning fraud scoring. |
| **Hardware Security Modules (HSM)** | FIPS 140-2 Level 3 physical HSMs storing master encryption keys and PIN blocks. | Software environment variables (`JWT_SECRET`). |
