const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'http://localhost:3000/api';

// Test data
const TEST_USER = {
  firstName: 'Test',
  lastName: 'User',
  phone: '1234567890',
  password: 'Test@123' // This meets the password requirements
};

const TEST_TRANSACTIONS = [
  {
    type: 'transfer',
    amount: 100,
    description: 'Test transfer transaction',
    receiverId: 'system'
  },
  {
    type: 'deposit',
    amount: 500,
    description: 'Test deposit transaction',
    receiverId: 'system'
  },
  {
    type: 'withdrawal',
    amount: 200,
    description: 'Test withdrawal transaction',
    receiverId: 'system'
  }
];

// Helper function to wait
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to check server availability
async function checkServerAvailability() {
  try {
    await axios.get(BASE_URL);
    return true;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('\n❌ Server is not running. Please start the server with:');
      console.error('npm run dev\n');
      return false;
    }
    return true;
  }
}

async function testAPI() {
  let token = null;
  let userId = null;
  
  try {
    // Check if server is running
    console.log('Checking server availability...');
    const isServerAvailable = await checkServerAvailability();
    if (!isServerAvailable) {
      process.exit(1);
    }

    // Test 1: Signup
    console.log('\n1. Testing signup...');
    try {
      const signupResponse = await axios.post(`${BASE_URL}/auth/signup`, TEST_USER);
      console.log('✅ Signup successful');
    } catch (error) {
      if (error.response && error.response.status === 409) {
        console.log('ℹ️ User already exists, proceeding with login');
      } else {
        console.error('Signup error:', error.response?.data || error.message);
        throw error;
      }
    }

    // Test 2: Login
    console.log('\n2. Testing login...');
    try {
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        phone: TEST_USER.phone,
        password: TEST_USER.password
      });
      
      if (!loginResponse.data.data?.token) {
        throw new Error('Login failed: No token received');
      }
      
      console.log('✅ Login successful');
      token = loginResponse.data.data.token;
      userId = loginResponse.data.data.user.id;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }

    // Test 3: Get user profile
    console.log('\n3. Testing get user profile...');
    try {
      const profileResponse = await axios.get(`${BASE_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!profileResponse.data.data) {
        throw new Error('Profile retrieval failed');
      }
      
      console.log('✅ Profile retrieved successfully');
      console.log('User details:', {
        name: profileResponse.data.data.firstName + ' ' + profileResponse.data.data.lastName,
        phone: profileResponse.data.data.phone,
        balance: profileResponse.data.data.balance
      });
    } catch (error) {
      console.error('Profile error:', error.response?.data || error.message);
      throw error;
    }

    // Test 4: Get transactions
    console.log('\n4. Testing get transactions...');
    try {
      const transactionsResponse = await axios.get(`${BASE_URL}/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!Array.isArray(transactionsResponse.data.data)) {
        throw new Error('Transactions retrieval failed');
      }
      
      console.log(`✅ Retrieved ${transactionsResponse.data.data.length} transactions`);
    } catch (error) {
      console.error('Transactions error:', error.response?.data || error.message);
      throw error;
    }

    // Test 5: Create multiple transactions
    console.log('\n5. Testing create multiple transactions...');
    const createdTransactions = [];
    
    for (const transaction of TEST_TRANSACTIONS) {
      try {
        const response = await axios.post(
          `${BASE_URL}/transactions`,
          transaction,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (!response.data.data?._id) {
          throw new Error(`Transaction creation failed for ${transaction.type}`);
        }
        
        createdTransactions.push(response.data.data);
        console.log(`✅ Created ${transaction.type} transaction: ${response.data.data._id}`);
        
        // Add a small delay between transactions
        await sleep(1000);
      } catch (error) {
        console.error(`❌ Failed to create ${transaction.type} transaction:`, error.response?.data || error.message);
        throw error;
      }
    }

    // Test 6: Get transaction by ID
    console.log('\n6. Testing get transaction by ID...');
    if (createdTransactions.length > 0) {
      const transactionId = createdTransactions[0]._id;
      const singleTransactionResponse = await axios.get(
        `${BASE_URL}/transactions/${transactionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (!singleTransactionResponse.data) {
        throw new Error('Single transaction retrieval failed');
      }
      
      console.log('✅ Retrieved single transaction successfully');
    }

    // Test 7: Error handling - invalid transactions
    console.log('\n7. Testing error handling...');
    const invalidTransactions = [
      { ...TEST_TRANSACTIONS[0], amount: -100 }, // Negative amount
      { ...TEST_TRANSACTIONS[0], amount: 0 }, // Zero amount
      { ...TEST_TRANSACTIONS[0], type: 'invalid_type' }, // Invalid type
      { ...TEST_TRANSACTIONS[0], receiverId: '' } // Empty receiver
    ];

    for (const invalidTx of invalidTransactions) {
      try {
        await axios.post(
          `${BASE_URL}/transactions`,
          invalidTx,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        throw new Error(`Expected error for invalid transaction was not thrown: ${JSON.stringify(invalidTx)}`);
      } catch (error) {
        if (error.response && error.response.status === 400) {
          console.log(`✅ Error handling test passed for: ${JSON.stringify(invalidTx)}`);
        } else {
          throw error;
        }
      }
    }

    // Test 8: Get transactions with filters
    console.log('\n8. Testing get transactions with filters...');
    const filterTests = [
      { type: 'transfer' },
      { type: 'deposit' },
      { type: 'withdrawal' }
    ];

    for (const filter of filterTests) {
      const filteredResponse = await axios.get(
        `${BASE_URL}/transactions?type=${filter.type}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (!Array.isArray(filteredResponse.data)) {
        throw new Error(`Filtered transactions retrieval failed for type: ${filter.type}`);
      }
      
      console.log(`✅ Retrieved ${filteredResponse.data.length} ${filter.type} transactions`);
    }

    console.log('\n🎉 All tests completed successfully!');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Status:', error.response.status);
    }
    if (error.code === 'ECONNREFUSED') {
      console.error('\nMake sure the server is running with:');
      console.error('npm run dev\n');
    }
    process.exit(1);
  }
}

// Run the tests
testAPI(); 