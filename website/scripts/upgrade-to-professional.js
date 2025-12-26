/**
 * TESTING ONLY: Upgrade a user to Professional tier
 * Run: node scripts/upgrade-to-professional.js your-email@example.com
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function upgradeUser(email) {
  if (!email) {
    console.error('❌ Please provide an email address');
    console.log('Usage: node scripts/upgrade-to-professional.js your-email@example.com');
    process.exit(1);
  }

  const mongoUri = process.env.MONGODB_URI || process.env.DATABASE_URL;
  
  if (!mongoUri) {
    console.error('❌ No MongoDB connection string found');
    console.log('Make sure MONGODB_URI is set in your .env file');
    process.exit(1);
  }

  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Find the user
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.error(`❌ User not found: ${email}`);
      console.log('\nExisting users:');
      const users = await User.find({}, 'email firstName lastName subscription.tier').limit(10);
      users.forEach(u => console.log(`  - ${u.email} (${u.subscription?.tier || 'free'})`));
      process.exit(1);
    }

    console.log(`\n📧 Found user: ${user.firstName} ${user.lastName} (${user.email})`);
    console.log(`   Current tier: ${user.subscription?.tier || 'free'}`);
    console.log(`   Current status: ${user.subscription?.status || 'inactive'}`);

    // Upgrade to Professional
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1); // 1 year from now

    user.subscription = {
      tier: 'professional',
      status: 'active',
      currentPeriodStart: new Date(),
      currentPeriodEnd: futureDate,
      cancelAtPeriodEnd: false
    };

    await user.save();

    console.log('\n✅ USER UPGRADED TO PROFESSIONAL!');
    console.log(`   New tier: ${user.subscription.tier}`);
    console.log(`   New status: ${user.subscription.status}`);
    console.log(`   Valid until: ${futureDate.toLocaleDateString()}`);
    console.log('\n🎉 You now have access to ALL features:');
    console.log('   - Unlimited monitors (20 pupils)');
    console.log('   - Unlimited test centres');
    console.log('   - Unlimited auto-rebooks');
    console.log('   - SMS, Email & WhatsApp notifications');
    console.log('   - Stealth mode');
    console.log('   - ADI Instructor features');
    console.log('\n⚠️  Remember to sign out and sign back in on the website/extension!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Get email from command line argument
const email = process.argv[2];
upgradeUser(email);
