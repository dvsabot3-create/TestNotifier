require('dotenv').config({ path: '.env.local' });

console.log('Testing Authentication Setup...\n');

// Test JWT secret
if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET not found in environment');
  process.exit(1);
}
console.log('✅ JWT_SECRET found');

// Test Google OAuth config
if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
  console.warn('⚠️  GOOGLE_CLIENT_ID needs to be set to actual value');
} else {
  console.log('✅ GOOGLE_CLIENT_ID configured');
}

if (!process.env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET === 'YOUR_GOOGLE_CLIENT_SECRET_HERE') {
  console.warn('⚠️  GOOGLE_CLIENT_SECRET needs to be set to actual value');
} else {
  console.log('✅ GOOGLE_CLIENT_SECRET configured');
}

// Test MongoDB connection string
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment');
  process.exit(1);
}
console.log('✅ DATABASE_URL found:', process.env.DATABASE_URL);

// Test basic auth server import
try {
  const authModule = require('./api/auth/index.js');
  console.log('✅ Authentication module loads successfully');
} catch (error) {
  console.error('❌ Authentication module failed to load:', error.message);
}

console.log('\n✅ Authentication environment test completed');
console.log('');
console.log('🎯 NEXT STEPS:');
console.log('1. Set up Google OAuth credentials per SET_UP_GOOGLE_OAUTH.md');
console.log('2. Update GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local');
console.log('3. Ensure MongoDB is accessible at DATABASE_URL');
console.log('4. Run: npm run dev to start the server');