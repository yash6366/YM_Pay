import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Set to store used IDs to ensure uniqueness
const usedUpiIds = new Set<string>()
const usedPaymentIds = new Set<string>()

export function generateUpiTransactionId(): string {
  const prefix = "UPI"
  const timestamp = Date.now().toString().slice(-8)
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  const uniqueId = Math.random().toString(36).substring(2, 6).toUpperCase()
  
  return `${prefix}${timestamp}${randomNum}${uniqueId}`
}

export function generatePaymentId(): string {
  const prefix = "PAY"
  const timestamp = Date.now().toString().slice(-6)
  const randomNum = Math.floor(Math.random() * 100000).toString().padStart(5, '0')
  const uniqueId = Math.random().toString(36).substring(2, 6).toUpperCase()
  
  return `${prefix}${timestamp}${randomNum}${uniqueId}`
}
