#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const { execSync } = require('child_process');

class ExtensionBuilder {
  constructor() {
    this.projectRoot = path.resolve(__dirname);
    this.srcDir = path.join(this.projectRoot, 'src');
    this.distDir = path.join(this.projectRoot, 'dist');
    this.stealthDir = path.join(this.projectRoot, 'stealth');
  }

  async build(options = {}) {
    const { production = true, watch = false } = options;

    console.log(chalk.blue('🔨 DVSA Queen Extension Builder'));
    console.log(chalk.gray(`Mode: ${production ? 'Production' : 'Development'}`));
    console.log(chalk.gray(`Build type: ${watch ? 'Watch' : 'Single'}\n`));

    try {
      // Clean previous build
      await this.clean();

      // Create build directory
      await this.createBuildDirectory();

      // Copy static files
      await this.copyStaticFiles();

      // Process JavaScript files
      await this.processJavaScriptFiles();

      // Process CSS files
      await this.processCSSFiles();

      // Generate combined files
      await this.generateCombinedFiles();

      // Validate build
      await this.validateBuild();

      console.log(chalk.green('\n✅ Build completed successfully!'));

      if (production) {
        const size = await this.calculateBuildSize();
        console.log(chalk.cyan(`📊 Build size: ${this.formatBytes(size)}`));
      }

      return true;

    } catch (error) {
      console.error(chalk.red('\n❌ Build failed:'), error.message);
      process.exit(1);
    }
  }

  async clean() {
    const spinner = ora('Cleaning previous build...').start();

    try {
      await fs.remove(this.distDir);
      spinner.succeed('Clean complete');
    } catch (error) {
      spinner.fail('Clean failed');
      throw error;
    }
  }

  async createBuildDirectory() {
    const spinner = ora('Creating build directory...').start();

    try {
      await fs.ensureDir(this.distDir);
      await fs.ensureDir(path.join(this.distDir, 'stealth'));
      await fs.ensureDir(path.join(this.distDir, 'icons'));
      spinner.succeed('Build directory created');
    } catch (error) {
      spinner.fail('Directory creation failed');
      throw error;
    }
  }

  async copyStaticFiles() {
    const spinner = ora('Copying static files...').start();

    try {
      // Copy manifest
      await fs.copy(
        path.join(this.projectRoot, 'manifest.json'),
        path.join(this.distDir, 'manifest.json')
      );

      // Copy HTML files
      await fs.copy(
        path.join(this.projectRoot, 'popup.html'),
        path.join(this.distDir, 'popup.html')
      );

      // Copy icons (if they exist)
      const iconsDir = path.join(this.projectRoot, 'icons');
      if (await fs.pathExists(iconsDir)) {
        await fs.copy(iconsDir, path.join(this.distDir, 'icons'));
      }

      // Copy stealth modules
      const stealthFiles = await fs.readdir(this.stealthDir);
      for (const file of stealthFiles) {
        if (file.endsWith('.js')) {
          await fs.copy(
            path.join(this.stealthDir, file),
            path.join(this.distDir, 'stealth', file)
          );
        }
      }

      spinner.succeed('Static files copied');
    } catch (error) {
      spinner.fail('Static file copy failed');
      throw error;
    }
  }

  async processJavaScriptFiles() {
    const spinner = ora('Processing JavaScript files...').start();

    try {
      // Process background script
      await this.processBackgroundScript();

      // Process popup script
      await this.processPopupScript();

      // Process integrated content script
      await this.processContentScript();

      spinner.succeed('JavaScript files processed');
    } catch (error) {
      spinner.fail('JavaScript processing failed');
      throw error;
    }
  }

  async processBackgroundScript() {
    const backgroundPath = path.join(this.projectRoot, 'background.js');
    const outputPath = path.join(this.distDir, 'background.js');

    let content = await fs.readFile(backgroundPath, 'utf8');

    // Add build timestamp
    content = `// DVSA Queen Extension - Built: ${new Date().toISOString()}\n${content}`;

    // Minify in production
    if (this.isProduction()) {
      content = this.minifyJavaScript(content);
    }

    await fs.writeFile(outputPath, content);
  }

  async processPopupScript() {
    const popupPath = path.join(this.projectRoot, 'popup.js');
    const outputPath = path.join(this.distDir, 'popup.js');

    let content = await fs.readFile(popupPath, 'utf8');

    // Add build info
    content = `// DVSA Queen Popup - Built: ${new Date().toISOString()}\n${content}`;

    // Minify in production
    if (this.isProduction()) {
      content = this.minifyJavaScript(content);
    }

    await fs.writeFile(outputPath, content);
  }

  async processContentScript() {
    const contentPath = path.join(this.projectRoot, 'content-integrated.js');
    const outputPath = path.join(this.distDir, 'content-script.js');

    let content = await fs.readFile(contentPath, 'utf8');

    // Add build info
    content = `// DVSA Queen Content Script - Built: ${new Date().toISOString()}\n${content}`;

    // Inline stealth modules
    content = await this.inlineStealthModules(content);

    // Minify in production
    if (this.isProduction()) {
      content = this.minifyJavaScript(content);
    }

    await fs.writeFile(outputPath, content);
  }

  async inlineStealthModules(content) {
    const stealthModules = [
      'detection-evasion.js',
      'timing-randomizer.js',
      'mouse-simulation.js',
      'stealth-manager.js'
    ];

    let inlinedContent = '';

    for (const module of stealthModules) {
      const modulePath = path.join(this.stealthDir, module);
      if (await fs.pathExists(modulePath)) {
        const moduleContent = await fs.readFile(modulePath, 'utf8');
        inlinedContent += `\n\n// === ${module} ===\n${moduleContent}`;
      }
    }

    // Insert inlined modules before the main content
    return content.replace(
      '// Initialize advanced stealth content script',
      `${inlinedContent}\n\n// Initialize advanced stealth content script`
    );
  }

  async processCSSFiles() {
    const spinner = ora('Processing CSS files...').start();

    try {
      // Check if there are any CSS files to process
      const cssFiles = await this.findCSSFiles();

      for (const cssFile of cssFiles) {
        await this.processCSSFile(cssFile);
      }

      spinner.succeed('CSS files processed');
    } catch (error) {
      spinner.fail('CSS processing failed');
      throw error;
    }
  }

  async findCSSFiles() {
    const cssFiles = [];
    const files = await fs.readdir(this.projectRoot);

    for (const file of files) {
      if (file.endsWith('.css')) {
        cssFiles.push(path.join(this.projectRoot, file));
      }
    }

    return cssFiles;
  }

  async processCSSFile(cssPath) {
    const outputPath = path.join(this.distDir, path.basename(cssPath));
    let content = await fs.readFile(cssPath, 'utf8');

    // Add build info
    content = `/* DVSA Queen Extension - Built: ${new Date().toISOString()} */\n${content}`;

    // Minify in production
    if (this.isProduction()) {
      content = this.minifyCSS(content);
    }

    await fs.writeFile(outputPath, content);
  }

  async generateCombinedFiles() {
    const spinner = ora('Generating combined files...').start();

    try {
      // Generate combined popup HTML with inline CSS/JS if needed
      await this.generateCombinedPopup();

      // Generate manifest with updated paths
      await this.updateManifest();

      spinner.succeed('Combined files generated');
    } catch (error) {
      spinner.fail('Combined file generation failed');
      throw error;
    }
  }

  async generateCombinedPopup() {
    // For now, just ensure popup.html references correct paths
    const popupPath = path.join(this.distDir, 'popup.html');
    let content = await fs.readFile(popupPath, 'utf8');

    // Update any relative paths if needed
    content = content.replace(/src="(.+)"/g, (match, src) => {
      if (src.startsWith('./')) {
        return `src="${src}"`;
      }
      return match;
    });

    await fs.writeFile(popupPath, content);
  }

  async updateManifest() {
    const manifestPath = path.join(this.distDir, 'manifest.json');
    const manifest = await fs.readJson(manifestPath);

    // Update version build info
    if (!manifest.version_name) {
      manifest.version_name = `${manifest.version} (Build: ${new Date().toISOString()})`;
    }

    // Ensure all paths are correct
    if (manifest.background && manifest.background.service_worker) {
      manifest.background.service_worker = 'background.js';
    }

    if (manifest.action && manifest.action.default_popup) {
      manifest.action.default_popup = 'popup.html';
    }

    await fs.writeJson(manifestPath, manifest, { spaces: 2 });
  }

  async validateBuild() {
    const spinner = ora('Validating build...').start();

    try {
      // Check required files exist
      const requiredFiles = [
        'manifest.json',
        'background.js',
        'popup.js',
        'popup.html',
        'content-script.js'
      ];

      for (const file of requiredFiles) {
        const filePath = path.join(this.distDir, file);
        if (!await fs.pathExists(filePath)) {
          throw new Error(`Missing required file: ${file}`);
        }
      }

      // Validate manifest
      const manifestPath = path.join(this.distDir, 'manifest.json');
      const manifest = await fs.readJson(manifestPath);

      if (manifest.manifest_version !== 3) {
        throw new Error('Must use Manifest V3');
      }

      if (!manifest.permissions.includes('activeTab')) {
        throw new Error('Missing activeTab permission');
      }

      spinner.succeed('Build validation complete');
    } catch (error) {
      spinner.fail('Build validation failed');
      throw error;
    }
  }

  async calculateBuildSize() {
    const files = await fs.readdir(this.distDir);
    let totalSize = 0;

    for (const file of files) {
      const filePath = path.join(this.distDir, file);
      const stat = await fs.stat(filePath);
      if (stat.isFile()) {
        totalSize += stat.size;
      }
    }

    return totalSize;
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  isProduction() {
    return process.env.NODE_ENV === 'production';
  }

  minifyJavaScript(content) {
    // Simple minification - remove comments and extra whitespace
    return content
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
      .replace(/\/\/.*$/gm, '') // Remove line comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/;\s+/g, ';') // Remove spaces after semicolons
      .trim();
  }

  minifyCSS(content) {
    // Simple CSS minification
    return content
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/;\s*}/g, '}') // Remove semicolons before closing braces
      .replace(/\s*{\s*/g, '{') // Remove spaces around opening braces
      .replace(/;\s+/g, ';') // Remove spaces after semicolons
      .trim();
  }
}

// Run builder
if (require.main === module) {
  const builder = new ExtensionBuilder();
  const isProduction = process.argv.includes('--production');
  const isWatch = process.argv.includes('--watch');

  builder.build({
    production: isProduction,
    watch: isWatch
  }).catch(console.error);
}

module.exports = ExtensionBuilder;
