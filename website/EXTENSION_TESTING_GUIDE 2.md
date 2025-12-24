# TestNotifier Extension Testing Guide

## Overview
This guide explains how to test the TestNotifier Chrome extension from raw files, including loading unpacked extensions, testing updates, and verifying functionality.

## Prerequisites
- Chrome browser version 88 or later
- Extension source files (unpacked folder)
- Stable internet connection
- DVSA website login credentials (for testing)

## Method 1: Loading Extension from Raw Files (Development Testing)

### Step 1: Prepare Extension Files
1. Navigate to your extension directory
2. Ensure you have the following files:
   - `manifest.json`
   - `content.js` or `content-*.js`
   - `background.js` or `background-*.js`
   - `popup.html` and `popup.js`
   - Any other required files

### Step 2: Open Chrome Extensions Page
1. Open Chrome browser
2. Type `chrome://extensions/` in the address bar
3. Press Enter

### Step 3: Enable Developer Mode
1. Look for the "Developer mode" toggle in the top-right corner
2. Click to enable it (should turn blue)
3. New buttons will appear: "Load unpacked", "Pack extension", etc.

### Step 4: Load the Extension
1. Click the "Load unpacked" button
2. Navigate to your extension folder (the one containing manifest.json)
3. Select the folder (not individual files)
4. Click "Select Folder"

### Step 5: Verify Installation
1. The extension should appear in your extensions list
2. Check that it shows "Enabled" status
3. Look for the TestNotifier icon in your Chrome toolbar
4. If not visible, click the puzzle piece icon and pin TestNotifier

## Method 2: Testing Extension Updates

### Updating an Existing Extension
1. Make your code changes in the extension files
2. Go to `chrome://extensions/`
3. Find TestNotifier in your extensions list
4. Click the refresh/reload icon (circular arrow) on the extension card
5. The extension will reload with your new changes

### Complete Reinstallation (if needed)
1. Remove the existing extension:
   - Click "Remove" on the extension card
   - Confirm removal
2. Follow Method 1 steps to load the updated extension

## Method 3: Testing Different Chrome Profiles

### Create a New Testing Profile
1. Click your profile icon in Chrome
2. Click "Add" or "Manage people"
3. Click "Add person"
4. Choose a name (e.g., "TestNotifier Testing")
5. Select an icon
6. Click "Add"

### Test in the New Profile
1. Switch to your testing profile
2. Follow Method 1 to load the extension
3. Test without affecting your main browser profile

## Testing Extension Functionality

### Basic Functionality Tests
1. **Icon Visibility**: Check that the extension icon appears in the toolbar
2. **Popup Opening**: Click the extension icon to open the popup
3. **Settings Access**: Navigate through any settings or options
4. **Page Detection**: Visit the DVSA website and check if the extension activates

### Advanced Testing
1. **Content Script Injection**:
   - Open Chrome DevTools (F12)
   - Go to Console tab
   - Check for any extension-related console messages
   - Look for content script indicators

2. **Background Script Testing**:
   - Go to `chrome://extensions/`
   - Find TestNotifier
   - Click "background page" or "service worker" link
   - Check the console for background script messages

3. **Storage Testing**:
   - Test any data persistence features
   - Check localStorage or chrome.storage usage
   - Verify settings are saved correctly

## Common Issues and Solutions

### Extension Won't Load
- **Developer Mode**: Must be enabled
- **Folder Selection**: Select the folder containing manifest.json, not the ZIP file
- **Manifest Issues**: Check manifest.json for syntax errors
- **Chrome Version**: Ensure Chrome 88+ is installed

### Extension Disappears After Chrome Update
- Re-enable Developer Mode
- Click "Load unpacked" again with the same folder
- Pin extension to toolbar again

### Extension Not Working on DVSA Site
- Check for conflicting extensions (ad blockers, privacy tools)
- Disable popup blockers temporarily
- Ensure stable internet connection
- Check Chrome console for error messages

### Permission Issues
- Allow all extension permissions when prompted
- Grant access to dvsa.gov.uk domains
- Enable notifications if the extension uses them

## Debugging Tips

### Chrome DevTools
1. **Content Scripts**: Use the dropdown in Console to select the extension's content script context
2. **Network Tab**: Monitor API calls and network requests
3. **Elements Tab**: Inspect DOM changes made by the extension
4. **Application Tab**: Check storage, cookies, and service workers

### Extension-Specific Debugging
1. **Background Page**: Access via `chrome://extensions/` → "background page"
2. **Popup Inspection**: Right-click extension icon → "Inspect popup"
3. **Content Script Logs**: Check console on the target webpage

## Testing Checklist

### Before Release
- [ ] Extension loads without errors
- [ ] All buttons and UI elements work
- [ ] Settings persist correctly
- [ ] No console errors in normal operation
- [ ] Extension works on target websites
- [ ] Memory usage is reasonable
- [ ] No conflicts with common extensions

### Performance Testing
- [ ] Extension doesn't slow down page loading
- [ ] CPU usage is minimal when idle
- [ ] Network requests are efficient
- [ ] Storage usage is optimized

### Security Testing
- [ ] Only requests necessary permissions
- [ ] Doesn't expose sensitive data
- [ ] Validates all inputs
- [ ] Uses secure communication protocols

## Quick Reference Commands

### Chrome URLs
- `chrome://extensions/` - Extension management
- `chrome://settings/` - Browser settings
- `chrome://version/` - Chrome version info

### Keyboard Shortcuts
- `F12` - Open DevTools
- `Ctrl+Shift+I` - Open DevTools (Windows/Linux)
- `Cmd+Option+I` - Open DevTools (Mac)

## Getting Help

If you encounter issues:
1. Check the troubleshooting section above
2. Review Chrome extension documentation
3. Test in a fresh Chrome profile
4. Check for Chrome updates
5. Verify extension manifest compatibility

For TestNotifier-specific issues:
- Contact: hello@testnotifier.co.uk
- Include: Chrome version, extension version, error messages
- Response time: Within 2 hours (business hours)