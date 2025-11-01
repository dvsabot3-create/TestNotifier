#!/usr/bin/env node

/**
 * DNS Status Checker for Cloudflare Transfer
 * Monitors DNS propagation and SSL certificate status
 */

const { exec } = require('child_process');

const domains = [
  'testnotifier.co.uk',
  'www.testnotifier.co.uk'
];

console.log('🔍 Monitoring DNS transfer and SSL status...\n');

function checkDNS() {
  console.log(`⏰ Checking DNS status at: ${new Date().toISOString()}`);

  for (const domain of domains) {
    console.log(`\n📊 Checking: ${domain}`);

    // Check DNS resolution
    exec(`dig ${domain} +short`, (error, stdout, stderr) => {
      if (error) {
        console.log(`   ❌ DNS Error: ${error.message}`);
        return;
      }

      const ips = stdout.trim().split('\n').filter(ip => ip);
      console.log(`   📍 IPs: ${ips.join(', ')}`);

      // Check if pointing to Render
      const hasRenderIP = ips.includes('216.24.57.1');
      if (hasRenderIP) {
        console.log(`   ✅ Points to Render IP`);
      } else {
        console.log(`   ⚠️  Not pointing to Render yet`);
      }
    });

    // Check HTTPS connection
    setTimeout(() => {
      exec(`curl -I https://${domain}/health 2>&1`, (error, stdout, stderr) => {
        if (error) {
          if (error.message.includes('SSL')) {
            console.log(`   🔒 SSL Error: Certificate still provisioning`);
          } else {
            console.log(`   ❌ Connection Error: ${error.message}`);
          }
          return;
        }

        const status = stdout.split('\n')[0];
        console.log(`   🔍 HTTPS Status: ${status}`);

        if (stdout.includes('200')) {
          console.log(`   ✅ HTTPS Working!`);
        } else if (stdout.includes('301') || stdout.includes('302')) {
          console.log(`   ✅ Redirects working`);
        }
      });
    }, 2000);
  }
}

// Run initial check
checkDNS();

// Run checks every 2 minutes
setInterval(checkDNS, 120000);

console.log('\n🔄 Monitoring will continue every 2 minutes...');
console.log('Press Ctrl+C to stop monitoring\n');