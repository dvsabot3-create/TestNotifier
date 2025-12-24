const mongoose = require('mongoose');

let isConnected = false;
let eventListenersRegistered = false;

/**
 * Register event listeners once per application lifecycle
 * This prevents memory leaks from duplicate listeners
 */
function registerEventListeners() {
  if (eventListenersRegistered) {
    return; // Listeners already registered, skip
  }

  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
    isConnected = false;
  });

  mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB disconnected');
    isConnected = false;
  });

  mongoose.connection.on('reconnected', () => {
    console.log('✅ MongoDB reconnected');
    isConnected = true;
  });

  eventListenersRegistered = true;
}

async function connectDatabase() {
  // Check actual mongoose connection state, not just our flag
  const connectionState = mongoose.connection.readyState;
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  
  if (connectionState === 1) {
    // Already connected
    isConnected = true;
    // Ensure event listeners are registered even if already connected
    registerEventListeners();
    return;
  }

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not set in environment variables');
    throw new Error('DATABASE_URL is required');
  }

  // If connecting or disconnecting, wait a bit
  if (connectionState === 2 || connectionState === 3) {
    console.log('⏳ Database connection in progress, waiting...');
    // Wait longer and check multiple times to avoid race conditions
    for (let i = 0; i < 5; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (mongoose.connection.readyState === 1) {
        isConnected = true;
        registerEventListeners();
        return;
      }
    }
    // If still connecting after 2.5 seconds, proceed with new connection attempt
    // This handles cases where the connection is stuck
  }

  try {
    console.log('🔌 Connecting to database...');
    
    // Register event listeners BEFORE connecting
    // This ensures they're set up before any connection events fire
    registerEventListeners();
    
    await mongoose.connect(process.env.DATABASE_URL, {
      serverSelectionTimeoutMS: 10000, // Increased timeout
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    console.log('✅ Database connected successfully');

  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.error('❌ Error details:', {
      name: error.name,
      message: error.message,
      code: error.code
    });
    isConnected = false;
    throw error;
  }
}

const getConnectionStatus = () => isConnected;

module.exports = {
  connectDatabase,
  getConnectionStatus
};

