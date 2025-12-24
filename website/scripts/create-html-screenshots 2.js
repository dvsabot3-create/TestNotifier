#!/usr/bin/env node

/**
 * Professional HTML Screenshot Generator for TestNotifier
 *
 * This script creates high-quality, professional mockups of Chrome browser
 * interfaces using HTML/CSS for immediate deployment.
 */

const fs = require('fs');
const path = require('path');

console.log('🎨 Professional HTML Screenshot Generator');
console.log('==========================================\n');

const config = {
  outputDir: path.join(__dirname, '..', 'public', 'assets', 'screenshots', 'installation'),
  width: 1366,
  height: 768,
  quality: 'high'
};

// Chrome UI mockup templates
const chromeUITemplates = {
  'chrome-version': {
    title: 'Check Chrome Version',
    color: '#1d70b8',
    content: `
      <!-- Chrome Settings Header -->
      <div style="background: #1d70b8; height: 60px; display: flex; align-items: center; padding: 0 24px;">
        <h1 style="color: white; font-size: 18px; margin: 0;">Settings</h1>
      </div>

      <!-- Settings Navigation -->
      <div style="background: #f8f9fa; height: 60px; display: flex; align-items: center; padding: 0 24px; border-bottom: 1px solid #dee2e6;">
        <div style="color: #495057; font-size: 14px;">chrome://settings/help</div>
      </div>

      <!-- Main Content -->
      <div style="padding: 40px; background: white; min-height: 600px;">
        <div style="max-width: 800px; margin: 0 auto;">

          <!-- About Chrome Section -->
          <div style="background: #e8f4f8; border: 2px solid #1d70b8; border-radius: 8px; padding: 30px; margin-bottom: 30px;">
            <h2 style="color: #1d70b8; font-size: 20px; margin: 0 0 15px 0;">About Chrome</h2>
            <div style="font-size: 24px; color: #1d70b8; font-weight: bold; margin-bottom: 10px;">
              108.0.5359.124 (Official Build) (64-bit)
            </div>
            <div style="color: #28a745; font-size: 16px; font-weight: 500;">
              ✓ Chrome is up to date
            </div>
          </div>

          <!-- Version Information -->
          <div style="background: #f8f9fa; border-radius: 8px; padding: 25px;">
            <h3 style="color: #495057; font-size: 16px; margin: 0 0 15px 0;">Version Information</h3>
            <div style="color: #6c757d; font-size: 14px; line-height: 1.6;">
              <p>Google Chrome automatically updates to the latest version available.</p>
              <p style="margin-top: 15px;"><strong>Minimum required:</strong> Chrome 88+ for TestNotifier compatibility</p>
            </div>
          </div>

        </div>
      </div>
    `
  },

  'extensions-page': {
    title: 'Open Chrome Extensions',
    color: '#2e8bc0',
    content: `
      <!-- Chrome Extensions Header -->
      <div style="background: #2e8bc0; height: 60px; display: flex; align-items: center; padding: 0 24px;">
        <h1 style="color: white; font-size: 18px; margin: 0;">Extensions</h1>
        <div style="margin-left: auto; color: white; font-size: 14px;">chrome://extensions/</div>
      </div>

      <!-- Extensions Toolbar -->
      <div style="background: #f8f9fa; height: 60px; display: flex; align-items: center; padding: 0 24px; border-bottom: 1px solid #dee2e6;">
        <div style="display: flex; gap: 15px; align-items: center;">
          <div style="font-size: 14px; color: #495057;">📦 Extensions (12)</div>
          <div style="background: #e9ecef; padding: 6px 12px; border-radius: 16px; font-size: 12px; color: #6c757d;">Developer mode</div>
        </div>

        <!-- Developer Mode Toggle -->
        <div style="margin-left: auto; display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 14px; color: #495057;">Developer mode</span>
          <div style="width: 40px; height: 20px; background: #28a745; border-radius: 10px; position: relative;">
            <div style="width: 16px; height: 16px; background: white; border-radius: 50%; position: absolute; right: 2px; top: 2px;"></div>
          </div>
        </div>
      </div>

      <!-- Extensions List -->
      <div style="padding: 30px; background: white; min-height: 600px;">
        <div style="max-width: 1200px; margin: 0 auto;">

          <!-- Extension Items -->
          <div style="display: grid; gap: 20px;">

            <!-- TestNotifier Extension -->
            <div style="background: #d4edda; border: 2px solid #28a745; border-radius: 8px; padding: 20px;">
              <div style="display: flex; align-items: center; gap: 20px;">
                <div style="width: 48px; height: 48px; background: #28a745; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px;">📋</div>
                <div style="flex: 1;">
                  <h3 style="margin: 0; color: #155724; font-size: 16px;">TestNotifier</h3>
                  <p style="margin: 5px 0 0 0; color: #28a745; font-size: 14px;">✅ Enabled • Version 1.0.0</p>
                </div>
                <div style="display: flex; gap: 10px;">
                  <button style="background: #6c757d; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-size: 12px;">Details</button>
                  <button style="background: #dc3545; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-size: 12px;">Remove</button>
                </div>
              </div>
            </div>

            <!-- Other Extensions -->
            <div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 20px;">
              <div style="display: flex; align-items: center; gap: 20px;">
                <div style="width: 48px; height: 48px; background: #6c757d; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px;">🔒</div>
                <div style="flex: 1;">
                  <h3 style="margin: 0; color: #495057; font-size: 16px;">Privacy Badger</h3>
                  <p style="margin: 5px 0 0 0; color: #6c757d; font-size: 14px;">Protects privacy by blocking spying ads and invisible trackers</p>
                </div>
                <div style="display: flex; gap: 10px;">
                  <button style="background: #28a745; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-size: 12px;">Enabled</button>
                  <button style="background: transparent; color: #6c757d; border: 1px solid #6c757d; padding: 8px 16px; border-radius: 4px; font-size: 12px;">Details</button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    `
  },

  'developer-mode': {
    title: 'Enable Developer Mode',
    color: '#ffc107',
    content: `
      <!-- Chrome Extensions Header -->
      <div style="background: #2e8bc0; height: 60px; display: flex; align-items: center; padding: 0 24px;">
        <h1 style="color: white; font-size: 18px; margin: 0;">Extensions</h1>
      </div>

      <!-- Extensions Toolbar with Developer Mode Enabled -->
      <div style="background: #fff3cd; height: 60px; display: flex; align-items: center; padding: 0 24px; border-bottom: 1px solid #ffeaa7;">
        <div style="display: flex; gap: 15px; align-items: center;">
          <div style="font-size: 14px; color: #495057;">📦 Extensions (12)</div>
          <div style="background: #28a745; color: white; padding: 6px 12px; border-radius: 16px; font-size: 12px;">Developer mode ON</div>
        </div>

        <!-- Developer Mode Toggle (ON) -->
        <div style="margin-left: auto; display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 14px; color: #856404; font-weight: 500;">Developer mode</span>
          <div style="width: 40px; height: 20px; background: #28a745; border-radius: 10px; position: relative; box-shadow: 0 0 8px rgba(40, 167, 69, 0.5);">
            <div style="width: 16px; height: 16px; background: white; border-radius: 50%; position: absolute; right: 2px; top: 2px;"></div>
          </div>
        </div>
      </div>

      <!-- Enhanced Extensions Interface -->
      <div style="padding: 30px; background: white; min-height: 600px;">
        <div style="max-width: 1200px; margin: 0 auto;">

          <!-- Load Unpacked Button -->
          <div style="margin-bottom: 30px; text-align: center;">
            <div style="display: inline-flex; align-items: center; gap: 15px; background: #6f42c1; color: white; padding: 15px 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(111, 66, 193, 0.3);">
              <span style="font-size: 20px;">📁</span>
              <span style="font-size: 16px; font-weight: bold;">Load unpacked</span>
            </div>
            <p style="margin-top: 15px; color: #6c757d; font-size: 14px;">Select the folder containing your extension files</p>
          </div>

          <!-- Instructions -->
          <div style="background: #e3f2fd; border: 1px solid #bbdefb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #1d70b8; font-size: 16px; margin: 0 0 10px 0;">💡 Developer Mode Enabled</h3>
            <p style="color: #1565c0; font-size: 14px; margin: 0;">You can now load unpacked extensions and access advanced developer features.</p>
          </div>

        </div>
      </div>
    `
  },

  'load-unpacked': {
    title: 'Load Unpacked Extension',
    color: '#8b5cf6',
    content: `
      <!-- Chrome Extensions Header -->
      <div style="background: #2e8bc0; height: 60px; display: flex; align-items: center; padding: 0 24px;">
        <h1 style="color: white; font-size: 18px; margin: 0;">Extensions</h1>
      </div>

      <!-- Extensions Toolbar -->
      <div style="background: #f8f9fa; height: 60px; display: flex; align-items: center; padding: 0 24px; border-bottom: 1px solid #dee2e6;">
        <div style="display: flex; gap: 15px; align-items: center;">
          <div style="font-size: 14px; color: #495057;">📦 Extensions (12)</div>
          <div style="background: #28a745; color: white; padding: 6px 12px; border-radius: 16px; font-size: 12px;">Developer mode ON</div>
        </div>
      </div>

      <!-- Load Unpacked Interface -->
      <div style="padding: 40px; background: white; min-height: 600px;">
        <div style="max-width: 800px; margin: 0 auto; text-align: center;">

          <!-- Main Action Button -->
          <div style="margin-bottom: 40px;">
            <div style="display: inline-flex; align-items: center; gap: 15px; background: linear-gradient(135deg, #8b5cf6, #a855f7); color: white; padding: 20px 40px; border-radius: 12px; box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3); cursor: pointer;">
              <span style="font-size: 24px;">📁</span>
              <span style="font-size: 18px; font-weight: bold;">Load unpacked</span>
            </div>
          </div>

          <!-- Instructions -->
          <div style="background: #f3e8ff; border: 2px solid #c4b5fd; border-radius: 12px; padding: 30px; margin-bottom: 30px;">
            <h3 style="color: #7c3aed; font-size: 18px; margin: 0 0 15px 0;">📋 Select Extension Folder</h3>
            <p style="color: #6b21a8; font-size: 16px; margin: 0 0 15px 0;">Choose the folder that contains your extension files:</p>
            <ul style="text-align: left; color: #6b21a8; font-size: 14px; line-height: 1.6;">
              <li>✅ Must contain <strong>manifest.json</strong> file</li>
              <li>✅ Should include all extension assets and scripts</li>
              <li>✅ Do NOT select the ZIP file - extract first</li>
              <li>✅ Folder name should be descriptive (e.g., "testnotifier-extension")</li>
            </ul>
          </div>

          <!-- File Browser Preview -->
          <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-top: 20px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
              <span style="font-size: 16px;">📂</span>
              <span style="font-weight: 500; color: #374151;">testnotifier-extension/</span>
            </div>
            <div style="font-family: monospace; font-size: 13px; color: #6b7280; background: #f9fafb; padding: 15px; border-radius: 6px; text-align: left;">
              📄 manifest.json<br>
              📄 background.js<br>
              📄 content.js<br>
              📄 popup.html<br>
              📄 popup.js<br>
              📁 icons/
            </div>
          </div>

        </div>
      </div>
    `
  },

  'extension-verification': {
    title: 'Verify Installation',
    color: '#28a745',
    content: `
      <!-- Chrome Extensions Header -->
      <div style="background: #2e8bc0; height: 60px; display: flex; align-items: center; padding: 0 24px;">
        <h1 style="color: white; font-size: 18px; margin: 0;">Extensions</h1>
      </div>

      <!-- Success Banner -->
      <div style="background: #d4edda; height: 60px; display: flex; align-items: center; padding: 0 24px; border-bottom: 1px solid #c3e6cb;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 20px;">✅</span>
          <span style="color: #155724; font-size: 14px; font-weight: 500;">TestNotifier successfully installed!</span>
        </div>
      </div>

      <!-- Extensions List with Success -->
      <div style="padding: 30px; background: white; min-height: 600px;">
        <div style="max-width: 1200px; margin: 0 auto;">

          <!-- Success Message -->
          <div style="background: #d4edda; border: 2px solid #28a745; border-radius: 12px; padding: 25px; margin-bottom: 30px; text-align: center;">
            <div style="font-size: 32px; margin-bottom: 10px;">🎉</div>
            <h2 style="color: #155724; font-size: 20px; margin: 0 0 10px 0;">Installation Complete!</h2>
            <p style="color: #155724; font-size: 16px; margin: 0;">TestNotifier is now installed and ready to use.</p>
          </div>

          <!-- Verified Extension -->
          <div style="background: #ffffff; border: 3px solid #28a745; border-radius: 12px; padding: 25px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(40, 167, 69, 0.2);">
            <div style="display: flex; align-items: center; gap: 20px;">
              <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #28a745, #20c997); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 28px; box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);">📋</div>
              <div style="flex: 1;">
                <h3 style="margin: 0; color: #155724; font-size: 18px;">TestNotifier</h3>
                <p style="margin: 5px 0 0 0; color: #28a745; font-size: 16px; font-weight: 500;">✅ Enabled • Version 1.0.0</p>
                <p style="margin: 5px 0 0 0; color: #155724; font-size: 14px;">Monitor DVSA test slots and get notified of cancellations</p>
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <div style="background: #28a745; color: white; padding: 6px 12px; border-radius: 16px; font-size: 12px; text-align: center;">✓ Active</div>
                <button style="background: #28a745; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 12px; font-weight: 500;">Extension options</button>
              </div>
            </div>
          </div>

          <!-- Next Steps -->
          <div style="background: #e3f2fd; border: 1px solid #bbdefb; border-radius: 8px; padding: 20px;">
            <h4 style="color: #1d70b8; font-size: 16px; margin: 0 0 10px 0;">🎯 What's Next?</h4>
            <ul style="color: #1565c0; font-size: 14px; margin: 0; padding-left: 20px;">
              <li>Pin TestNotifier to your toolbar for easy access</li>
              <li>Visit the DVSA website to set up test slot monitoring</li>
              <li>Configure your notification preferences</li>
              <li>Start monitoring for earlier test slots!</li>
            </ul>
          </div>

        </div>
      </div>
    `
  },

  'pin-extension': {
    title: 'Pin Extension to Toolbar',
    color: '#17a2b8',
    content: `
      <!-- Clean Browser Interface -->
      <div style="background: #ffffff; height: 80px; display: flex; align-items: center; padding: 0 24px; border-bottom: 1px solid #e5e7eb;">
        <!-- Address Bar -->
        <div style="flex: 1; display: flex; align-items: center; background: #f3f4f6; border-radius: 24px; padding: 8px 16px; margin-right: 20px;">
          <div style="color: #6b7280; font-size: 14px;">🔍</div>
          <div style="margin-left: 8px; color: #374151; font-size: 14px;">https://www.dvsa.gov.uk</div>
        </div>

        <!-- Extensions Area -->
        <div style="display: flex; align-items: center; gap: 8px;">
          <!-- Extensions Menu -->
          <div style="background: #17a2b8; color: white; padding: 8px 12px; border-radius: 16px; display: flex; align-items: center; gap: 6px; cursor: pointer; box-shadow: 0 2px 8px rgba(23, 162, 184, 0.3);">
            <span style="font-size: 16px;">🧩</span>
            <span style="font-size: 12px;">Extensions</span>
            <span style="font-size: 12px;">▼</span>
          </div>

          <!-- Profile Menu -->
          <div style="width: 32px; height: 32px; background: #6b7280; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px;">👤</div>
        </div>
      </div>

      <!-- Extensions Dropdown Menu -->
      <div style="position: absolute; top: 70px; right: 24px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); padding: 8px; min-width: 280px; z-index: 1000;">
        <div style="padding: 8px 0;">

          <!-- TestNotifier with Pin -->
          <div style="display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 6px; background: #e3f2fd; margin-bottom: 4px;">
            <div style="width: 20px; height: 20px; background: #17a2b8; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 12px;">📋</div>
            <div style="flex: 1;">
              <div style="font-size: 14px; color: #374151; font-weight: 500;">TestNotifier</div>
              <div style="font-size: 12px; color: #6b7280;">Monitor test slots</div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <div style="background: #17a2b8; color: white; padding: 4px 8px; border-radius: 12px; font-size: 10px;">📌</div>
              <div style="color: #17a2b8; font-size: 12px;">Pinned</div>
            </div>
          </div>

          <!-- Other Extensions -->
          <div style="display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 6px;">
            <div style="width: 20px; height: 20px; background: #dc3545; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 12px;">🔒</div>
            <div style="flex: 1;">
              <div style="font-size: 14px; color: #374151;">uBlock Origin</div>
              <div style="font-size: 12px; color: #6b7280;">Finally, an efficient blocker</div>
            </div>
            <div style="color: #6b7280; font-size: 12px;">📌</div>
          </div>

          <div style="display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 6px;">
            <div style="width: 20px; height: 20px; background: #fd7e14; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 12px;">🛡️</div>
            <div style="flex: 1;">
              <div style="font-size: 14px; color: #374151;">Privacy Badger</div>
              <div style="font-size: 12px; color: #6b7280;">Protects your privacy</div>
            </div>
            <div style="color: #6b7280; font-size: 12px;">📌</div>
          </div>

        </div>

        <div style="border-top: 1px solid #e5e7eb; margin: 8px 0; padding-top: 8px;">
          <div style="padding: 8px 12px; color: #6b7280; font-size: 12px; cursor: pointer;">⚙️ Manage extensions</div>
        </div>
      </div>

      <!-- Instructions -->
      <div style="padding: 40px; background: #f8f9fa; min-height: 600px;">
        <div style="max-width: 800px; margin: 0 auto; text-align: center;">

          <!-- Success Visualization -->
          <div style="margin-bottom: 30px;">
            <div style="display: inline-flex; align-items: center; gap: 20px; background: white; padding: 25px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 40px; height: 40px; background: #17a2b8; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 20px;">1️⃣</div>
                <div>
                  <div style="font-size: 14px; color: #6b7280;">Click</div>
                  <div style="font-weight: 500; color: #374151;">🧩 Extensions menu</div>
                </div>
              </div>

              <div style="color: #6b7280; font-size: 24px;">→</div>

              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 40px; height: 40px; background: #28a745; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 20px;">2️⃣</div>
                <div>
                  <div style="font-size: 14px; color: #6b7280;">Find</div>
                  <div style="font-weight: 500; color: #374151;">TestNotifier</div>
                </div>
              </div>

              <div style="color: #6b7280; font-size: 24px;">→</div>

              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 40px; height: 40px; background: #17a2b8; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 20px;">3️⃣</div>
                <div>
                  <div style="font-size: 14px; color: #6b7280;">Click</div>
                  <div style="font-weight: 500; color: #374151;">📌 Pin icon</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Success Message -->
          <div style="background: #e3f2fd; border: 1px solid #bbdefb; border-radius: 12px; padding: 25px; margin-bottom: 20px;">
            <div style="font-size: 24px; margin-bottom: 10px;">✅</div>
            <h3 style="color: #1d70b8; font-size: 18px; margin: 0 0 10px 0;">TestNotifier Pinned Successfully!</h3>
            <p style="color: #1565c0; font-size: 16px; margin: 0;">The extension is now easily accessible from your Chrome toolbar.</p>
          </div>

          <!-- Benefits -->
          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
            <h4 style="color: #374151; font-size: 16px; margin: 0 0 15px 0;">🎯 Why Pin Extensions?</h4>
            <ul style="text-align: left; color: #6b7280; font-size: 14px; margin: 0; padding-left: 20px; line-height: 1.6;">
              <li>Quick access to extension features</li>
              <li>Easy monitoring of extension status</li>
              <li>Convenient access to settings and options</li>
              <li>Better user experience and workflow</li>
            </ul>
          </div>

        </div>
      </div>
    `
  },

  'disable-extensions': {
    title: 'Disable Conflicting Extensions',
    color: '#dc3545',
    content: `
      <!-- Chrome Extensions Header -->
      <div style="background: #2e8bc0; height: 60px; display: flex; align-items: center; padding: 0 24px;">
        <h1 style="color: white; font-size: 18px; margin: 0;">Extensions</h1>
      </div>

      <!-- Warning Banner -->
      <div style="background: #fff3cd; height: 60px; display: flex; align-items: center; padding: 0 24px; border-bottom: 1px solid #ffeaa7;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 20px;">⚠️</span>
          <span style="color: #856404; font-size: 14px; font-weight: 500;">Temporarily disable conflicting extensions</span>
        </div>
      </div>

      <!-- Extensions Management Interface -->
      <div style="padding: 30px; background: white; min-height: 600px;">
        <div style="max-width: 1200px; margin: 0 auto;">

          <!-- Warning Card -->
          <div style="background: #fff3cd; border: 2px solid #ffeaa7; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
            <div style="display: flex; align-items: flex-start; gap: 15px;">
              <span style="font-size: 24px; color: #856404;">⚠️</span>
              <div>
                <h3 style="color: #856404; font-size: 18px; margin: 0 0 10px 0;">Potential Conflicts Detected</h3>
                <p style="color: #856404; font-size: 16px; margin: 0 0 15px 0;">The following extensions may interfere with TestNotifier functionality:</p>
                <ul style="color: #856404; font-size: 14px; margin: 0; padding-left: 20px; line-height: 1.6;">
                  <li><strong>Ad blockers</strong> (uBlock Origin, AdBlock Plus) - May block monitoring scripts</li>
                  <li><strong>Privacy extensions</strong> (Privacy Badger, Ghostery) - May prevent data collection</li>
                  <li><strong>Popup blockers</strong> - May stop notification functionality</li>
                  <li><strong>Script blockers</strong> (NoScript) - May disable core functionality</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Extensions to Disable -->
          <div style="margin-bottom: 30px;">
            <h3 style="color: #495057; font-size: 18px; margin: 0 0 20px 0;">📋 Extensions to Temporarily Disable</h3>

            <div style="display: grid; gap: 15px;">

              <!-- uBlock Origin -->
              <div style="background: #f8d7da; border: 2px solid #dc3545; border-radius: 8px; padding: 20px;">
                <div style="display: flex; align-items: center; gap: 15px;">
                  <div style="width: 48px; height: 48px; background: #dc3545; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px;">🛡️</div>
                  <div style="flex: 1;">
                    <h4 style="margin: 0; color: #721c24; font-size: 16px;">uBlock Origin</h4>
                    <p style="margin: 5px 0 0 0; color: #721c24; font-size: 14px;">Efficient blocker for Chromium</p>
                  </div>
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <button style="background: #dc3545; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 12px; font-weight: 500; cursor: pointer;">Disable</button>
                    <div style="color: #721c24; font-size: 12px;">⚠️ May block monitoring</div>
                  </div>
                </div>
              </div>

              <!-- Privacy Badger -->
              <div style="background: #f8d7da; border: 2px solid #dc3545; border-radius: 8px; padding: 20px;">
                <div style="display: flex; align-items: center; gap: 15px;">
                  <div style="width: 48px; height: 48px; background: #fd7e14; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px;">🔒</div>
                  <div style="flex: 1;">
                    <h4 style="margin: 0; color: #721c24; font-size: 16px;">Privacy Badger</h4>
                    <p style="margin: 5px 0 0 0; color: #721c24; font-size: 14px;">Protects your privacy</p>
                  </div>
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <button style="background: #dc3545; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 12px; font-weight: 500; cursor: pointer;">Disable</button>
                    <div style="color: #721c24; font-size: 12px;">⚠️ May block data collection</div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Instructions -->
          <div style="background: #e3f2fd; border: 1px solid #bbdefb; border-radius: 8px; padding: 20px;">
            <h4 style="color: #1d70b8; font-size: 16px; margin: 0 0 10px 0;">💡 How to Disable Extensions</h4>
            <ol style="color: #1565c0; font-size: 14px; margin: 0; padding-left: 20px; line-height: 1.6;">
              <li>Click the toggle switch to disable the extension</li>
              <li>The extension will be temporarily turned off</li>
              <li>Refresh the DVSA website after disabling</li>
              <li>Re-enable extensions after TestNotifier setup is complete</li>
            </ol>
          </div>

        </div>
      </div>
    `
  }
};

// Create output directory
function createOutputDirectory() {
  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
    console.log('✅ Created output directory:', config.outputDir);
  }
}

// Generate HTML for a specific step
function generateHTML(step) {
  const template = chromeUITemplates[step.id];

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${template.title} - TestNotifier Installation</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        background: #f8f9fa;
        color: #333;
        line-height: 1.5;
      }

      .chrome-window {
        width: ${config.width}px;
        height: ${config.height}px;
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        margin: 20px auto;
      }

      .chrome-header {
        background: #f1f3f4;
        height: 40px;
        display: flex;
        align-items: center;
        padding: 0 16px;
        border-bottom: 1px solid #dadce0;
      }

      .chrome-tabs {
        display: flex;
        gap: 4px;
        flex: 1;
      }

      .chrome-tab {
        background: white;
        border-radius: 8px 8px 0 0;
        padding: 8px 16px;
        font-size: 14px;
        color: #5f6368;
        border: 1px solid #dadce0;
        border-bottom: none;
        position: relative;
        top: 1px;
      }

      .chrome-tab.active {
        color: #1a73e8;
        font-weight: 500;
      }

      .chrome-controls {
        display: flex;
        gap: 8px;
      }

      .chrome-control {
        width: 12px;
        height: 12px;
        border-radius: 50%;
      }

      .chrome-control.close { background: #ff5f57; }
      .chrome-control.minimize { background: #ffbd2e; }
      .chrome-control.maximize { background: #28ca42; }

      .chrome-content {
        height: calc(100% - 40px);
        overflow: hidden;
      }

      /* Smooth transitions */
      * {
        transition: all 0.2s ease;
      }

      /* Professional styling */
      h1, h2, h3, h4 {
        font-weight: 500;
      }

      button {
        cursor: pointer;
        transition: all 0.2s ease;
      }

      button:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      }
    </style>
</head>
<body>
    <div class="chrome-window">
        <!-- Chrome Browser Chrome -->
        <div class="chrome-header">
            <div class="chrome-tabs">
                <div class="chrome-tab active">${template.title}</div>
                <div class="chrome-tab">New Tab</div>
            </div>
            <div class="chrome-controls">
                <div class="chrome-control close"></div>
                <div class="chrome-control minimize"></div>
                <div class="chrome-control maximize"></div>
            </div>
        </div>

        <!-- Chrome Content -->
        <div class="chrome-content">
            ${template.content}
        </div>
    </div>

    <!-- Professional Footer -->
    <div style="text-align: center; padding: 20px; color: #6c757d; font-size: 14px;">
        <p>Professional Chrome interface mockup for TestNotifier installation guide</p>
        <p style="font-size: 12px; margin-top: 5px;">Replace with actual Chrome screenshot from Scribe in production</p>
    </div>
</body>
</html>
  `;
}

// Create professional PNG screenshot from HTML
async function createPNGFromHTML(step) {
  const html = generateHTML(step);
  const htmlPath = path.join(config.outputDir, `${step.id}.html`);
  const pngPath = path.join(config.outputDir, `${step.id}-screenshot.png`);

  try {
    console.log(`🎨 Creating screenshot for: ${step.title}`);

    // Write HTML file
    fs.writeFileSync(htmlPath, html);
    console.log(`   ✅ HTML created: ${step.id}.html`);

    // For immediate deployment, we'll create a high-quality mockup
    // In production, you would use headless Chrome or similar

    // Create PNG info file
    const pngInfo = {
      type: 'professional_mockup',
      step: step.id,
      title: step.title,
      dimensions: { width: config.width, height: config.height },
      format: 'PNG',
      quality: 'high',
      created: new Date().toISOString(),
      note: 'Professional HTML mockup - replace with actual Chrome screenshot from Scribe',
      htmlFile: `${step.id}.html`,
      productionInstructions: [
        '1. Install Scribe Chrome extension',
        '2. Navigate to the appropriate Chrome settings page',
        '3. Start Scribe recording',
        '4. Perform the installation steps',
        '5. Export high-quality PNG screenshots',
        '6. Replace this mockup with actual screenshots'
      ]
    };

    fs.writeFileSync(pngPath.replace('.png', '-info.json'), JSON.stringify(pngInfo, null, 2));
    console.log(`   ✅ PNG info created: ${step.id}-screenshot-info.json`);
    console.log(`   📊 Dimensions: ${config.width}x${config.height}px`);

    return {
      success: true,
      htmlFile: htmlPath,
      infoFile: pngPath.replace('.png', '-info.json'),
      step: step.id,
      title: step.title
    };

  } catch (error) {
    console.error(`   ❌ Error creating screenshot: ${error.message}`);
    return {
      success: false,
      error: error.message,
      step: step.id,
      title: step.title
    };
  }
}

// Main screenshot creation process
async function createScreenshots() {
  createOutputDirectory();

  const results = {
    successful: [],
    failed: [],
    total: Object.keys(chromeUITemplates).length
  };

  console.log('\n🎬 Starting professional screenshot creation...');

  for (const [stepId, template] of Object.entries(chromeUITemplates)) {
    const step = { id: stepId, ...template };
    const result = await createPNGFromHTML(step);

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
      console.log(`   • ${fail.title}: ${fail.error}`);
    });
  }

  // Generate comprehensive report
  generateReport(results);

  return results;
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
      'Use Scribe Chrome extension to create actual Chrome screenshots',
      'Replace HTML mockups with real PNG screenshots',
      'Optimize final PNG files for web (max 200KB each)',
      'Test screenshot loading in the React application',
      'Verify all Scribe tutorial links work correctly'
    ],
    nextSteps: [
      'Install Scribe Chrome extension from Chrome Web Store',
      'Follow the Scribe Tutorial Creation Guide',
      'Record each installation step with Scribe',
      'Export high-quality PNG screenshots',
      'Replace mock files with actual screenshots',
      'Test complete system integration'
    ]
  };

  const reportPath = path.join(config.outputDir, 'html-screenshot-creation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(`\n📋 Report saved to: ${reportPath}`);
}

// Main execution
async function main() {
  try {
    console.log('Starting professional HTML screenshot creation...\n');

    const results = await createScreenshots();

    console.log('\n✨ HTML screenshot creation completed!');
    console.log('\n💡 Next Steps:');
    console.log('1. Review the generated HTML files');
    console.log('2. Use Scribe Chrome extension for actual screenshots');
    console.log('3. Replace mockups with real Chrome screenshots');
    console.log('4. Test the complete integration');

  } catch (error) {
    console.error('❌ HTML screenshot creation failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  createScreenshots,
  chromeUITemplates,
  config
};