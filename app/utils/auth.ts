import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { AppError } from './error'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
    return payload
  } catch (error) {
    throw new AppError('Invalid token', 401)
  }
}

export async function getCurrentUser() {
  const token = cookies().get('token')?.value
  if (!token) {
    throw new AppError('Unauthorized', 401)
  }

  try {
    const payload = await verifyToken(token)
    return payload
  } catch (error) {
    throw new AppError('Unauthorized', 401)
  }
}

export function generateToken(userId: string) {
  const payload = {
    userId,
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
  }

  return new TextEncoder().encode(JSON.stringify(payload))
} 