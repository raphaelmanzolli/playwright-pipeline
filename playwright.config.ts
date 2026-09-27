import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // The API and test cleanup share one SQLite database.
  workers: 1,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'node app/start-backend.mjs',
      url: 'http://127.0.0.1:3000/api/tags',
      timeout: 60_000,
      reuseExistingServer: false,
    },
    {
      command: 'node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4173 --strictPort',
      cwd: '.realworld/frontend',
      url: 'http://127.0.0.1:4173',
      timeout: 30_000,
      reuseExistingServer: false,
    },
  ],
});
