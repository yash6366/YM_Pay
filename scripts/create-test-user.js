const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// MongoDB connection string from environment variable
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("MONGODB_URI environment variable is not set");
  process.exit(1);
}

// Test user details
const testUser = {
  firstName: "Test",
  lastName: "User",
  phone: "1234567890",
  password: "Test@123",
  balance: 1000,
  createdAt: new Date(),
  updatedAt: new Date()
};

async function createTestUser() {
  const client = new MongoClient(uri, {
    ssl: true,
    tls: true,
    tlsAllowInvalidCertificates: true,
    serverApi: {
      version: '1',
      strict: true,
      deprecationErrors: true,
    }
  });
  
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    
    const database = client.db();
    const users = database.collection("users");
    
    // Check if user already exists
    const existingUser = await users.findOne({ phone: testUser.phone });
    if (existingUser) {
      console.log("Test user already exists with phone:", testUser.phone);
      return;
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    
    // Create the user
    const result = await users.insertOne({
      ...testUser,
      password: hashedPassword,
      _id: new ObjectId()
    });
    
    console.log("Test user created successfully!");
    console.log("Login credentials:");
    console.log("Phone:", testUser.phone);
    console.log("Password:", testUser.password);
    
  } catch (error) {
    console.error("Error creating test user:", error);
  } finally {
    await client.close();
    console.log("MongoDB connection closed");
  }
}

createTestUser(); 