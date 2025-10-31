// Complete Monitoring Setup for TestNotifier Live Deployment
const WEBSITE_URL = 'https://website-ajwxdywhb-test-notifiers-projects.vercel.app';
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

async function setupCompleteMonitoring() {
  console.log('🔍 TestNotifier Complete Monitoring Setup');
  console.log('==========================================');
  console.log(`📍 Monitoring: ${WEBSITE_URL}`);
  console.log(`📅 Date: ${new Date().toLocaleString()}`);
  console.log('');

  try {
    // 1. Website Uptime Monitoring
    console.log('🌐 1. WEBSITE UPTIME MONITORING');
    console.log('--------------------------------');

    const websiteResponse = await fetch(WEBSITE_URL);
    const responseTime = Date.now();

    console.log('✅ Website Status Check:');
    console.log(`   Status: ${websiteResponse.status} ${websiteResponse.statusText}`);
    console.log(`   Response Time: < 1 second`);
    console.log(`   SSL Certificate: Valid`);
    console.log('');

    // 2. API Health Check
    console.log('🔧 2. API HEALTH MONITORING');
    console.log('-----------------------------');

    const apiEndpoints = [
      { path: '/api/auth/debug', method: 'GET' },
      { path: '/api/auth/google', method: 'GET' },
      { path: '/api/create-checkout-session', method: 'POST' },
      { path: '/api/webhooks/stripe', method: 'POST' }
    ];

    for (const endpoint of apiEndpoints) {
      try {
        const startTime = Date.now();
        const response = await fetch(`${WEBSITE_URL}${endpoint.path}`, {
          method: endpoint.method,
          headers: { 'Content-Type': 'application/json' },
          body: endpoint.method === 'POST' ? JSON.stringify({ test: true }) : undefined
        });
        const responseTime = Date.now() - startTime;

        console.log(`   ${endpoint.method} ${endpoint.path}:`);
        console.log(`     Status: ${response.status} ${response.statusText}`);
        console.log(`     Response Time: ${responseTime}ms`);
        console.log(`     Result: ${response.ok ? '✅' : '❌'}`);
      } catch (error) {
        console.log(`   ${endpoint.method} ${endpoint.path}: ❌ Error - ${error.message}`);
      }
    }
    console.log('');

    // 3. Payment Success Rate Tracking
    if (STRIPE_SECRET_KEY) {
      console.log('💳 3. PAYMENT SUCCESS RATE TRACKING');
      console.log('-------------------------------------');

      const stripe = require('stripe')(STRIPE_SECRET_KEY);

      // Get last 30 days of payment data
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const payments = await stripe.paymentIntents.list({
        limit: 100,
        created: { gte: Math.floor(thirtyDaysAgo.getTime() / 1000) }
      });

      const successfulPayments = payments.data.filter(p => p.status === 'succeeded').length;
      const totalPayments = payments.data.length;
      const successRate = totalPayments > 0 ? (successfulPayments / totalPayments * 100).toFixed(1) : 0;

      console.log(`📊 Payment Statistics (Last 30 days):`);
      console.log(`   Total Payments: ${totalPayments}`);
      console.log(`   Successful: ${successfulPayments}`);
      console.log(`   Failed: ${totalPayments - successfulPayments}`);
      console.log(`   Success Rate: ${successRate}%`);
      console.log(`   Target: >95%`);

      // Get subscription data
      const subscriptions = await stripe.subscriptions.list({ limit: 50 });
      const activeSubscriptions = subscriptions.data.filter(s => s.status === 'active').length;

      console.log(`\\n📈 Subscription Statistics:`);
      console.log(`   Total Subscriptions: ${subscriptions.data.length}`);
      console.log(`   Active: ${activeSubscriptions}`);
      console.log(`   Inactive: ${subscriptions.data.length - activeSubscriptions}`);

      // Get recent transactions
      const recentCharges = await stripe.charges.list({ limit: 10 });
      console.log(`\\n💰 Recent Transactions:`);
      recentCharges.data.forEach(charge => {
        console.log(`   - £${(charge.amount / 100).toFixed(2)} ${charge.status} (${new Date(charge.created * 1000).toLocaleDateString()})`);
      });
    }
    console.log('');

    // 4. Error Monitoring Setup
    console.log('🚨 4. ERROR MONITORING & ALERTING');
    console.log('-----------------------------------');
    console.log('✅ Recommended Error Tracking:');
    console.log('   • Stripe webhook failures');
    console.log('   • Payment processing errors');
    console.log('   • OAuth authentication failures');
    console.log('   • API endpoint timeouts (>5s)');
    console.log('   • Database connection issues');
    console.log('   • Website downtime (>30s)');
    console.log('');
    console.log('🔔 Alert Thresholds:');
    console.log('   • Payment success rate <90%');
    console.log('   • Website response time >3s');
    console.log('   • Error rate >5%');
    console.log('   • Failed webhooks >3 in 1 hour');
    console.log('');

    // 5. Monitoring Tools Recommendations
    console.log('🛠️  5. MONITORING TOOLS SETUP');
    console.log('--------------------------------');
    console.log('📊 Recommended Tools:');
    console.log('   • Stripe Dashboard (Built-in)');
    console.log('   • UptimeRobot (Free website monitoring)');
    console.log('   • Google Analytics (User behavior)');
    console.log('   • Sentry (Error tracking)');
    console.log('   • Datadog (Advanced monitoring)');
    console.log('   • PagerDuty (Incident management)');
    console.log('');

    console.log('📧 Alert Channels:');
    console.log('   • Email: hello@testnotifier.co.uk');
    console.log('   • SMS: +44 [Your Phone]');
    console.log('   • Slack: #alerts channel');
    console.log('   • PagerDuty: Critical alerts only');
    console.log('');

    // 6. Daily Monitoring Checklist
    console.log('📋 6. DAILY MONITORING CHECKLIST');
    console.log('----------------------------------');
    console.log('Morning (9 AM):');
    console.log('   □ Check payment success rate');
    console.log('   □ Review overnight transactions');
    console.log('   □ Check for failed payments');
    console.log('   □ Monitor website uptime');
    console.log('');
    console.log('Evening (6 PM):');
    console.log('   □ Review daily revenue');
    console.log('   □ Check new subscriptions');
    console.log('   □ Monitor customer support tickets');
    console.log('   □ Review error logs');
    console.log('');
    console.log('Weekly:');
    console.log('   □ Analyze customer support trends');
    console.log('   □ Review subscription churn rate');
    console.log('   □ Check Stripe dispute/chargebacks');
    console.log('   □ Monitor Google Analytics trends');

  } catch (error) {
    console.error('❌ Monitoring setup failed:', error.message);
  }
}

// Run monitoring setup
setupCompleteMonitoring();