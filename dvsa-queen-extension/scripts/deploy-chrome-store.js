#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');

class ChromeStoreDeployer {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.packageDir = path.join(this.projectRoot, 'packages');
    this.manifestPath = path.join(this.projectRoot, 'dist', 'manifest.json');
  }

  async deploy() {
    console.log(chalk.blue('🚀 Chrome Web Store Deployment Tool'));
    console.log(chalk.gray('Preparing TestNotifier extension for Chrome Web Store...\n'));

    try {
      // Validate requirements
      await this.validateRequirements();

      // Get deployment configuration
      const config = await this.getDeploymentConfig();

      // Prepare store assets
      await this.prepareStoreAssets(config);

      // Generate store listing data
      await this.generateStoreListing(config);

      // Create deployment package
      const storePackage = await this.createStorePackage(config);

      // Generate deployment instructions
      await this.generateDeploymentInstructions(config, storePackage);

      console.log(chalk.green('\n✅ Chrome Web Store deployment preparation complete!'));
      console.log(chalk.cyan(`📦 Store Package: ${storePackage}`));
      console.log(chalk.yellow('\n⚠️  Manual steps required:'));
      console.log(chalk.white('1. Upload the store package to Chrome Web Store Developer Dashboard'));
      console.log(chalk.white('2. Complete the store listing with generated content'));
      console.log(chalk.white('3. Submit for review'));

    } catch (error) {
      console.error(chalk.red('\n❌ Deployment preparation failed:'), error.message);
      process.exit(1);
    }
  }

  async validateRequirements() {
    const spinner = ora('Validating requirements...').start();

    try {
      // Check if manifest exists
      if (!await fs.pathExists(this.manifestPath)) {
        throw new Error('manifest.json not found. Run "npm run build" first.');
      }

      const manifest = await fs.readJson(this.manifestPath);

      // Validate manifest for Chrome Web Store
      this.validateManifestForStore(manifest);

      // Check for required icons
      const iconSizes = ['16', '32', '48', '128'];
      for (const size of iconSizes) {
        const iconPath = path.join(this.projectRoot, 'dist', `icons/simple/icon${size}.png`);
        if (!await fs.pathExists(iconPath)) {
          throw new Error(`Required icon missing: icon${size}.png`);
        }
      }

      spinner.succeed('Requirements validated');

    } catch (error) {
      spinner.fail('Requirements validation failed');
      throw error;
    }
  }

  validateManifestForStore(manifest) {
    const requiredFields = ['name', 'version', 'description', 'manifest_version'];

    for (const field of requiredFields) {
      if (!manifest[field]) {
        throw new Error(`Manifest missing required field for store: ${field}`);
      }
    }

    if (manifest.manifest_version !== 3) {
      throw new Error('Chrome Web Store requires Manifest V3');
    }

    if (!manifest.description || manifest.description.length < 50) {
      throw new Error('Description must be at least 50 characters for Chrome Web Store');
    }

    if (manifest.name.length > 45) {
      throw new Error('Extension name must be 45 characters or less for Chrome Web Store');
    }
  }

  async getDeploymentConfig() {
    console.log(chalk.blue('\n📋 Chrome Web Store Configuration'));

    const manifest = await fs.readJson(this.manifestPath);

    const questions = [
      {
        type: 'list',
        name: 'deploymentType',
        message: 'Select deployment type:',
        choices: [
          { name: 'Public - Available to everyone', value: 'public' },
          { name: 'Unlisted - Only accessible via direct link', value: 'unlisted' },
          { name: 'Private - Domain-restricted or trusted testers', value: 'private' }
        ],
        default: 'public'
      },
      {
        type: 'checkbox',
        name: 'categories',
        message: 'Select categories (choose all that apply):',
        choices: [
          'Productivity',
          'Developer Tools',
          'Education',
          'Utilities',
          'Shopping'
        ],
        default: ['Productivity', 'Utilities']
      },
      {
        type: 'input',
        name: 'websiteUrl',
        message: 'Support website URL:',
        default: 'https://testnotifier.co.uk'
      },
      {
        type: 'input',
        name: 'privacyPolicyUrl',
        message: 'Privacy policy URL:',
        default: 'https://testnotifier.co.uk/privacy'
      },
      {
        type: 'confirm',
        name: 'includeScreenshots',
        message: 'Include screenshot generation?',
        default: true
      }
    ];

    const answers = await inquirer.prompt(questions);

    return {
      ...answers,
      manifest,
      extensionName: manifest.name,
      version: manifest.version,
      description: manifest.description
    };
  }

  async prepareStoreAssets(config) {
    const spinner = ora('Preparing store assets...').start();

    try {
      const assetsDir = path.join(this.packageDir, 'chrome-store-assets');
      await fs.ensureDir(assetsDir);

      // Copy icons for store use
      const iconDir = path.join(assetsDir, 'icons');
      await fs.ensureDir(iconDir);

      const iconSizes = ['16', '32', '48', '128'];
      for (const size of iconSizes) {
        const sourceIcon = path.join(this.projectRoot, 'dist', `icons/simple/icon${size}.png`);
        const targetIcon = path.join(iconDir, `icon${size}.png`);
        await fs.copy(sourceIcon, targetIcon);
      }

      // Create promotional images if they don't exist
      await this.createPromotionalImages(assetsDir);

      spinner.succeed('Store assets prepared');

    } catch (error) {
      spinner.fail('Store assets preparation failed');
      throw error;
    }
  }

  async createPromotionalImages(assetsDir) {
    // Create placeholder promotional images
    // In a real implementation, these would be actual screenshots/designs
    const promoDir = path.join(assetsDir, 'promotional');
    await fs.ensureDir(promoDir);

    // Create README for promotional images
    const readmeContent = `# Promotional Images

## Required Sizes for Chrome Web Store:

### Screenshots:
- 1280x800 (minimum)
- 2560x1600 (recommended)

### Promotional Images:
- Small: 440x280 pixels
- Large: 920x680 pixels
- Marquee: 1400x560 pixels

## Screenshot Suggestions:

1. **Main Dashboard**: Show the multi-pupil management interface
2. **Pupil Management**: Show adding/editing pupils
3. **Test Centre Selection**: Show the searchable test centre interface
4. **Settings**: Show the configuration options
5. **Notifications**: Show notification preferences

## Current Status:
⚠️ Placeholder files created - Replace with actual screenshots before submission
`;

    await fs.writeFile(path.join(promoDir, 'README.md'), readmeContent);
  }

  async generateStoreListing(config) {
    const spinner = ora('Generating store listing content...').start();

    try {
      const listingDir = path.join(this.packageDir, 'store-listing');
      await fs.ensureDir(listingDir);

      // Generate detailed description
      const detailedDescription = this.generateDetailedDescription(config);

      // Generate feature list
      const features = this.generateFeatureList();

      // Generate privacy policy template
      const privacyPolicy = this.generatePrivacyPolicy();

      // Create listing content
      const listingContent = {
        name: config.extensionName,
        shortDescription: config.description,
        detailedDescription,
        features,
        categories: config.categories,
        deploymentType: config.deploymentType,
        websiteUrl: config.websiteUrl,
        privacyPolicyUrl: config.privacyPolicyUrl,
        version: config.version,
        createdAt: new Date().toISOString()
      };

      await fs.writeJson(
        path.join(listingDir, 'store-listing.json'),
        listingContent,
        { spaces: 2 }
      );

      // Create separate files for easy copying
      await fs.writeFile(
        path.join(listingDir, 'detailed-description.txt'),
        detailedDescription
      );

      await fs.writeFile(
        path.join(listingDir, 'features.txt'),
        features.join('\n')
      );

      await fs.writeFile(
        path.join(listingDir, 'privacy-policy-template.md'),
        privacyPolicy
      );

      spinner.succeed('Store listing content generated');

    } catch (error) {
      spinner.fail('Store listing generation failed');
      throw error;
    }
  }

  generateDetailedDescription(config) {
    return `TestNotifier is a professional Chrome extension designed specifically for driving instructors to efficiently manage multiple pupils' DVSA driving test bookings and find cancellation slots.

🎯 PERFECT FOR DRIVING INSTRUCTORS
Manage unlimited pupils (based on your plan) with our intuitive multi-pupil dashboard. Keep track of all your pupils' test dates, preferred test centres, and monitoring status in one professional interface.

🔍 SMART TEST CENTRE SEARCH
Access our comprehensive database of 400+ official DVSA test centres across the UK. Search by name, city, or postcode, and select multiple preferred centres for each pupil. Our smart autocomplete makes finding centres quick and easy.

⚡ REAL-TIME NOTIFICATIONS
Get instant browser notifications when test slots become available. Never miss a cancellation opportunity again. Configure notification preferences per pupil and stay updated on all your pupils' progress.

📊 PROFESSIONAL DASHBOARD
Track your business metrics with our comprehensive dashboard. Monitor total pupils, active monitoring status, slots found, and success rates. Make data-driven decisions to optimize your instruction business.

🔧 CUSTOMIZABLE SETTINGS
Configure monitoring preferences for each pupil individually. Set 24/7 monitoring, rapid checking mode (500ms intervals), stealth mode for anti-detection, browser notifications, and sound alerts based on your needs.

✅ PLANS FOR EVERY INSTRUCTOR
Choose from flexible pricing plans: Free (1 pupil), Starter (3 pupils), Premium (5 pupils), or Pro (unlimited pupils). Scale your usage as your business grows.

🛡️ SAFE & COMPLIANT
Designed with safety and compliance in mind. No automated booking functionality - all changes require manual confirmation. Respects DVSA website terms and guidelines.

Key Features:
• Multi-pupil management system
• 400+ DVSA test centres database
• Real-time cancellation monitoring
• Instant browser notifications
• Professional instructor dashboard
• Customizable monitoring settings
• Plan-based usage limits
• Secure data storage
• Responsive design
• No automated booking (compliance-safe)

Perfect for:
• Driving instructors (ADI/PDI)
• Driving schools
• Independent instructors
• Instructor trainers

Get started today and never miss a test cancellation opportunity again!

Support: ${config.websiteUrl}
Privacy Policy: ${config.privacyPolicyUrl}`;
  }

  generateFeatureList() {
    return [
      '🎯 Multi-pupil management dashboard',
      '🔍 400+ DVSA test centres database',
      '⚡ Real-time cancellation notifications',
      '📊 Professional instructor statistics',
      '🔧 Customizable monitoring settings',
      '🔔 Instant browser notifications',
      '⚙️ Per-pupil configuration',
      '📱 Responsive modern interface',
      '🛡️ Safe & compliant design',
      '📈 Business growth tracking'
    ];
  }

  generatePrivacyPolicy() {
    return `# TestNotifier Privacy Policy

Last Updated: ${new Date().toISOString()}

## Overview
TestNotifier is a Chrome extension designed for driving instructors to manage pupil test bookings and monitor for cancellation opportunities.

## Data Collection

### Information We Collect:
- Pupil information (names, test details, preferences)
- Test centre selections and preferences
- Extension usage statistics
- Notification preferences

### Information We Do NOT Collect:
- DVSA login credentials
- Personal identification numbers
- Financial information
- Browsing history outside of DVSA website

## Data Storage
All data is stored locally in your browser using Chrome's extension storage API. No data is transmitted to external servers.

## Use of Information
Collected information is used solely for:
- Managing pupil test bookings
- Providing notification services
- Extension functionality
- User experience improvements

## Data Security
We implement appropriate security measures to protect your information:
- Local browser storage encryption
- No external data transmission
- Secure extension architecture

## Third-Party Services
This extension interacts with:
- DVSA official website (driverpracticaltest.dvsa.gov.uk)
- Chrome notification system
- Chrome storage API

## Your Rights
You have the right to:
- Access your stored data
- Modify or delete pupil information
- Disable the extension at any time
- Clear all extension data

## Contact
For privacy-related questions, contact: [YOUR CONTACT INFORMATION]

## Changes to This Policy
We may update this privacy policy from time to time. Changes will be communicated through the extension or our website.`;
  }

  async createStorePackage(config) {
    const spinner = ora('Creating Chrome Web Store package...').start();

    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const packageName = `testnotifier-chrome-store-v${config.version}-${timestamp}.zip`;
      const storePackagePath = path.join(this.packageDir, packageName);

      // Create Chrome Web Store compatible package
      // This is similar to regular package but with additional store-specific files
      const output = fs.createWriteStream(storePackagePath);
      const archive = archiver('zip', {
        zlib: { level: 9 }
      });

      return new Promise((resolve, reject) => {
        output.on('close', () => {
          spinner.succeed(`Chrome Web Store package created: ${archive.pointer()} bytes`);
          resolve(storePackagePath);
        });

        archive.on('error', (err) => {
          spinner.fail('Store package creation failed');
          reject(err);
        });

        archive.pipe(output);

        // Add extension files from dist
        const distDir = path.join(this.projectRoot, 'dist');
        archive.directory(distDir, false);

        // Add store-specific documentation
        archive.append(Buffer.from(this.generateStoreReadme(config)), {
          name: 'CHROME_STORE_README.txt'
        });

        archive.finalize();
      });

    } catch (error) {
      spinner.fail('Store package creation failed');
      throw error;
    }
  }

  generateStoreReadme(config) {
    return `TestNotifier - Chrome Web Store Submission
Version: ${config.version}
Build Date: ${new Date().toISOString()}

CHROME WEB STORE SUBMISSION CHECKLIST:

✅ Extension Package:
- Manifest V3 compatible
- All required icons (16, 32, 48, 128px)
- Proper permissions declared
- Content security policy configured

✅ Store Listing Requirements:
- Name: ${config.extensionName}
- Short description: ${config.description}
- Detailed description prepared
- Category: ${config.categories.join(', ')}
- Privacy policy: ${config.privacyPolicyUrl}
- Support website: ${config.websiteUrl}

✅ Deployment Settings:
- Visibility: ${config.deploymentType}
- Regions: All regions (default)

📋 NEXT STEPS:
1. Upload this package to Chrome Web Store Developer Dashboard
2. Complete store listing with generated content
3. Add promotional images (screenshots)
4. Submit for review

⚠️ IMPORTANT NOTES:
- Review process typically takes 1-3 business days
- Ensure all content complies with Chrome Web Store policies
- Test extension thoroughly before submission
- Keep backup of all submission materials

For support: ${config.websiteUrl}
`;
  }

  async generateDeploymentInstructions(config, storePackage) {
    const spinner = ora('Generating deployment instructions...').start();

    try {
      const instructionsPath = path.join(this.packageDir, 'DEPLOYMENT_INSTRUCTIONS.md');

      const instructions = `# TestNotifier Chrome Web Store Deployment Instructions

## Package Information
- **Version**: ${config.version}
- **Package**: ${path.basename(storePackage)}
- **Build Date**: ${new Date().toISOString()}
- **Deployment Type**: ${config.deploymentType}

## Pre-Deployment Checklist

### 1. Chrome Web Store Developer Account
- [ ] Ensure you have a Chrome Web Store developer account
- [ ] Pay the one-time developer registration fee (if not already paid)
- [ ] Set up your developer profile

### 2. Package Validation
- [ ] Test the extension locally in Chrome
- [ ] Verify all features work correctly
- [ ] Check for any console errors
- [ ] Validate manifest.json structure

### 3. Store Assets Preparation
- [ ] Create promotional images (screenshots)
- [ ] Prepare detailed description
- [ ] Write feature highlights
- [ ] Prepare privacy policy

## Deployment Steps

### Step 1: Upload to Developer Dashboard
1. Visit: https://chrome.google.com/webstore/devconsole/
2. Click "New Item"
3. Upload the package: \`${path.basename(storePackage)}\`
4. Wait for automatic validation

### Step 2: Complete Store Listing
**Basic Information:**
- **Name**: ${config.extensionName}
- **Summary**: ${config.description}
- **Category**: ${config.categories.join(', ')}

**Detailed Description:**
Use the content from \`packages/store-listing/detailed-description.txt\`

**Features:**
Use the content from \`packages/store-listing/features.txt\`

### Step 3: Add Visual Assets
**Required Icons:**
- 16x16px: ✓ Included
- 32x32px: ✓ Included
- 48x48px: ✓ Included
- 128x128px: ✓ Included

**Screenshots (5 minimum recommended):**
1. Main dashboard with multiple pupils
2. Pupil management interface
3. Test centre selection with search
4. Settings and configuration
5. Notification preferences

**Promotional Images:**
- Small: 440x280px
- Large: 920x680px
- Marquee: 1400x560px

### Step 4: Configure Distribution
- **Visibility**: ${config.deploymentType}
- **Regions**: Select target countries
- **Website**: ${config.websiteUrl}
- **Privacy Policy**: ${config.privacyPolicyUrl}

### Step 5: Privacy & Compliance
- [ ] Complete data collection disclosure
- [ ] Specify single purpose (test booking management)
- [ ] Confirm no remote code execution
- [ ] Verify permission requests are justified

### Step 6: Submit for Review
1. Review all information for accuracy
2. Click "Submit for Review"
3. Monitor email for updates

## Post-Submission

### Review Timeline
- **Typical Review Time**: 1-3 business days
- **Complex Extensions**: Up to 7 business days
- **Revisions**: May require additional review time

### Common Rejection Reasons
1. **Insufficient Description**: Be detailed about functionality
2. **Missing Screenshots**: Include all required images
3. **Permission Issues**: Justify all requested permissions
4. **Policy Violations**: Ensure compliance with all store policies

### After Approval
- [ ] Monitor user feedback and ratings
- [ ] Respond to user reviews professionally
- [ ] Plan regular updates and improvements
- [ ] Track usage analytics

## Support & Updates

### Maintaining Your Extension
- Monitor Chrome Web Store policy updates
- Test with new Chrome versions
- Respond to user feedback
- Plan regular feature updates

### Version Updates
1. Increment version in manifest.json
2. Run \`npm run package\` to create new package
3. Upload new version to developer dashboard
4. Update store listing if needed
5. Submit for review

## Resources

### Chrome Web Store Documentation
- [Developer Program Policies](https://developer.chrome.com/docs/webstore/program_policies/)
- [Extension Quality Guidelines](https://developer.chrome.com/docs/webstore/quality_guidelines/)
- [User Data FAQ](https://developer.chrome.com/docs/webstore/user_data/)

### Support
- Website: ${config.websiteUrl}
- Privacy Policy: ${config.privacyPolicyUrl}
- Chrome Web Store Developer Support

---

**Generated**: ${new Date().toISOString()}
**Version**: ${config.version}
`;

      await fs.writeFile(instructionsPath, instructions);

      spinner.succeed('Deployment instructions generated');

    } catch (error) {
      spinner.fail('Deployment instructions generation failed');
      throw error;
    }
  }
}

// Run deployer
if (require.main === module) {
  const deployer = new ChromeStoreDeployer();
  deployer.deploy().catch(console.error);
}

module.exports = ChromeStoreDeployer;
