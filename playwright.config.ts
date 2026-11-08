import { defineConfig, devices } from '@playwright/test';

// End-to-end tests of the built site, with the draft posts: `npm run build:drafts`, then
// `npm run e2e`. The full suite runs in Chromium, on a desktop and on a phone; Firefox and WebKit
// (as an iPhone) run the tests tagged @smoke.
const PORT = 4310;

export default defineConfig({
  testDir: 'e2e',
  testMatch: '**/*.e2e.ts',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 1 : 0,
  reporter: process.env['CI'] ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: { baseURL: `http://127.0.0.1:${PORT}`, trace: 'retain-on-failure' },
  webServer: {
    command: `node scripts/serve-dist.mjs dist/personal-site/browser ${PORT}`,
    url: `http://127.0.0.1:${PORT}/`,
    reuseExistingServer: !process.env['CI'],
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] }, grep: /@smoke/ },
    { name: 'webkit', use: { ...devices['iPhone 15'] }, grep: /@smoke/ },
  ],
});
