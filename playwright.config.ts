import { defineConfig, devices } from '@playwright/test';
import type { TestOptions } from './test-options';


export default defineConfig<TestOptions>({
  testDir: './tests',
    timeout: 100000,
    globalTimeout: 60000,
    expect:{
        timeout: 2000,
    },
  forbidOnly: !!process.env.CI,
  retries: 1,

  reporter: 'html',

  use: {
      launchOptions: {
          args: ['--start-maximized'],
      },

     //baseURL: 'https://app.simplenight.com/',
      baseURL: process.env.DEV === '1' ? 'https://app.simplenight.com/dev'
          : process.env.STAGING === '1' ? 'https://app.simplenight.com/staging'
              : 'https://app.simplenight.com/',

    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
