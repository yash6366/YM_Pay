export const AUTH_COOKIE_NAME = "token"
export const JWT_EXPIRES_IN = "7d"
export const DEV_JWT_SECRET = "ym-pay-dev-secret-key"

export function getJwtSecret() {
  const configuredSecret = process.env.JWT_SECRET?.trim()

  if (configuredSecret) {
    return configuredSecret
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET is required in production")
  }

  return DEV_JWT_SECRET
}

export function getAuthCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production"

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  }
}

export function clearAuthCookie() {
  return {
    ...getAuthCookieOptions(),
    maxAge: 0,
  }
}
