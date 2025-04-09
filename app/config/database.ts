import { MongoClient, MongoClientOptions, Document } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not set")
}

// Database configuration
export const DB_CONFIG = {
  uri: process.env.MONGODB_URI,
  options: {
    maxPoolSize: 10,
    minPoolSize: 2,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 30000,
    serverSelectionTimeoutMS: 10000,
    retryWrites: true,
    w: "majority",
    ssl: true,
    tls: true,
    tlsAllowInvalidCertificates: true,
    serverApi: {
      version: '1',
      strict: true,
      deprecationErrors: true,
    }
  } as MongoClientOptions,
}

// Transaction types
export enum TransactionType {
  ADD = "add",
  TRANSFER = "transfer",
  WITHDRAW = "withdraw",
}

// Database collections
export const COLLECTIONS = {
  USERS: "users",
  TRANSACTIONS: "transactions",
} as const

let client: MongoClient | null = null
let clientPromise: Promise<MongoClient> | null = null

export async function getMongoClient() {
  if (clientPromise) {
    try {
      const client = await clientPromise;
      await client.db().command({ ping: 1 });
      return clientPromise;
    } catch (error) {
      console.error("Connection check failed, reconnecting...", error);
      client = null;
      clientPromise = null;
    }
  }

  try {
    client = new MongoClient(DB_CONFIG.uri, DB_CONFIG.options);
    clientPromise = client.connect();
    return clientPromise;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw new Error("Failed to connect to database");
  }
}

export async function closeMongoClient() {
  if (client) {
    try {
      await client.close()
      client = null
      clientPromise = null
    } catch (error) {
      console.error("Failed to close MongoDB connection:", error)
    }
  }
}

// Get database instance
export function getDatabase(client: MongoClient) {
  return client.db()
}

// Get collection
export function getCollection<T extends Document>(client: MongoClient, collectionName: string) {
  return client.db().collection<T>(collectionName)
} 