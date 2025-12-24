#!/usr/bin/env node

/**
 * TestNotifier Scribe Tutorial Creation Script
 *
 * This script helps create professional screenshots and tutorials
 * for the TestNotifier Chrome extension installation process.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎯 TestNotifier Scribe Tutorial Creation Script');
console.log('==================================================\n');

// Define the installation steps with their Scribe links
const installationSteps = [
  {
    id: 'chrome-version',
    title: 'Check Chrome Version',
    description: 'Verify you have Chrome 88 or later installed',
    chromeUrl: 'chrome://settings/help',
    scribeUrl: 'https://scribehow.com/shared/Check_Chrome_Version_for_TestNotifier__kYqQ',
    steps: [
      'Open Chrome browser',
      'Navigate to chrome://settings/help',
      'Check version number in the About section',
      'If needed, click "Update Google Chrome"',
      'Restart Chrome if updated'
    ]
  },
  {
    id: 'extensions-page',
    title: 'Open Chrome Extensions',
    description: 'Access the Chrome extensions management page',
    chromeUrl: 'chrome://extensions/',
    scribeUrl: 'https://scribehow.com/shared/Open_Chrome_Extensions_Page__kYrR',
    steps: [
      'Open Chrome browser',
      'Type chrome://extensions/ in address bar',
      'Press Enter to navigate',
      'Wait for extensions page to load'
    ]
  },
  {
    id: 'developer-mode',
    title: 'Enable Developer Mode',
    description: 'Toggle the developer mode switch in the top-right corner',
    chromeUrl: 'chrome://extensions/',
    scribeUrl: 'https://scribehow.com/shared/Enable_Developer_Mode_in_Chrome__kYsS',
    steps: [
      'Navigate to chrome://extensions/',
      'Locate Developer mode toggle in top-right corner',
      'Click the toggle to enable Developer mode',
      'Wait for additional buttons to appear'
    ]
  },
  {
    id: 'load-unpacked',
    title: 'Load Unpacked Extension',
    description: 'Click the "Load unpacked" button and select the extension folder',
    chromeUrl: 'chrome://extensions/',
    scribeUrl: 'https://scribehow.com/shared/Load_Unpacked_Extension_in_Chrome__kYtT',
    steps: [
      'Ensure Developer mode is enabled',
      'Click "Load unpacked" button',
      'Navigate to extracted extension folder',
      'Select folder containing manifest.json',
      'Click "Select Folder" to confirm'
    ]
  },
  {
    id: 'extension-verification',
    title: 'Verify Installation',
    description: 'Confirm the extension appears in your extensions list',
    chromeUrl: 'chrome://extensions/',
    scribeUrl: 'https://scribehow.com/shared/Verify_TestNotifier_Extension_Installation__kYuU',
    steps: [
      'Navigate to chrome://extensions/',
      'Look for TestNotifier in extensions list',
      'Verify status shows "Enabled"',
      'Note the version number',
      'Check for TestNotifier icon in toolbar'
    ]
  },
  {
    id: 'pin-extension',
    title: 'Pin Extension to Toolbar',
    description: 'Keep the TestNotifier extension easily accessible',
    chromeUrl: 'chrome://extensions/',
    scribeUrl: 'https://scribehow.com/shared/Pin_TestNotifier_Extension_to_Toolbar__kYvV',
    steps: [
      'Look for puzzle piece icon in Chrome toolbar',
      'Click the puzzle piece icon',
      'Find TestNotifier in the extensions list',
      'Click the pin icon next to TestNotifier',
      'Verify TestNotifier icon appears in toolbar'
    ]
  },
  {
    id: 'disable-extensions',
    title: 'Disable Conflicting Extensions',
    description: 'Temporarily disable ad blockers and privacy extensions',
    chromeUrl: 'chrome://extensions/',
    scribeUrl: 'https://scribehow.com/shared/Disable_Conflicting_Extensions_for_TestNotifier__kYwW',
    steps: [
      'Navigate to chrome://extensions/',
      'Identify potentially conflicting extensions',
      'Click toggle to disable uBlock Origin (if present)',
      'Click toggle to disable Privacy Badger (if present)',
      'Click toggle to disable other ad blockers',
      'Refresh DVSA page after disabling'
    ]
  }
];

// Create directories for screenshots
function createDirectories() {
  const screenshotDir = path.join(__dirname, '..', 'public', 'assets', 'screenshots', 'installation');

  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
    console.log('✅ Created screenshot directory:', screenshotDir);
  }

  return screenshotDir;
}

// Generate placeholder images
function generatePlaceholders(screenshotDir) {
  console.log('\n📸 Generating placeholder images...');

  installationSteps.forEach(step => {
    const placeholderPath = path.join(screenshotDir, `${step.id}-placeholder.png`);

    // Create a simple SVG placeholder
    const svgContent = `
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="#ffffff"/>
        <rect width="100%" height="100%" fill="url(#grid)"/>

        <!-- Header -->
        <rect x="0" y="0" width="100%" height="60" fill="#1d70b8"/>
        <text x="400" y="35" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="18" font-weight="bold">
          ${step.title}
        </text>

        <!-- Camera icon -->
        <circle cx="400" cy="250" r="80" fill="#e3f2fd" stroke="#1d70b8" stroke-width="2"/>
        <path d="M 350 250 L 350 280 L 450 280 L 450 250" fill="none" stroke="#1d70b8" stroke-width="3" stroke-linecap="round"/>
        <circle cx="400" cy="265" r="25" fill="none" stroke="#1d70b8" stroke-width="3"/>
        <circle cx="400" cy="265" r="10" fill="#1d70b8"/>

        <!-- Description -->
        <text x="400" y="380" text-anchor="middle" fill="#666" font-family="Arial, sans-serif" font-size="16">
          ${step.description}
        </text>

        <!-- Steps hint -->
        <text x="400" y="420" text-anchor="middle" fill="#999" font-family="Arial, sans-serif" font-size="14">
          Use Scribe Chrome extension to capture this step
        </text>

        <!-- Border -->
        <rect x="0" y="0" width="100%" height="100%" fill="none" stroke="#ddd" stroke-width="2"/>
      </svg>
    `.trim();

    // For now, create a text file with SVG content (in production, convert to PNG)
    const svgPath = path.join(screenshotDir, `${step.id}-placeholder.svg`);
    fs.writeFileSync(svgPath, svgContent);

    console.log(`✅ Created placeholder for: ${step.title}`);
  });
}

// Generate Scribe recording instructions
function generateScribeInstructions() {
  console.log('\n📋 Scribe Recording Instructions');
  console.log('=================================\n');

  console.log('1. 📥 Install Scribe Chrome Extension:');
  console.log('   https://chrome.google.com/webstore/detail/scribe-how-to-guides-scree/okfkdaglfjjjfefdcppliegeompoogfh\n');

  console.log('2. 🎬 Recording Process for each step:\n');

  installationSteps.forEach((step, index) => {
    console.log(`   Step ${index + 1}: ${step.title}`);
    console.log(`   📍 URL: ${step.chromeUrl}`);
    console.log(`   📝 Description: ${step.description}`);
    console.log('   ⚡ Actions to record:');
    step.steps.forEach((action, actionIndex) => {
      console.log(`      ${actionIndex + 1}. ${action}`);
    });
    console.log(`   🔗 Scribe Link: ${step.scribeUrl}`);
    console.log('   ---\n');
  });

  console.log('3. 💡 Best Practices:');
  console.log('   • Use consistent browser window size (1366x768)');
  console.log('   • Record in one continuous session when possible');
  console.log('   • Use clear, descriptive step titles in Scribe');
  console.log('   • Add annotations for important UI elements');
  console.log('   • Test tutorials on different devices');
  console.log('   • Update tutorials when Chrome UI changes\n');
}

// Generate React component usage guide
function generateUsageGuide() {
  console.log('⚛️  React Component Usage Guide');
  console.log('=================================\n');

  console.log('The ScreenshotSection component is already integrated into InstallationGuide.tsx');
  console.log('Usage example:\n');

  console.log('```jsx');
  console.log('<ScreenshotSection');
  console.log('  screenshotId="chrome-version"');
  console.log('  title="Chrome Version Check"');
  console.log('  description="This shows how to check Chrome version..."');
  console.log('/>');
  console.log('```\n');

  console.log('Available screenshot IDs:');
  installationSteps.forEach(step => {
    console.log(`   • ${step.id} - ${step.title}`);
  });
}

// Generate deployment checklist
function generateDeploymentChecklist() {
  console.log('\n🚀 Deployment Checklist');
  console.log('========================\n');

  const checklist = [
    'Install Scribe Chrome extension',
    'Create Scribe tutorials for each step',
    'Export screenshots from Scribe',
    'Optimize images for web (max 200KB each)',
    'Upload screenshots to /public/assets/screenshots/installation/',
    'Test all Scribe tutorial links',
    'Verify responsive design on mobile',
    'Test accessibility with screen readers',
    'Run build process to verify integration',
    'Deploy to production and test live links'
  ];

  checklist.forEach((item, index) => {
    console.log(`${index + 1}. ${item}`);
  });
}

// Main execution
function main() {
  try {
    const screenshotDir = createDirectories();
    generatePlaceholders(screenshotDir);
    generateScribeInstructions();
    generateUsageGuide();
    generateDeploymentChecklist();

    console.log('\n✨ Script completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Install Scribe Chrome extension');
    console.log('2. Follow the recording instructions above');
    console.log('3. Create actual screenshots and tutorials');
    console.log('4. Replace placeholder images with real screenshots');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { installationSteps, ScreenshotHelper: {
  getScribeLink: (id) => {
    const step = installationSteps.find(s => s.id === id);
    return step?.scribeUrl;
  },
  isScreenshotAvailable: (id) => {
    return installationSteps.some(s => s.id === id);
  }
}};