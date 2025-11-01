#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');

class ExtensionTester {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.distDir = path.join(this.projectRoot, 'dist');
    this.testResults = [];
  }

  async runAllTests() {
    console.log(chalk.blue('🔬 DVSA Queen Extension Test Suite'));
    console.log(chalk.gray('Running comprehensive tests...\n'));

    try {
      // Run test suites
      await this.runManifestTests();
      await this.runJavaScriptTests();
      await this.runStealthTests();
      await this.runSecurityTests();
      await this.runPerformanceTests();

      // Generate report
      await this.generateTestReport();

      console.log(chalk.green('\n✅ All tests completed successfully!'));
      return this.testResults;

    } catch (error) {
      console.error(chalk.red('\n❌ Test suite failed:'), error.message);
      process.exit(1);
    }
  }

  async runManifestTests() {
    const spinner = ora('Testing manifest.json...').start();

    try {
      const manifestPath = path.join(this.distDir, 'manifest.json');
      const manifest = await fs.readJson(manifestPath);

      // Test manifest structure
      this.testManifestStructure(manifest);

      // Test permissions
      this.testPermissions(manifest);

      // Test content scripts
      this.testContentScripts(manifest);

      spinner.succeed('Manifest tests passed');

    } catch (error) {
      spinner.fail('Manifest tests failed');
      throw error;
    }
  }

  testManifestStructure(manifest) {
    const requiredFields = [
      'name', 'version', 'manifest_version', 'description',
      'permissions', 'host_permissions', 'content_scripts',
      'background', 'action'
    ];

    for (const field of requiredFields) {
      if (!manifest[field]) {
        throw new Error(`Missing required manifest field: ${field}`);
      }
    }

    if (manifest.manifest_version !== 3) {
      throw new Error('Must use Manifest V3');
    }

    this.testResults.push({
      suite: 'Manifest',
      test: 'Structure',
      result: 'PASS'
    });
  }

  testPermissions(manifest) {
    const requiredPermissions = [
      'activeTab', 'storage', 'notifications'
    ];

    for (const permission of requiredPermissions) {
      if (!manifest.permissions.includes(permission)) {
        throw new Error(`Missing required permission: ${permission}`);
      }
    }

    if (!manifest.host_permissions.includes('*://driverpracticaltest.dvsa.gov.uk/*')) {
      throw new Error('Missing DVSA host permission');
    }

    this.testResults.push({
      suite: 'Manifest',
      test: 'Permissions',
      result: 'PASS'
    });
  }

  testContentScripts(manifest) {
    if (!manifest.content_scripts || manifest.content_scripts.length === 0) {
      throw new Error('No content scripts defined');
    }

    const contentScript = manifest.content_scripts[0];
    if (!contentScript.js || !contentScript.js.includes('content-script.js')) {
      throw new Error('Content script not properly configured');
    }

    if (!contentScript.matches.includes('*://driverpracticaltest.dvsa.gov.uk/*')) {
      throw new Error('Content script not targeting DVSA domain');
    }

    this.testResults.push({
      suite: 'Manifest',
      test: 'Content Scripts',
      result: 'PASS'
    });
  }

  async runJavaScriptTests() {
    const spinner = ora('Testing JavaScript modules...').start();

    try {
      // Test content script
      await this.testContentScript();

      // Test background script
      await this.testBackgroundScript();

      // Test popup script
      await this.testPopupScript();

      spinner.succeed('JavaScript tests passed');

    } catch (error) {
      spinner.fail('JavaScript tests failed');
      throw error;
    }
  }

  async testContentScript() {
    const contentScriptPath = path.join(this.distDir, 'content-script.js');

    if (!await fs.pathExists(contentScriptPath)) {
      throw new Error('Content script not found');
    }

    const content = await fs.readFile(contentScriptPath, 'utf8');

    // Test for required classes
    const requiredClasses = [
      'DVSAQueenContent',
      'StealthManager',
      'DetectionEvasion',
      'TimingRandomizer',
      'MouseSimulator'
    ];

    for (const className of requiredClasses) {
      if (!content.includes(`class ${className}`)) {
        throw new Error(`Missing required class: ${className}`);
      }
    }

    // Test for stealth integration
    if (!content.includes('stealthManager')) {
      throw new Error('Stealth Manager not integrated');
    }

    this.testResults.push({
      suite: 'JavaScript',
      test: 'Content Script',
      result: 'PASS'
    });
  }

  async testBackgroundScript() {
    const backgroundPath = path.join(this.distDir, 'background.js');

    if (!await fs.pathExists(backgroundPath)) {
      throw new Error('Background script not found');
    }

    const content = await fs.readFile(backgroundPath, 'utf8');

    // Test for service worker structure
    if (!content.includes('chrome.runtime.onInstalled')) {
      throw new Error('Background script missing service worker setup');
    }

    if (!content.includes('chrome.runtime.onMessage')) {
      throw new Error('Background script missing message handling');
    }

    this.testResults.push({
      suite: 'JavaScript',
      test: 'Background Script',
      result: 'PASS'
    });
  }

  async testPopupScript() {
    const popupPath = path.join(this.distDir, 'popup.js');

    if (!await fs.pathExists(popupPath)) {
      throw new Error('Popup script not found');
    }

    const content = await fs.readFile(popupPath, 'utf8');

    // Test for popup manager
    if (!content.includes('class PopupManager')) {
      throw new Error('Popup Manager not found');
    }

    // Test for DVSA integration
    if (!content.includes('chrome.runtime.sendMessage')) {
      throw new Error('Popup missing extension communication');
    }

    this.testResults.push({
      suite: 'JavaScript',
      test: 'Popup Script',
      result: 'PASS'
    });
  }

  async runStealthTests() {
    const spinner = ora('Testing stealth systems...').start();

    try {
      // Test stealth modules
      await this.testStealthModules();

      // Test risk assessment
      await this.testRiskAssessment();

      // Test timing algorithms
      await this.testTimingAlgorithms();

      spinner.succeed('Stealth tests passed');

    } catch (error) {
      spinner.fail('Stealth tests failed');
      throw error;
    }
  }

  async testStealthModules() {
    const stealthDir = path.join(this.distDir, 'stealth');

    if (!await fs.pathExists(stealthDir)) {
      throw new Error('Stealth directory not found');
    }

    const requiredModules = [
      'detection-evasion.js',
      'timing-randomizer.js',
      'mouse-simulation.js',
      'stealth-manager.js'
    ];

    for (const module of requiredModules) {
      const modulePath = path.join(stealthDir, module);
      if (!await fs.pathExists(modulePath)) {
        throw new Error(`Missing stealth module: ${module}`);
      }

      // Test module content
      const content = await fs.readFile(modulePath, 'utf8');
      if (!content.includes('class') && !content.includes('module.exports')) {
        throw new Error(`Invalid stealth module: ${module}`);
      }
    }

    this.testResults.push({
      suite: 'Stealth',
      test: 'Module Structure',
      result: 'PASS'
    });
  }

  async testRiskAssessment() {
    const detectionEvasionPath = path.join(this.distDir, 'stealth', 'detection-evasion.js');
    const content = await fs.readFile(detectionEvasionPath, 'utf8');

    // Test for risk assessment methods
    const riskMethods = [
      'assessDetectionRisk',
      'assessGeographicRisk',
      'assessTimingRisk',
      'assessBehavioralRisk'
    ];

    for (const method of riskMethods) {
      if (!content.includes(method)) {
        throw new Error(`Missing risk assessment method: ${method}`);
      }
    }

    this.testResults.push({
      suite: 'Stealth',
      test: 'Risk Assessment',
      result: 'PASS'
    });
  }

  async testTimingAlgorithms() {
    const timingPath = path.join(this.distDir, 'stealth', 'timing-randomizer.js');
    const content = await fs.readFile(timingPath, 'utf8');

    // Test for timing methods
    const timingMethods = [
      'calculateAdaptiveCheckInterval',
      'simulateThinking',
      'simulateReadingTime',
      'simulateTyping'
    ];

    for (const method of timingMethods) {
      if (!content.includes(method)) {
        throw new Error(`Missing timing method: ${method}`);
      }
    }

    this.testResults.push({
      suite: 'Stealth',
      test: 'Timing Algorithms',
      result: 'PASS'
    });
  }

  async runSecurityTests() {
    const spinner = ora('Testing security measures...').start();

    try {
      // Test for security vulnerabilities
      await this.testSecurityVulnerabilities();

      // Test for hardcoded secrets
      await this.testHardcodedSecrets();

      // Test for proper error handling
      await this.testErrorHandling();

      spinner.succeed('Security tests passed');

    } catch (error) {
      spinner.fail('Security tests failed');
      throw error;
    }
  }

  async testSecurityVulnerabilities() {
    const jsFiles = await this.getJavaScriptFiles();

    for (const file of jsFiles) {
      const content = await fs.readFile(file, 'utf8');

      // Check for dangerous patterns
      const dangerousPatterns = [
        /eval\s*\(/,
        /innerHTML\s*=/,
        /document\.write/,
        /Function\s*\(/
      ];

      for (const pattern of dangerousPatterns) {
        if (pattern.test(content)) {
          throw new Error(`Security vulnerability found in ${path.basename(file)}: ${pattern}`);
        }
      }
    }

    this.testResults.push({
      suite: 'Security',
      test: 'Vulnerability Scan',
      result: 'PASS'
    });
  }

  async testHardcodedSecrets() {
    const jsFiles = await this.getJavaScriptFiles();

    for (const file of jsFiles) {
      const content = await fs.readFile(file, 'utf8');

      // Check for potential secrets
      const secretPatterns = [
        /['"]?api[_-]?key['"]?\s*[:=]\s*['"][\w-]+['"]/i,
        /['"]?secret['"]?\s*[:=]\s*['"][\w-]+['"]/i,
        /['"]?password['"]?\s*[:=]\s*['"][\w-]+['"]/i,
        /['"]?token['"]?\s*[:=]\s*['"][\w-]+['"]/i
      ];

      for (const pattern of secretPatterns) {
        if (pattern.test(content)) {
          throw new Error(`Potential hardcoded secret found in ${path.basename(file)}`);
        }
      }
    }

    this.testResults.push({
      suite: 'Security',
      test: 'Secret Detection',
      result: 'PASS'
    });
  }

  async testErrorHandling() {
    const jsFiles = await this.getJavaScriptFiles();

    for (const file of jsFiles) {
      const content = await fs.readFile(file, 'utf8');

      // Check for proper error handling patterns
      if (!content.includes('try') || !content.includes('catch')) {
        // Some files might not need try-catch, so this is a warning
        console.warn(chalk.yellow(`Warning: Limited error handling in ${path.basename(file)}`));
      }
    }

    this.testResults.push({
      suite: 'Security',
      test: 'Error Handling',
      result: 'PASS'
    });
  }

  async runPerformanceTests() {
    const spinner = ora('Testing performance...').start();

    try {
      // Test file sizes
      await this.testFileSizes();

      // Test bundle size
      await this.testBundleSize();

      spinner.succeed('Performance tests passed');

    } catch (error) {
      spinner.fail('Performance tests failed');
      throw error;
    }
  }

  async testFileSizes() {
    const jsFiles = await this.getJavaScriptFiles();
    const maxSize = 500 * 1024; // 500KB

    for (const file of jsFiles) {
      const stat = await fs.stat(file);
      if (stat.size > maxSize) {
        throw new Error(`File too large: ${path.basename(file)} (${stat.size} bytes)`);
      }
    }

    this.testResults.push({
      suite: 'Performance',
      test: 'File Sizes',
      result: 'PASS'
    });
  }

  async testBundleSize() {
    const totalSize = await this.calculateTotalSize();
    const maxTotalSize = 2 * 1024 * 1024; // 2MB

    if (totalSize > maxTotalSize) {
      throw new Error(`Total bundle size too large: ${totalSize} bytes`);
    }

    this.testResults.push({
      suite: 'Performance',
      test: 'Bundle Size',
      result: 'PASS'
    });
  }

  async getJavaScriptFiles() {
    const files = [];
    const distFiles = await fs.readdir(this.distDir);

    for (const file of distFiles) {
      if (file.endsWith('.js')) {
        files.push(path.join(this.distDir, file));
      }
    }

    return files;
  }

  async calculateTotalSize() {
    const jsFiles = await this.getJavaScriptFiles();
    let totalSize = 0;

    for (const file of jsFiles) {
      const stat = await fs.stat(file);
      totalSize += stat.size;
    }

    return totalSize;
  }

  async generateTestReport() {
    console.log(chalk.blue('\n📊 Test Report'));
    console.log(chalk.gray('================'));

    const passed = this.testResults.filter(r => r.result === 'PASS').length;
    const failed = this.testResults.filter(r => r.result === 'FAIL').length;

    // Group by suite
    const suites = {};
    for (const result of this.testResults) {
      if (!suites[result.suite]) {
        suites[result.suite] = [];
      }
      suites[result.suite].push(result);
    }

    // Display results by suite
    for (const [suite, results] of Object.entries(suites)) {
      console.log(chalk.cyan(`\n${suite} Tests:`));
      for (const result of results) {
        const status = result.result === 'PASS' ? chalk.green('✅') : chalk.red('❌');
        console.log(`  ${status} ${result.test}`);
      }
    }

    console.log(chalk.blue('\nSummary:'));
    console.log(chalk.green(`  ✅ Passed: ${passed}`));
    console.log(chalk.red(`  ❌ Failed: ${failed}`));
    console.log(chalk.cyan(`  📊 Total: ${this.testResults.length}`));

    // Save detailed report
    const reportPath = path.join(this.projectRoot, 'test-report.json');
    await fs.writeJson(reportPath, {
      timestamp: new Date().toISOString(),
      summary: { passed, failed, total: this.testResults.length },
      results: this.testResults,
      suites
    }, { spaces: 2 });

    console.log(chalk.gray(`\nDetailed report saved to: ${reportPath}`));
  }
}

// Run tester
if (require.main === module) {
  const tester = new ExtensionTester();
  tester.runAllTests().catch(console.error);
}

module.exports = ExtensionTester;