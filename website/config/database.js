const mongoose = require('mongoose');

let isConnected = false;

async function connectDatabase() {
  if (isConnected) {
    console.log('✅ Using existing database connection');
    return;
  }

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not set in environment variables');
    throw new Error('DATABASE_URL is required');
  }

  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    console.log('✅ Database connected successfully');
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
      isConnected = false;
    });

  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

module.exports = { connectDatabase, isConnected: () => isConnected };

