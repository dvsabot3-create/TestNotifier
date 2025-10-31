#!/usr/bin/env node

/**
 * TestNotifier Scribe Integration Test Script
 *
 * This script tests the Scribe tutorial links and screenshot integration
 * to ensure everything works correctly in production.
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('🧪 TestNotifier Scribe Integration Test');
console.log('==========================================\n');

// Scribe tutorial links from our implementation
const scribeLinks = [
  {
    id: 'chrome-version',
    title: 'Check Chrome Version',
    url: 'https://scribehow.com/shared/Check_Chrome_Version_for_TestNotifier__kYqQ'
  },
  {
    id: 'extensions-page',
    title: 'Open Chrome Extensions',
    url: 'https://scribehow.com/shared/Open_Chrome_Extensions_Page__kYrR'
  },
  {
    id: 'developer-mode',
    title: 'Enable Developer Mode',
    url: 'https://scribehow.com/shared/Enable_Developer_Mode_in_Chrome__kYsS'
  },
  {
    id: 'load-unpacked',
    title: 'Load Unpacked Extension',
    url: 'https://scribehow.com/shared/Load_Unpacked_Extension_in_Chrome__kYtT'
  },
  {
    id: 'extension-verification',
    title: 'Verify Installation',
    url: 'https://scribehow.com/shared/Verify_TestNotifier_Extension_Installation__kYuU'
  },
  {
    id: 'pin-extension',
    title: 'Pin Extension to Toolbar',
    url: 'https://scribehow.com/shared/Pin_TestNotifier_Extension_to_Toolbar__kYvV'
  },
  {
    id: 'disable-extensions',
    title: 'Disable Conflicting Extensions',
    url: 'https://scribehow.com/shared/Disable_Conflicting_Extensions_for_TestNotifier__kYwW'
  }
];

// Test if Scribe links are accessible
function testScribeLink(link) {
  return new Promise((resolve) => {
    const url = new URL(link.url);
    const protocol = url.protocol === 'https:' ? https : http;

    const options = {
      method: 'HEAD',
      timeout: 10000
    };

    const req = protocol.request(url, options, (res) => {
      resolve({
        id: link.id,
        title: link.title,
        url: link.url,
        status: res.statusCode,
        statusText: res.statusMessage,
        accessible: res.statusCode === 200 || res.statusCode === 302 || res.statusCode === 301
      });
    });

    req.on('error', (error) => {
      resolve({
        id: link.id,
        title: link.title,
        url: link.url,
        status: 'ERROR',
        statusText: error.message,
        accessible: false
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        id: link.id,
        title: link.title,
        url: link.url,
        status: 'TIMEOUT',
        statusText: 'Request timed out',
        accessible: false
      });
    });

    req.end();
  });
}

// Test all Scribe links
async function testAllScribeLinks() {
  console.log('🔍 Testing Scribe Tutorial Links...\n');

  const results = [];
  let passed = 0;
  let failed = 0;

  for (const link of scribeLinks) {
    console.log(`Testing: ${link.title}...`);
    const result = await testScribeLink(link);
    results.push(result);

    if (result.accessible) {
      console.log(`✅ ${link.title} - ${result.status} (${result.statusText})`);
      passed++;
    } else {
      console.log(`❌ ${link.title} - ${result.status} (${result.statusText})`);
      failed++;
    }
  }

  console.log('\n📊 Scribe Links Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Total: ${scribeLinks.length}`);

  return results;
}

// Test screenshot file paths
function testScreenshotFiles() {
  console.log('\n📸 Testing Screenshot File Paths...\n');

  const screenshotDir = path.join(__dirname, '..', 'public', 'assets', 'screenshots', 'installation');
  const results = [];

  if (!fs.existsSync(screenshotDir)) {
    console.log('❌ Screenshot directory does not exist:', screenshotDir);
    return results;
  }

  const expectedFiles = [
    'chrome-version-placeholder.png',
    'extensions-page-placeholder.png',
    'developer-mode-placeholder.png',
    'load-unpacked-placeholder.png',
    'extension-verification-placeholder.png',
    'pin-extension-placeholder.png',
    'disable-extensions-placeholder.png'
  ];

  let found = 0;
  let missing = 0;

  expectedFiles.forEach(file => {
    const filePath = path.join(screenshotDir, file);
    const exists = fs.existsSync(filePath);
    const size = exists ? fs.statSync(filePath).size : 0;

    results.push({
      file,
      path: filePath,
      exists,
      size,
      status: exists ? (size > 0 ? 'FOUND' : 'EMPTY') : 'MISSING'
    });

    if (exists) {
      console.log(`✅ ${file} - ${size} bytes`);
      found++;
    } else {
      console.log(`❌ ${file} - MISSING`);
      missing++;
    }
  });

  console.log('\n📊 Screenshot Files Test Results:');
  console.log(`✅ Found: ${found}`);
  console.log(`❌ Missing: ${missing}`);
  console.log(`📈 Total: ${expectedFiles.length}`);

  return results;
}

// Test React component integration
function testComponentIntegration() {
  console.log('\n⚛️  Testing React Component Integration...\n');

  const componentPath = path.join(__dirname, '..', 'components', 'figma', 'InstallationGuide.tsx');

  if (!fs.existsSync(componentPath)) {
    console.log('❌ InstallationGuide.tsx component not found');
    return false;
  }

  const componentContent = fs.readFileSync(componentPath, 'utf8');
  const results = {
    screenshotDataStructure: false,
    scribeHelperFunctions: false,
    screenshotSectionComponent: false,
    scribeLinks: [],
    screenshotSections: []
  };

  // Test screenshot data structure
  results.screenshotDataStructure = componentContent.includes('interface ScreenshotData');
  console.log(`ScreenshotData interface: ${results.screenshotDataStructure ? '✅' : '❌'}`);

  // Test ScribeHelper functions
  results.scribeHelperFunctions = componentContent.includes('ScreenshotHelper') &&
                                  componentContent.includes('getScribeLink') &&
                                  componentContent.includes('isScreenshotAvailable');
  console.log(`ScreenshotHelper functions: ${results.scribeHelperFunctions ? '✅' : '❌'}`);

  // Test ScreenshotSection component
  results.screenshotSectionComponent = componentContent.includes('function ScreenshotSection');
  console.log(`ScreenshotSection component: ${results.screenshotSectionComponent ? '✅' : '❌'}`);

  // Test Scribe links integration
  scribeLinks.forEach(link => {
    const hasLink = componentContent.includes(link.url);
    results.scribeLinks.push({
      id: link.id,
      hasLink,
      url: link.url
    });
    console.log(`Scribe link ${link.id}: ${hasLink ? '✅' : '❌'}`);
  });

  // Test ScreenshotSection usage
  const screenshotSectionRegex = /\<ScreenshotSection[^>]*\>/g;
  const matches = componentContent.match(screenshotSectionRegex);
  results.screenshotSections = matches ? matches.length : 0;
  console.log(`ScreenshotSection usage: ${results.screenshotSections} instances`);

  const allTestsPassed = results.screenshotDataStructure &&
                        results.scribeHelperFunctions &&
                        results.screenshotSectionComponent &&
                        results.scribeLinks.every(link => link.hasLink) &&
                        results.screenshotSections > 0;

  console.log(`\n📊 Component Integration: ${allTestsPassed ? '✅ PASSED' : '❌ FAILED'}`);

  return results;
}

// Generate test report
function generateTestReport(scribeResults, screenshotResults, componentResults) {
  console.log('\n📋 Generating Test Report...\n');

  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      scribeLinks: {
        total: scribeLinks.length,
        accessible: scribeResults.filter(r => r.accessible).length,
        failed: scribeResults.filter(r => !r.accessible).length
      },
      screenshotFiles: {
        total: 7,
        found: screenshotResults.filter(r => r.exists).length,
        missing: screenshotResults.filter(r => !r.exists).length
      },
      componentIntegration: {
        passed: componentResults.screenshotDataStructure &&
               componentResults.scribeHelperFunctions &&
               componentResults.screenshotSectionComponent,
        screenshotSections: componentResults.screenshotSections
      }
    },
    details: {
      scribeResults,
      screenshotResults,
      componentResults
    },
    recommendations: []
  };

  // Generate recommendations
  if (report.summary.scribeLinks.failed > 0) {
    report.recommendations.push('Create Scribe tutorials for failed links');
  }

  if (report.summary.screenshotFiles.missing > 0) {
    report.recommendations.push('Generate missing screenshot files');
  }

  if (!report.summary.componentIntegration.passed) {
    report.recommendations.push('Fix component integration issues');
  }

  if (report.summary.scribeLinks.accessible === report.summary.scribeLinks.total &&
      report.summary.screenshotFiles.found === report.summary.screenshotFiles.total &&
      report.summary.componentIntegration.passed) {
    report.recommendations.push('System is ready for production deployment');
  }

  // Save report to file
  const reportPath = path.join(__dirname, '..', 'scribe-integration-test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log('✅ Test report saved to:', reportPath);
  return report;
}

// Main test execution
async function main() {
  try {
    console.log('Starting comprehensive integration test...\n');

    // Run all tests
    const scribeResults = await testAllScribeLinks();
    const screenshotResults = testScreenshotFiles();
    const componentResults = testComponentIntegration();

    // Generate report
    const report = generateTestReport(scribeResults, screenshotResults, componentResults);

    // Print summary
    console.log('\n🎯 TEST SUMMARY');
    console.log('================');
    console.log(`Scribe Links: ${report.summary.scribeLinks.accessible}/${report.summary.scribeLinks.total} accessible`);
    console.log(`Screenshot Files: ${report.summary.screenshotFiles.found}/${report.summary.screenshotFiles.total} found`);
    console.log(`Component Integration: ${report.summary.componentIntegration.passed ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Screenshot Sections: ${report.summary.componentIntegration.screenshotSections} instances`);

    if (report.recommendations.length > 0) {
      console.log('\n💡 RECOMMENDATIONS:');
      report.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`);
      });
    }

    const allTestsPassed = report.summary.scribeLinks.failed === 0 &&
                          report.summary.screenshotFiles.missing === 0 &&
                          report.summary.componentIntegration.passed;

    console.log(`\n🏆 OVERALL RESULT: ${allTestsPassed ? '✅ READY FOR PRODUCTION' : '❌ NEEDS ATTENTION'}`);

    process.exit(allTestsPassed ? 0 : 1);

  } catch (error) {
    console.error('❌ Test execution failed:', error.message);
    process.exit(1);
  }
}

// Run tests if called directly
if (require.main === module) {
  main();
}

module.exports = {
  testScribeLink,
  testAllScribeLinks,
  testScreenshotFiles,
  testComponentIntegration,
  scribeLinks
};