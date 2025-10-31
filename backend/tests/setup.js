const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.PORT = 5002;
process.env.JWT_SECRET = 'test-jwt-secret-key-123456789';
process.env.JWT_EXPIRE = '1h';
process.env.CLIENT_URL = 'http://localhost:5173';
process.env.EMAIL_FROM = 'hello@testnotifier.co.uk';

// Global test setup
beforeAll(async () => {
  // Start in-memory MongoDB instance
  try {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    process.env.MONGODB_URI = mongoUri;

    await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected to in-memory test database');
  } catch (error) {
    console.error('❌ Failed to connect to test database:', error);
    throw error;
  }
});

beforeEach(async () => {
  // Clear all collections before each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  // Clean up and close database connection
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
  console.log('✅ Test database connection closed');
});

// Global error handler for unhandled promises
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};