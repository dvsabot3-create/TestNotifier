import { chromium } from 'playwright';
import path from 'path';

async function testExtensionLoading() {
  console.log('Testing manual Chrome extension loading...');

  const extensionPath = path.resolve(process.cwd(), 'READY_TO_DEPLOY_EXTENSION');
  console.log('Extension path:', extensionPath);

  const context = await chromium.launchPersistentContext('', {
    headless: false,
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
      '--disable-blink-features=AutomationControlled',
      '--enable-logging',
      '--v=1',
    ],
    viewport: { width: 1920, height: 1080 },
  });

  console.log('Browser context created');
  console.log('Pages open:', context.pages().length);

  // Wait for extension to load
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Try to find extension in chrome://extensions
  try {
    const extensionsPage = await context.newPage();
    await extensionsPage.goto('chrome://extensions/');
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

  // Keep browser open for inspection
  console.log('Keep browser open for manual inspection... Press Ctrl+C to close');
  await new Promise(resolve => setTimeout(resolve, 10000));

  await context.close();
}

testExtensionLoading().catch(console.error);