import { Document, ObjectId } from "mongodb"
import { TransactionType } from "../config/database"

// User interface
export interface User extends Document {
  _id: ObjectId
  firstName: string
  lastName: string
  phone: string
  password: string
  balance: number
  createdAt: Date
  updatedAt: Date
}

// Transaction interface
export interface Transaction extends Document {
  _id: ObjectId
  senderId: string
  receiverId: string
  amount: number
  timestamp: Date
  description: string
  type: TransactionType
}

// API Response interfaces
export interface ApiResponse<T = any> {
  message: string
  data?: T
  error?: string
}

export interface LoginResponse {
  token: string
  user: {
    id: string
    firstName: string
    lastName: string
    phone: string
    balance: number
  }
}

export interface TransactionResponse {
  transactionId: string
  amount: number
  type: TransactionType
  timestamp: Date
}

// Request interfaces
export interface LoginRequest {
  phone: string
  password: string
}

export interface SignupRequest {
  firstName: string
  lastName: string
  phone: string
  password: string
}

export interface TransactionRequest {
  amount: number
  description?: string
}

export interface SendMoneyRequest extends TransactionRequest {
  receiverPhone: string
} 