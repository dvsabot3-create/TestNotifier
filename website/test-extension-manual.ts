import { chromium } from '@playwright/test';
import path from 'path';

async function testExtensionManual() {
  console.log('Testing manual Chrome extension loading...');

  const extensionPath = path.resolve(__dirname, '../READY_TO_DEPLOY_EXTENSION');
  console.log('Extension path:', extensionPath);

  // Check if extensions exist
  const fs = require('fs');
  if (!fs.existsSync(extensionPath)) {
    console.error('Extension path does not exist:', extensionPath);
    return;
  }

  console.log('Extension files:');
  console.log('- manifest.json:', fs.existsSync(path.join(extensionPath, 'manifest.json')));
  console.log('- popup.html:', fs.existsSync(path.join(extensionPath, 'popup.html')));
  console.log('- background.js:', fs.existsSync(path.join(extensionPath, 'background.js')));

  const browser = await chromium.launch({
    headless: false,
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
      '--disable-blink-features=AutomationControlled',
      '--enable-logging',
      '--disable-infobars',
      '--disable-dev-shm-usage',
      '--no-sandbox',
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });

  console.log('Browser launched');

  // Wait for extension to load
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Try to find extension in chrome://extensions
  try {
    const extensionsPage = await context.newPage();
    await extensionsPage.goto('chrome://extensions');
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('Extension page title:', await extensionsPage.title());
    console.log('Extension page URL:', extensionsPage.url());

    // Check if extension is visible
    const extensionElements = await extensionsPage.$$('[id^="extension-item"]');
    console.log('Found', extensionElements.length, 'extension elements');

    // Take screenshot
    await extensionsPage.screenshot({ path: 'extension-debug.png' });
    console.log('Screenshot saved as extension-debug.png');

  } catch (error) {
    console.error('Failed to access extensions page:', error.message);
  }

  // Instead of chrome://extensions, try to detect extension via popup
  try {
    console.log('Testing extension popup access...');

    // Wait a bit for extension to fully load
    await new Promise(resolve => setTimeout(resolve, 2000));

    const testPage = await context.newPage();

    // Try to access extension popup directly (this might fail with extension ID issues)
    try {
      await testPage.goto('chrome-extension://test-extension-id/popup.html', {
        waitUntil: 'networkidle',
        timeout: 5000
      });
      console.log('Extension popup loaded successfully!');
    } catch (error) {
      console.log('Extension popup failed to load:', error.message);
    }

    // Test on a real website to see if extension content scripts work
    console.log('Testing on real website...');

    try {
      await testPage.goto('https://driverpracticaltest.dvsa.gov.uk', {
        waitUntil: 'networkidle',
        timeout: 10000
      });
      console.log('DVSA website loaded');

      // Wait for extension to inject
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Check if extension is present
      const extensionCheck = await testPage.evaluate(() => {
        // Look for extension globals or DOM elements
        return window.hasOwnProperty('testnotifierExtension') ||
               document.querySelector('[data-extension-present="true"]') !== null ||
               window.hasOwnProperty('$') || // Check if jQuery was loaded by extension
               false;
      }).catch(() => false);

      console.log('Extension detected on page:', extensionCheck);

    } catch (websiteError) {
      console.log('Website load failed:', websiteError.message);
    }

    await testPage.close();

  } catch (error) {
    console.error('Extension detection failed:', error.message);
  }

  // Clean up
  await browser.close();
}

testExtensionManual().catch(console.error);