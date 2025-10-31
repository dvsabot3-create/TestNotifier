#!/usr/bin/env node

/**
 * Professional Chrome Screenshots Generator for TestNotifier
 *
 * This script uses Puppeteer to create high-quality, consistent screenshots
 * of Chrome browser interfaces for the TestNotifier installation guide.
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

console.log('📸 Professional Chrome Screenshots Generator');
console.log('==============================================\n');

// Screenshot configuration
const config = {
  viewport: { width: 1366, height: 768 },
  outputDir: path.join(__dirname, '..', 'public', 'assets', 'screenshots', 'installation'),
  quality: 90,
  format: 'png',
  delay: 2000, // 2 second delay between actions
  chromePath: process.env.CHROME_PATH || null
};

// Installation steps configuration
const installationSteps = [
  {
    id: 'chrome-version',
    title: 'Check Chrome Version',
    url: 'chrome://settings/help',
    filename: 'chrome-version-screenshot.png',
    actions: [
      { type: 'navigate', selector: null, description: 'Navigate to Chrome settings' },
      { type: 'wait', selector: 'settings-ui', description: 'Wait for settings to load' },
      { type: 'highlight', selector: '.about-version', description: 'Highlight version number' }
    ]
  },
  {
    id: 'extensions-page',
    title: 'Open Chrome Extensions',
    url: 'chrome://extensions/',
    filename: 'extensions-page-screenshot.png',
    actions: [
      { type: 'navigate', selector: null, description: 'Navigate to extensions page' },
      { type: 'wait', selector: 'extensions-item-list', description: 'Wait for extensions to load' },
      { type: 'highlight', selector: 'extensions-toolbar', description: 'Highlight toolbar area' }
    ]
  },
  {
    id: 'developer-mode',
    title: 'Enable Developer Mode',
    url: 'chrome://extensions/',
    filename: 'developer-mode-screenshot.png',
    actions: [
      { type: 'navigate', selector: null, description: 'Navigate to extensions page' },
      { type: 'wait', selector: 'extensions-manager', description: 'Wait for extensions manager' },
      { type: 'click', selector: 'cr-toggle#devMode', description: 'Click developer mode toggle' },
      { type: 'wait', selector: 'cr-button[aria-label="Load unpacked"]', description: 'Wait for load button' }
    ]
  },
  {
    id: 'load-unpacked',
    title: 'Load Unpacked Extension',
    url: 'chrome://extensions/',
    filename: 'load-unpacked-screenshot.png',
    actions: [
      { type: 'navigate', selector: null, description: 'Navigate to extensions page' },
      { type: 'wait', selector: 'cr-button[aria-label="Load unpacked"]', description: 'Wait for load button' },
      { type: 'highlight', selector: 'cr-button[aria-label="Load unpacked"]', description: 'Highlight load button' }
    ]
  },
  {
    id: 'extension-verification',
    title: 'Verify Installation',
    url: 'chrome://extensions/',
    filename: 'extension-verification-screenshot.png',
    actions: [
      { type: 'navigate', selector: null, description: 'Navigate to extensions page' },
      { type: 'wait', selector: 'extensions-item-list', description: 'Wait for extensions list' },
      { type: 'highlight', selector: 'extensions-item', description: 'Highlight installed extensions' }
    ]
  },
  {
    id: 'pin-extension',
    title: 'Pin Extension to Toolbar',
    url: 'https://www.google.com', // Use a clean page for toolbar demonstration
    filename: 'pin-extension-screenshot.png',
    actions: [
      { type: 'navigate', selector: null, description: 'Navigate to clean page' },
      { type: 'wait', selector: 'body', description: 'Wait for page to load' },
      { type: 'click', selector: 'extensions-toolbar', description: 'Click extensions menu' },
      { type: 'wait', selector: 'extensions-item', description: 'Wait for extensions menu' }
    ]
  },
  {
    id: 'disable-extensions',
    title: 'Disable Conflicting Extensions',
    url: 'chrome://extensions/',
    filename: 'disable-extensions-screenshot.png',
    actions: [
      { type: 'navigate', selector: null, description: 'Navigate to extensions page' },
      { type: 'wait', selector: 'extensions-item-list', description: 'Wait for extensions list' },
      { type: 'highlight', selector: '.extension-toggle', description: 'Highlight extension toggles' }
    ]
  }
];

// Create output directory
function createOutputDirectory() {
  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
    console.log('✅ Created output directory:', config.outputDir);
  }
}

// Launch browser with professional settings
async function launchBrowser() {
  console.log('🚀 Launching Chrome browser...');

  const browser = await puppeteer.launch({
    headless: false, // Set to true for headless mode
    defaultViewport: config.viewport,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      '--window-size=1366,768'
    ],
    executablePath: config.chromePath
  });

  return browser;
}

// Create professional screenshot
async function createProfessionalScreenshot(browser, step) {
  console.log(`\n📸 Creating screenshot for: ${step.title}`);

  const page = await browser.newPage();

  try {
    // Set professional viewport
    await page.setViewport(config.viewport);

    // Navigate to the page
    console.log(`   🌐 Navigating to: ${step.url}`);
    await page.goto(step.url, { waitUntil: 'networkidle2' });

    // Wait for initial load
    await page.waitForTimeout(config.delay);

    // Perform actions
    for (const action of step.actions) {
      console.log(`   ⚡ ${action.description}`);

      switch (action.type) {
        case 'wait':
          if (action.selector) {
            await page.waitForSelector(action.selector, { timeout: 10000 });
          } else {
            await page.waitForTimeout(config.delay);
          }
          break;

        case 'click':
          if (action.selector) {
            await page.click(action.selector);
            await page.waitForTimeout(config.delay / 2);
          }
          break;

        case 'highlight':
          if (action.selector) {
            // Add visual highlight to element
            await page.evaluate((selector) => {
              const element = document.querySelector(selector);
              if (element) {
                element.style.border = '3px solid #1d70b8';
                element.style.borderRadius = '4px';
                element.style.boxShadow = '0 0 10px rgba(29, 112, 184, 0.5)';
                element.style.transition = 'all 0.3s ease';
              }
            }, action.selector);
            await page.waitForTimeout(config.delay / 2);
          }
          break;

        case 'navigate':
          // Already handled by page.goto
          break;
      }
    }

    // Take professional screenshot
    console.log(`   📷 Taking screenshot...`);
    const screenshotPath = path.join(config.outputDir, step.filename);

    await page.screenshot({
      path: screenshotPath,
      type: config.format,
      quality: config.quality,
      fullPage: false // Use viewport size only
    });

    console.log(`   ✅ Screenshot saved: ${step.filename}`);

    // Get screenshot info
    const stats = fs.statSync(screenshotPath);
    console.log(`   📊 Size: ${(stats.size / 1024).toFixed(1)}KB`);

    return {
      success: true,
      filename: step.filename,
      path: screenshotPath,
      size: stats.size
    };

  } catch (error) {
    console.error(`   ❌ Error creating screenshot: ${error.message}`);
    return {
      success: false,
      filename: step.filename,
      error: error.message
    };
  } finally {
    await page.close();
  }
}

// Add professional styling to the page
async function addProfessionalStyling(page) {
  await page.addStyleTag({
    content: `
      /* Professional highlight styles */
      .screenshot-highlight {
        border: 3px solid #1d70b8 !important;
        border-radius: 4px !important;
        box-shadow: 0 0 10px rgba(29, 112, 184, 0.5) !important;
        transition: all 0.3s ease !important;
      }

      /* Hide scrollbars for cleaner screenshots */
      ::-webkit-scrollbar {
        display: none !important;
      }

      /* Professional focus indicators */
      *:focus {
        outline: 3px solid #1d70b8 !important;
        outline-offset: 2px !important;
      }
    `
  });
}

// Main screenshot creation process
async function createScreenshots() {
  createOutputDirectory();
  const browser = await launchBrowser();

  const results = {
    successful: [],
    failed: [],
    total: installationSteps.length
  };

  try {
    console.log('\n🎬 Starting screenshot creation process...');

    for (const step of installationSteps) {
      const result = await createProfessionalScreenshot(browser, step);

      if (result.success) {
        results.successful.push(result);
      } else {
        results.failed.push(result);
      }
    }

    // Print results summary
    console.log('\n📊 Screenshot Creation Results:');
    console.log(`✅ Successful: ${results.successful.length}`);
    console.log(`❌ Failed: ${results.failed.length}`);
    console.log(`📈 Total: ${results.total}`);

    if (results.failed.length > 0) {
      console.log('\n❌ Failed Screenshots:');
      results.failed.forEach(fail => {
        console.log(`   • ${fail.filename}: ${fail.error}`);
      });
    }

    // Generate report
    generateReport(results);

  } catch (error) {
    console.error('❌ Screenshot creation failed:', error.message);
  } finally {
    await browser.close();
  }
}

// Generate comprehensive report
function generateReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: results.total,
      successful: results.successful.length,
      failed: results.failed.length,
      successRate: ((results.successful.length / results.total) * 100).toFixed(1) + '%'
    },
    successful: results.successful,
    failed: results.failed,
    recommendations: [
      'Optimize PNG files for web (max 200KB each)',
      'Test screenshot loading in the application',
      'Verify all Scribe tutorial links work correctly',
      'Check responsive design on mobile devices'
    ]
  };

  const reportPath = path.join(config.outputDir, 'screenshot-creation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(`\n📋 Report saved to: ${reportPath}`);
}

// Alternative: Create mock screenshots for demonstration
async function createMockScreenshots() {
  console.log('\n🎨 Creating mock screenshots for demonstration...');

  const mockSteps = installationSteps.map(step => ({
    ...step,
    filename: step.filename.replace('.png', '-mock.png')
  }));

  // Create simple SVG mockups (in production, use proper screenshots)
  mockSteps.forEach(step => {
    const mockPath = path.join(config.outputDir, step.filename);

    const svgContent = `
      <svg width="${config.viewport.width}" height="${config.viewport.height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f5f5f5" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="white"/>
        <rect width="100%" height="100%" fill="url(#grid)"/>

        <!-- Header -->
        <rect x="0" y="0" width="100%" height="60" fill="#1d70b8"/>
        <text x="683" y="35" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="18" font-weight="bold">
          ${step.title}
        </text>

        <!-- Mock Chrome UI elements -->
        <rect x="50" y="100" width="500" height="40" fill="#f8f9fa" stroke="#dee2e6" stroke-width="1" rx="4"/>
        <text x="70" y="125" fill="#495057" font-family="Arial, sans-serif" font-size="14">
          ${step.url}
        </text>

        <!-- Mock content area -->
        <rect x="50" y="160" width="1266" height="500" fill="#ffffff" stroke="#dee2e6" stroke-width="1" rx="4"/>

        <!-- Mock UI elements based on step -->
        ${generateMockUIElements(step)}

        <!-- Instructions -->
        <text x="683" y="700" text-anchor="middle" fill="#6c757d" font-family="Arial, sans-serif" font-size="16">
          Mock screenshot for: ${step.description}
        </text>

        <text x="683" y="720" text-anchor="middle" fill="#868e96" font-family="Arial, sans-serif" font-size="14">
          Replace with actual Chrome screenshot from Scribe
        </text>

        <rect x="0" y="0" width="100%" height="100%" fill="none" stroke="#dee2e6" stroke-width="2"/>
      </svg>
    `.trim();

    fs.writeFileSync(mockPath.replace('.png', '.svg'), svgContent);
    console.log(`✅ Created mock: ${step.filename}`);
  });

  console.log('\n✅ Mock screenshots created successfully');
  console.log('💡 Replace with actual PNG screenshots from Scribe in production');
}

// Generate mock UI elements for each step
function generateMockUIElements(step) {
  switch (step.id) {
    case 'chrome-version':
      return `
        <rect x="100" y="200" width="300" height="80" fill="#e8f4f8" stroke="#1d70b8" stroke-width="2" rx="4"/>
        <text x="250" y="235" text-anchor="middle" fill="#1d70b8" font-family="Arial, sans-serif" font-size="16" font-weight="bold">
          Chrome Version 108.0.5359.124
        </text>
        <text x="250" y="255" text-anchor="middle" fill="#28a745" font-family="Arial, sans-serif" font-size="14">
          ✓ Chrome is up to date
        </text>
      `;

    case 'extensions-page':
      return `
        <rect x="100" y="200" width="400" height="60" fill="#f8f9fa" stroke="#dee2e6" stroke-width="1" rx="4"/>
        <text x="120" y="230" fill="#495057" font-family="Arial, sans-serif" font-size="14">
          📦 Extensions (12)
        </text>
        <rect x="500" y="210" width="80" height="30" fill="#1d70b8" rx="15"/>
        <text x="540" y="230" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12">
          Developer mode
        </text>
      `;

    case 'developer-mode':
      return `
        <circle cx="540" cy="225" r="15" fill="#28a745"/>
        <circle cx="540" cy="225" r="10" fill="white"/>
        <text x="650" y="230" fill="#495057" font-family="Arial, sans-serif" font-size="14">
          Developer mode ON
        </text>
        <rect x="100" y="260" width="120" height="35" fill="#6f42c1" rx="4"/>
        <text x="160" y="282" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="14">
          Load unpacked
        </text>
      `;

    case 'load-unpacked':
      return `
        <rect x="200" y="250" width="150" height="40" fill="#6f42c1" rx="4"/>
        <text x="275" y="275" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="bold">
          Load unpacked
        </text>
        <text x="275" y="300" text-anchor="middle" fill="#6c757d" font-family="Arial, sans-serif" font-size="12">
          Click to select extension folder
        </text>
      `;

    case 'extension-verification':
      return `
        <rect x="100" y="200" width="300" height="80" fill="#d4edda" stroke="#28a745" stroke-width="2" rx="4"/>
        <text x="250" y="230" text-anchor="middle" fill="#155724" font-family="Arial, sans-serif" font-size="16" font-weight="bold">
          ✅ TestNotifier
        </text>
        <text x="250" y="250" text-anchor="middle" fill="#28a745" font-family="Arial, sans-serif" font-size="14">
          Enabled • Version 1.0.0
        </text>
        <text x="250" y="270" text-anchor="middle" fill="#155724" font-family="Arial, sans-serif" font-size="12">
          Successfully installed!
        </text>
      `;

    case 'pin-extension':
      return `
        <path d="M 600 80 L 620 80 L 640 90 L 640 110 L 620 120 L 600 120 Z" fill="#495057"/>
        <circle cx="620" cy="100" r="8" fill="#ffc107"/>
        <text x="650" y="105" fill="#495057" font-family="Arial, sans-serif" font-size="14">
          🔧 Extensions menu
        </text>
        <rect x="650" y="130" width="200" height="100" fill="#ffffff" stroke="#dee2e6" stroke-width="1" rx="4"/>
        <text x="750" y="160" text-anchor="middle" fill="#1d70b8" font-family="Arial, sans-serif" font-size="14" font-weight="bold">
          TestNotifier 📌
        </text>
      `;

    case 'disable-extensions':
      return `
        <rect x="100" y="200" width="250" height="60" fill="#f8d7da" stroke="#dc3545" stroke-width="1" rx="4"/>
        <text x="120" y="225" fill="#721c24" font-family="Arial, sans-serif" font-size="14">
          🚫 uBlock Origin
        </text>
        <circle cx="300" cy="230" r="12" fill="#dc3545"/>
        <line x1="292" y1="222" x2="308" y2="238" stroke="white" stroke-width="2"/>
        <line x1="308" y1="222" x2="292" y2="238" stroke="white" stroke-width="2"/>
        <text x="320" y="235" fill="#721c24" font-family="Arial, sans-serif" font-size="12">
          Disabled
        </text>
      `;

    default:
      return '';
  }
}

// Main execution
async function main() {
  try {
    console.log('Starting Chrome screenshot creation...\n');

    // Check if we should create real screenshots or mocks
    const createRealScreenshots = process.env.CREATE_REAL_SCREENSHOTS === 'true';

    if (createRealScreenshots) {
      await createScreenshots();
    } else {
      await createMockScreenshots();
    }

    console.log('\n✨ Screenshot creation completed!');

  } catch (error) {
    console.error('❌ Screenshot creation failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  createScreenshots,
  createMockScreenshots,
  installationSteps,
  config
};