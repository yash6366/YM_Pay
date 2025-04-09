import { z } from 'zod'

// Phone number validation
export const phoneSchema = z
  .string()
  .min(10, 'Phone number must be at least 10 digits')
  .max(15, 'Phone number must not exceed 15 digits')
  .regex(/^\+?[0-9]+$/, 'Phone number must contain only digits')

// Password validation
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')

// Amount validation
export const amountSchema = z
  .number()
  .positive('Amount must be positive')
  .max(1000000, 'Amount must not exceed 1,000,000')

// User validation
export const userSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: phoneSchema,
  password: passwordSchema,
})

// Transaction validation
export const transactionSchema = z.object({
  amount: amountSchema,
  description: z.string().min(1, 'Description is required'),
  receiverId: z.string().min(1, 'Receiver ID is required'),
})

export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.errors[0].message)
    }
    throw error
  }
} 