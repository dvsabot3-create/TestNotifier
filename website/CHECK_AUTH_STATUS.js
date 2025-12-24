#!/usr/bin/env node

/**
 * TestNotifier Authentication Status Checker
 * Quick verification of current authentication setup
 */

require('dotenv').config({ path: '.env.local' });
const chalk = require('chalk');

console.log(chalk.cyan.bold('+=========================================+'));
console.log(chalk.cyan.bold('|    AUTHENTICATION STATUS CHECKER        |'));
console.log(chalk.cyan.bold('+=========================================+'));
console.log('');

// Check environment variables
console.log(chalk.blue('🔍 Checking Environment Configuration...'));

const checks = [
  {
    name: 'JWT_SECRET',
    check: () => process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 32,
    message: 'JWT secret properly configured',
    error: 'JWT_SECRET missing or too short'
  },
  {
    name: 'DATABASE_URL',
    check: () => process.env.DATABASE_URL,
    message: 'Database URL configured',
    error: 'DATABASE_URL not set'
  },
  {
    name: 'Google OAuth Ready',
    check: () => process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET &&
             !process.env.GOOGLE_CLIENT_ID.includes('YOUR_') &&
             !process.env.GOOGLE_CLIENT_SECRET.includes('YOUR_'),
    message: 'Google OAuth credentials configured',
    error: 'Google OAuth credentials need actual values'
  },
  {
    name: 'Frontend URLs',
    check: () => process.env.FRONTEND_URL,
    message: 'Frontend URLs configured',
    error: 'FRONTEND_URL not set'
  }
];

let passedChecks = 0;
let totalChecks = checks.length;

checks.forEach(check => {
  const result = check.check();
  if (result) {
    console.log(chalk.green(`✅ ${check.name}: ${check.message}`));
    passedChecks++;
  } else {
    console.log(chalk.red(`❌ ${check.name}: ${check.error}`));
  }
});

// Check authentication module
console.log('');
console.log(chalk.blue('🔌 Testing Authentication Module...'));

try {
  const authModule = require('./api/auth/index.js');
  console.log(chalk.green('✅ Authentication module loads successfully'));
} catch (error) {
  console.log(chalk.red(`❌ Authentication module failed: ${error.message}`));
}

// Check server status
console.log('');
console.log(chalk.blue('🖥️ Checking Server Status...'));

try {
  const http = require('http');
  const options = {
    hostname: 'localhost',
    port: 10000,
    path: '/healthz',
    timeout: 3000
  };

  const req = http.request(options, (res) => {
    console.log(chalk.green(`✅ Server responding (Status: ${res.statusCode})`));
  });

  req.on('error', (err) => {
    console.log(chalk.red('❌ Server not responding'));
    console.log(chalk.yellow('💡 Try running: npm run dev'));
  });

  req.on('timeout', () => {
    console.log(chalk.red('❌ Server timeout'));
  });

  req.end();
} catch (error) {
  console.log(chalk.red(`❌ Server check failed: ${error.message}`));
}

// Summary
console.log('');
console.log(chalk.cyan('📋 STATUS SUMMARY'));
console.log(`Authentication: ${passedChecks}/${totalChecks} checks passed`);

if (passedChecks === totalChecks) {
  console.log(chalk.green.bold('\n🎉 AUTHENTICATION SYSTEM READY FOR TESTING!'));
  console.log(chalk.green('Server is configured and ready for OAuth setup.'));
  console.log(chalk.yellow('Next: Complete Google OAuth setup per GOOGLE_OAUTH_SETUP_EXACT.md'));
} else {
  console.log(chalk.yellow('\n⚡ AUTHENTICATION NEEDS CONFIGURATION'));
  console.log(chalk.white('Issues to address:'));
  checks.filter(check => !check.check()).forEach(check => {
    console.log(chalk.white(`  - ${check.name}: ${check.error}`));
  });

  console.log('');
  console.log(chalk.cyan('Next Steps:'));
  console.log(chalk.white('1. Set up Google OAuth per GOOGLE_OAUTH_SETUP_EXACT.md'));
  console.log(chalk.white('2. Add real credentials to .env.local'));
  console.log(chalk.white('3. Start the server: npm run dev'));
  console.log(chalk.white('4. Test OAuth flow'));
}

console.log(chalk.cyan.bold('\nReady for complete system test! 🚀'));