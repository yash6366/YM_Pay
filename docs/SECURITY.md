# YM-Pay Security Architecture & Threat Model

## 1. Threat Model & Security Posture

YM-Pay is designed with defensive programming principles to protect financial assets, identity, and transaction data against common web and payment application threats.

| Threat / Attack Vector | Mitigation Strategy in YM-Pay | Status |
|---|---|---|
| **Insecure Direct Object Reference (IDOR)** | Authenticated user ID is strictly extracted from verified JWT cookie (`decoded.userId`). Client-provided IDs in payloads are ignored. | **Implemented** |
| **Sensitive Data Exposure / Credential Leak** | User projection sanitization ensures password hashes, salts, and internal timestamps are never returned in API responses or server actions. | **Implemented (SEC-01)** |
| **SQL Injection** | All dynamic SQL queries in financial transaction paths use parameterized inputs (`$1, $2, ...`). | **Implemented** |
| **Replay & Double-Spend Attacks** | Database-backed partial unique idempotency index + intent conflict detection (HTTP 409). | **Implemented** |
| **Credential Brute Force / Flooding** | Sliding window rate limiting in middleware via `@upstash/ratelimit` with IP-based throttling. | **Implemented** |
| **Session Hijacking / XSS Token Theft** | JWTs are transported exclusively via `HttpOnly`, `SameSite=Lax`, `Secure` (in production) cookies. | **Implemented** |
| **Cross-Site Request Forgery (CSRF)** | `SameSite=Lax` cookie configuration, JSON-only POST mutations, and origin verification. | **Implemented** |

---

## 2. Authentication & Credential Management

### 2.1 Password Security
- **Hashing Algorithm**: `bcryptjs` with 10 salt rounds.
- **Complexity Requirements**: Minimum 8 characters, requiring at least one uppercase letter, one lowercase letter, one numeric digit, and one special character (`/[^A-Za-z0-9]/`).

### 2.2 JWT Session Management
- **Payload**: Contains only `{ userId: string }`.
- **Signature Secret**: Controlled via `getJwtSecret()`. In `production`, requires `JWT_SECRET` environment variable; throws startup exception if missing. In development/test, provides fallback.
- **Cookie Security Configuration**:
  ```typescript
  {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  }
  ```

---

## 3. Authorization & IDOR Defense

In all state-modifying endpoints (`/api/transactions/send`, `/api/transactions/add-money`, `/api/transactions/recharge`, `/api/user/update`):
1. The user identity is extracted directly from the verified JWT payload (`decoded.userId`).
2. The user cannot manipulate their own balance or debit other accounts by supplying foreign user IDs in the request body.
3. Transaction history queries (`GET /api/transactions`) filter transactions where `senderId = decoded.userId OR receiverId = decoded.userId`, preventing horizontal privilege escalation.

---

## 4. Sensitive Field Sanitization (SEC-01)

Previous revisions of transaction endpoints queried `users` without explicit projection, potentially including password hashes in responses.

*Remediation*:
All API routes and server actions mapping user details explicitly sanitize records:
```typescript
const sanitizedUser = {
  id: user._id.toString(),
  firstName: user.firstName,
  lastName: user.lastName,
  phone: user.phone,
}
```
Password hashes, session tokens, and database credentials are mathematically impossible to reach the JSON response body.

---

## 5. Observability & Request Correlation

The middleware assigns an `X-Request-ID` to each incoming request. If an error occurs, the request ID provides a correlation handle for server logs without leaking internal query details or stack traces to the client:
```json
{
  "message": "Database is temporarily unavailable. Please ensure your Neon database URL is valid and accessible.",
  "error": "Database is temporarily unavailable. Please ensure your Neon database URL is valid and accessible."
}
```

---

## 6. Security Boundaries & Limitations

### Implemented Controls
- Parameterized SQL execution
- Cryptographic password hashing (Bcrypt)
- JWT signature verification
- HTTP-only cookie transport
- Safe error handling & data sanitization
- Database constraint boundaries

### Out of Scope / Real-World Production Gaps
- **Hardware Security Modules (HSM) / KMS**: In a production banking environment, encryption keys and JWT secrets would be backed by Cloud KMS or Vault.
- **2FA / MFA**: Multi-factor authentication (SMS OTP / TOTP) before high-value transactions.
- **PCI DSS Level 1 Scope**: YM-Pay models wallet transfers and bill recharge metadata; it does not store or process raw 16-digit primary account numbers (PAN) or CVVs.
