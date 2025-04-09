const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("MONGODB_URI environment variable is not set");
  process.exit(1);
}

async function createTestTransactions() {
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
    const transactions = database.collection("transactions");
    const users = database.collection("users");

    // Get test user
    const testUser = await users.findOne({ phone: "1234567890" });
    if (!testUser) {
      console.error("Test user not found. Please run create-test-user.js first.");
      return;
    }

    // Create test transactions
    const testTransactions = [
      {
        type: "add",
        amount: 1000,
        description: "Initial balance",
        senderId: "system",
        receiverId: testUser._id.toString(),
        timestamp: new Date(),
      },
      {
        type: "transfer",
        amount: 500,
        description: "Payment to merchant",
        senderId: testUser._id.toString(),
        receiverId: "system",
        timestamp: new Date(),
      },
      {
        type: "withdraw",
        amount: 200,
        description: "ATM withdrawal",
        senderId: testUser._id.toString(),
        receiverId: "system",
        timestamp: new Date(),
      },
    ];

    // Insert transactions
    const result = await transactions.insertMany(testTransactions);
    console.log(`${result.insertedCount} test transactions created successfully!`);

  } catch (error) {
    console.error("Error creating test transactions:", error);
  } finally {
    await client.close();
    console.log("MongoDB connection closed");
  }
}

createTestTransactions(); 