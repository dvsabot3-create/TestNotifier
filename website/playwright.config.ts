import { defineConfig, devices } from '@playwright/test';
import path from 'path';

/**
 * Playwright E2E Test Configuration
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['list']
  ],
  use: {
    baseURL: process.env.FRONTEND_URL || 'http://localhost:3002',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'chromium-extension',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/extension/**/*.spec.ts',
    },
  ],

  // WebServer configuration - uncomment if you want Playwright to start the dev server automatically
  // Otherwise, start the server manually with: npm run dev
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:3002',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120000,
  // },
});

