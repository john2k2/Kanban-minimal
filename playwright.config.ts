import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  retries: 0,
  testIgnore: ["**/unit/**"],
  webServer: {
    command: "npm run dev",
    port: 3000,
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    viewport: { width: 1440, height: 900 },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
