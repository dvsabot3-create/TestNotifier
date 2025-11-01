#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');

class ExtensionDeployer {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.packageDir = path.join(this.projectRoot, 'packages');
    this.deployConfig = null;
  }

  async deploy() {
    console.log(chalk.blue('🚀 DVSA Queen Extension Deployment'));
    console.log(chalk.gray('Preparing deployment...\n'));

    try {
      // Load deployment configuration
      await this.loadDeployConfig();

      // Select deployment method
      const deploymentMethod = await this.selectDeploymentMethod();

      switch (deploymentMethod) {
        case 'chrome-web-store':
          await this.deployToChromeWebStore();
          break;
        case 'manual-distribution':
          await this.prepareManualDistribution();
          break;
        case 'enterprise':
          await this.prepareEnterpriseDeployment();
          break;
        default:
          throw new Error('Invalid deployment method');
      }

      console.log(chalk.green('\n✅ Deployment completed successfully!'));

    } catch (error) {
      console.error(chalk.red('\n❌ Deployment failed:'), error.message);
      process.exit(1);
    }
  }

  async loadDeployConfig() {
    const configPath = path.join(this.projectRoot, 'deploy.config.json');

    if (await fs.pathExists(configPath)) {
      this.deployConfig = await fs.readJson(configPath);
    } else {
      this.deployConfig = await this.createDeployConfig();
    }
  }

  async createDeployConfig() {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'extensionName',
        message: 'Extension name:',
        default: 'DVSA Queen'
      },
      {
        type: 'input',
        name: 'developerName',
        message: 'Developer name:'
      },
      {
        type: 'input',
        name: 'supportEmail',
        message: 'Support email:'
      },
      {
        type: 'input',
        name: 'website',
        message: 'Website URL:'
      },
      {
        type: 'list',
        name: 'targetAudience',
        message: 'Target audience:',
        choices: [
          'Driving Instructors',
          'Driving Schools',
          'Individual Learners',
          'Enterprise'
        ]
      }
    ]);

    const config = {
      ...answers,
      created: new Date().toISOString(),
      deployment: {
        chromeWebStore: {
          enabled: false,
          itemId: null,
          publishTarget: 'trustedTesters'
        },
        manual: {
          enabled: true,
          includeSource: false
        },
        enterprise: {
          enabled: false,
          forceInstall: false,
          updateUrl: null
        }
      }
    };

    const configPath = path.join(this.projectRoot, 'deploy.config.json');
    await fs.writeJson(configPath, config, { spaces: 2 });

    return config;
  }

  async selectDeploymentMethod() {
    const { method } = await inquirer.prompt([
      {
        type: 'list',
        name: 'method',
        message: 'Select deployment method:',
        choices: [
          {
            name: 'Chrome Web Store (requires developer account)',
            value: 'chrome-web-store'
          },
          {
            name: 'Manual Distribution (ZIP package)',
            value: 'manual-distribution'
          },
          {
            name: 'Enterprise Deployment (Admin Console)',
            value: 'enterprise'
          }
        ]
      }
    ]);

    return method;
  }

  async deployToChromeWebStore() {
    const spinner = ora('Preparing Chrome Web Store deployment...').start();

    try {
      // Check for latest package
      const latestPackage = await this.getLatestPackage();

      if (!latestPackage) {
        throw new Error('No package found. Run "npm run package" first.');
      }

      spinner.text = 'Creating Chrome Web Store package...';

      // Prepare Chrome Web Store specific files
      const chromePackage = await this.prepareChromeWebStorePackage(latestPackage);

      spinner.text = 'Generating Chrome Web Store metadata...';

      // Generate store listing data
      const storeData = await this.generateChromeWebStoreData();

      // Save deployment package
      const deployPackage = path.join(this.packageDir, 'chrome-web-store-package.zip');
      await fs.copy(chromePackage, deployPackage);

      // Save metadata
      const metadataPath = deployPackage.replace('.zip', '-metadata.json');
      await fs.writeJson(metadataPath, storeData, { spaces: 2 });

      spinner.succeed('Chrome Web Store package ready');

      console.log(chalk.cyan('\n📋 Chrome Web Store Deployment Instructions:'));
      console.log('1. Go to https://chrome.google.com/webstore/developer/dashboard');
      console.log('2. Click "Add new item"');
      console.log('3. Upload the package:', chalk.yellow(deployPackage));
      console.log('4. Fill in the store listing using the metadata file');
      console.log('5. Submit for review');

      // Save deployment info
      await this.saveDeploymentInfo('chrome-web-store', {
        package: deployPackage,
        metadata: metadataPath,
        status: 'ready-for-upload'
      });

    } catch (error) {
      spinner.fail('Chrome Web Store deployment preparation failed');
      throw error;
    }
  }

  async prepareManualDistribution() {
    const spinner = ora('Preparing manual distribution package...').start();

    try {
      const latestPackage = await this.getLatestPackage();

      if (!latestPackage) {
        throw new Error('No package found. Run "npm run package" first.');
      }

      // Create distribution package
      const distPackage = path.join(this.packageDir, 'manual-distribution.zip');
      await fs.copy(latestPackage, distPackage);

      // Generate installation instructions
      const instructions = this.generateInstallationInstructions();
      const instructionsPath = distPackage.replace('.zip', '-INSTALL.txt');
      await fs.writeFile(instructionsPath, instructions);

      // Generate user guide
      const userGuide = this.generateUserGuide();
      const userGuidePath = distPackage.replace('.zip', '-USER-GUIDE.pdf');
      await fs.writeFile(userGuidePath, userGuide);

      spinner.succeed('Manual distribution package ready');

      console.log(chalk.cyan('\n📦 Manual Distribution Package Created:'));
      console.log('Package:', chalk.yellow(distPackage));
      console.log('Instructions:', chalk.yellow(instructionsPath));
      console.log('User Guide:', chalk.yellow(userGuidePath));

      // Save deployment info
      await this.saveDeploymentInfo('manual-distribution', {
        package: distPackage,
        instructions: instructionsPath,
        userGuide: userGuidePath,
        status: 'ready-for-distribution'
      });

    } catch (error) {
      spinner.fail('Manual distribution preparation failed');
      throw error;
    }
  }

  async prepareEnterpriseDeployment() {
    const spinner = ora('Preparing enterprise deployment...').start();

    try {
      const latestPackage = await this.getLatestPackage();

      if (!latestPackage) {
        throw new Error('No package found. Run "npm run package" first.');
      }

      // Create enterprise package
      const enterprisePackage = path.join(this.packageDir, 'enterprise-deployment.zip');
      await fs.copy(latestPackage, enterprisePackage);

      // Generate enterprise configuration
      const enterpriseConfig = await this.generateEnterpriseConfig();
      const configPath = enterprisePackage.replace('.zip', '-config.json');
      await fs.writeJson(configPath, enterpriseConfig, { spaces: 2 });

      // Generate admin guide
      const adminGuide = this.generateAdminGuide();
      const adminGuidePath = enterprisePackage.replace('.zip', '-ADMIN-GUIDE.txt');
      await fs.writeFile(adminGuidePath, adminGuide);

      spinner.succeed('Enterprise deployment package ready');

      console.log(chalk.cyan('\n🏢 Enterprise Deployment Package Created:'));
      console.log('Package:', chalk.yellow(enterprisePackage));
      console.log('Configuration:', chalk.yellow(configPath));
      console.log('Admin Guide:', chalk.yellow(adminGuidePath));

      // Save deployment info
      await this.saveDeploymentInfo('enterprise', {
        package: enterprisePackage,
        configuration: configPath,
        adminGuide: adminGuidePath,
        status: 'ready-for-admin-console'
      });

    } catch (error) {
      spinner.fail('Enterprise deployment preparation failed');
      throw error;
    }
  }

  async getLatestPackage() {
    if (!await fs.pathExists(this.packageDir)) {
      return null;
    }

    const packages = await fs.readdir(this.packageDir);
    const zipPackages = packages.filter(p => p.endsWith('.zip') && !p.includes('metadata') && !p.includes('deployment'));

    if (zipPackages.length === 0) {
      return null;
    }

    // Get the most recent package
    zipPackages.sort((a, b) => b.localeCompare(a));
    return path.join(this.packageDir, zipPackages[0]);
  }

  async prepareChromeWebStorePackage(latestPackage) {
    // Chrome Web Store might have specific requirements
    // For now, just return the existing package
    return latestPackage;
  }

  async generateChromeWebStoreData() {
    return {
      name: this.deployConfig.extensionName,
      shortName: 'DVSA Queen',
      description: this.deployConfig.description || 'Professional DVSA test cancellation finder with advanced stealth technology',
      detailedDescription: `Advanced Chrome extension for driving instructors to find DVSA test cancellations.

Features:
• Real-time cancellation monitoring
• Advanced stealth technology
• Multi-pupil management
• Risk assessment algorithms
• Emergency detection evasion

Perfect for ADIs (Approved Driving Instructors) who want to find earlier test dates for their pupils.`,
      category: 'Productivity',
      language: 'en',
      screenshots: [
        'screenshot1.png',
        'screenshot2.png',
        'screenshot3.png'
      ],
      icons: {
        '16': 'icons/icon16.png',
        '48': 'icons/icon48.png',
        '128': 'icons/icon128.png'
      },
      developer: {
        name: this.deployConfig.developerName,
        email: this.deployConfig.supportEmail,
        website: this.deployConfig.website
      },
      privacyPolicy: `${this.deployConfig.website}/privacy`,
      supportUrl: `${this.deployConfig.website}/support`,
      permissionsJustification: `The extension requires these permissions to:
• Access DVSA booking pages (activeTab)
• Store instructor and pupil data (storage)
• Send notifications about found cancellations (notifications)
• Monitor page changes (tabs)`
    };
  }

  generateInstallationInstructions() {
    return `DVSA QUEEN EXTENSION - INSTALLATION INSTRUCTIONS
Version: ${new Date().toISOString()}

⚠️  IMPORTANT: This extension is for legitimate driving instructors only.

SYSTEM REQUIREMENTS:
• Google Chrome 88 or higher
• Windows 10/11, macOS 10.15+, or Linux
• Active internet connection

INSTALLATION STEPS:
1. Open Google Chrome
2. Navigate to chrome://extensions/
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the extension folder or .zip file
6. Verify the extension appears in your toolbar

INITIAL SETUP:
1. Click the extension icon in Chrome toolbar
2. Enter your ADI (Approved Driving Instructor) number
3. Set your base location and travel radius
4. Add pupil licence numbers
5. Navigate to DVSA change booking page
6. The extension will automatically activate

USAGE:
• Automatic monitoring starts when on DVSA pages
• Manual checks available via extension popup
• Real-time notifications for found cancellations
• Stealth mode protects against detection

TROUBLESHOOTING:
• Ensure you're on DVSA booking pages
• Check that extension has required permissions
• Verify ADI number format (ADI123456)
• Contact support if issues persist

SUPPORT:
Email: ${this.deployConfig.supportEmail}
Website: ${this.deployConfig.website}

By using this extension, you agree to comply with DVSA terms of service.
`;
  }

  generateUserGuide() {
    return `DVSA QUEEN EXTENSION - USER GUIDE

OVERVIEW:
DVSA Queen is a professional Chrome extension designed for driving instructors to find earlier test dates for their pupils through DVSA's cancellation system.

KEY FEATURES:
✅ Advanced stealth technology to avoid detection
✅ Real-time cancellation monitoring
✅ Multi-pupil management
✅ Risk assessment and safety protocols
✅ Emergency stop functionality

GETTING STARTED:

1. INSTRUCTOR SETUP
   - Click extension icon → "Setup Instructor"
   - Enter ADI number (format: ADI123456)
   - Set base location (city)
   - Configure travel radius (10-100km)

2. ADDING PUPILS
   - Navigate to "Pupils Management" section
   - Enter pupil licence number (format: SMITH123456S)
   - Set preferred test centres
   - Configure date ranges

3. ACTIVATION
   - Navigate to DVSA change booking page
   - Extension automatically activates
   - Stealth monitoring begins
   - Real-time notifications enabled

STEALTH TECHNOLOGY:

The extension uses advanced stealth techniques:
• Human-like mouse movements with curved paths
• Adaptive timing based on DVSA server load
• Risk assessment with 6-factor analysis
• Emergency mode for high-risk situations
• Behavioral pattern camouflage

INTERFACE ELEMENTS:

🔍 Stealth Check Button
   - Performs manual cancellation check
   - Applies full stealth protection
   - Shows real-time risk assessment

🛑 Emergency Stop Button
   - Immediately halts all operations
   - Clears monitoring intervals
   - Sends emergency notification

📊 Status Indicators
   - Green: Low risk, normal operation
   - Yellow: Medium risk, extra caution
   - Red: High risk, operations blocked

BEST PRACTICES:

✅ DO:
   • Use realistic check intervals
   • Monitor risk indicators
   • Keep pupil data updated
   • Test emergency stop regularly
   • Follow DVSA guidelines

❌ DON'T:
   • Use on multiple machines simultaneously
   • Override safety warnings
   • Share with non-instructors
   • Use for fraudulent purposes
   • Ignore high-risk alerts

TROUBLESHOOTING:

Problem: Extension not activating
Solution: Ensure you're on DVSA change booking page

Problem: High risk warnings
Solution: Reduce check frequency, wait between operations

Problem: No cancellations found
Solution: Check pupil preferences, expand date range

Problem: Extension blocked
Solution: Use emergency stop, wait before resuming

SUPPORT:
For technical support, feature requests, or bug reports:
📧 Email: ${this.deployConfig.supportEmail}
🌐 Website: ${this.deployConfig.website}

This guide is for legitimate driving instructors only.
Always comply with DVSA terms and conditions.
`;
  }

  async generateEnterpriseConfig() {
    return {
      extensionSettings: {
        forceInstall: false,
        updateUrl: `${this.deployConfig.website}/updates`,
        allowedInstallSites: ['*.dvsa.gov.uk'],
        blockedInstallSites: []
      },
      policySettings: {
        maxPupilsPerInstructor: 50,
        maxDailyChecks: 100,
        minCheckInterval: 30000,
        enableStealth: true,
        enableEmergencyStop: true,
        logLevel: 'INFO'
      },
      deploymentSettings: {
        autoUpdate: true,
        silentInstall: true,
        organizationOnly: true,
        requireAdminApproval: true
      },
      monitoringSettings: {
        enableUsageReporting: true,
        enableErrorReporting: true,
        enablePerformanceMetrics: true,
        reportingEndpoint: `${this.deployConfig.website}/api/enterprise/report`
      }
    };
  }

  generateAdminGuide() {
    return `DVSA QUEEN EXTENSION - ADMIN GUIDE (ENTERPRISE)

OVERVIEW:
This guide covers enterprise deployment and administration of the DVSA Queen extension for driving schools and instructor organizations.

DEPLOYMENT METHODS:

1. GOOGLE ADMIN CONSOLE
   - Navigate to admin.google.com
   - Go to Devices → Chrome → Apps & extensions
   - Click "Add" → "Add Chrome app or extension by ID"
   - Upload the enterprise package
   - Configure policies and settings

2. FORCE INSTALLATION
   - Set force install for organizational units
   - Configure update URLs
   - Set permissions and policies
   - Test deployment on pilot group

3. POLICY CONFIGURATION
   - Maximum pupils per instructor
   - Daily check limits
   - Minimum check intervals
   - Stealth level settings
   - Emergency stop permissions

MONITORING AND REPORTING:

Usage Analytics:
• Track extension usage across organization
• Monitor success rates and performance
• Identify high-risk usage patterns
• Generate compliance reports

Security Monitoring:
• Detect unusual activity patterns
• Monitor for detection attempts
• Track emergency stop activations
• Alert on policy violations

TROUBLESHOOTING:

Deployment Issues:
• Check Admin Console permissions
• Verify extension ID and version
• Test on clean Chrome profile
• Review policy conflicts

User Issues:
• Provide user training materials
• Set up support channels
• Create troubleshooting guides
• Establish escalation procedures

COMPLIANCE:

Data Protection:
• Ensure GDPR compliance
• Implement data retention policies
• Secure data transmission
• Regular security audits

DVSA Compliance:
• Monitor for terms of service violations
• Implement usage guidelines
• Regular compliance reviews
• Incident response procedures

SUPPORT CONTACTS:

Technical Support: ${this.deployConfig.supportEmail}
Enterprise Support: enterprise@${this.deployConfig.supportEmail.split('@')[1]}
Emergency Contact: +44-XXX-XXX-XXXX

For enterprise-specific issues and custom deployments, contact our enterprise support team.
`;
  }

  async saveDeploymentInfo(method, data) {
    const deploymentInfo = {
      timestamp: new Date().toISOString(),
      method,
      config: this.deployConfig,
      data,
      status: 'completed'
    };

    const infoPath = path.join(this.packageDir, `deployment-${Date.now()}.json`);
    await fs.writeJson(infoPath, deploymentInfo, { spaces: 2 });

    console.log(chalk.gray(`\nDeployment info saved to: ${infoPath}`));
  }
}

// Run deployer
if (require.main === module) {
  const deployer = new ExtensionDeployer();
  deployer.deploy().catch(console.error);
}

module.exports = ExtensionDeployer;