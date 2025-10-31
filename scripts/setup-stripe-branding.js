// Script to set up Stripe Checkout branding programmatically
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY?.trim());

async function setupStripeBranding() {
  console.log('🎨 Setting up Stripe Checkout Branding...\n');

  try {
    // Update branding settings
    const branding = await stripe.settings.branding.update({
      logo_url: 'https://testnotifier.co.uk/assets/logos/tn-logov2.png',
      primary_color: '#1d70b8', // Navy blue matching website
      background_color: '#ffffff', // White background
    });

    console.log('✅ Branding settings updated:');
    console.log(`   Logo: ${branding.logo_url}`);
    console.log(`   Primary Color: ${branding.primary_color}`);
    console.log(`   Background Color: ${branding.background_color}`);

    // Update payment settings
    const paymentSettings = await stripe.settings.payments.update({
      statement_descriptor: 'TESTNOTIFIER',
      statement_descriptor_prefix: 'TestNotifier',
    });

    console.log('\n✅ Payment settings updated:');
    console.log(`   Statement Descriptor: ${paymentSettings.statement_descriptor}`);

    // Set custom footer text
    const preferences = await stripe.terminal.readers.settings.update({
      branding: {
        primary_color: '#1d70b8',
      },
    });

    console.log('\n🎉 Stripe Checkout Branding Setup Complete!');
    console.log('\n📋 Summary:');
    console.log('   - Logo: TestNotifier logo');
    console.log('   - Primary Color: Navy Blue (#1d70b8)');
    console.log('   - Background: White (#ffffff)');
    console.log('   - Statement Descriptor: TestNotifier');
    console.log('\n✅ Your checkout page will now match your website branding!');

  } catch (error) {
    console.error('❌ Error setting up branding:', error.message);
    
    if (error.code === 'settings_parameter_invalid') {
      console.error('\n💡 Make sure:');
      console.error('   1. Logo is hosted on a publicly accessible HTTPS URL');
      console.error('   2. Logo is at least 128x128px');
      console.error('   3. Logo format is PNG with transparency');
      console.error('\n📝 Alternative: Set up branding manually in Stripe Dashboard:');
      console.error('   Dashboard > Settings > Payment Settings > Branding');
    }
    
    throw error;
  }
}

// Run the setup
setupStripeBranding()
  .then(() => {
    console.log('\n✨ Branding setup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Branding setup failed:', error);
    process.exit(1);
  });


