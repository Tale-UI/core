import { defineConfig, devices } from '@playwright/test';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STORYBOOK_URL = process.env.STORYBOOK_URL ?? 'http://localhost:6006';

export default defineConfig({
  testDir: __dirname,
  testMatch: ['**/*.spec.ts'],
  snapshotDir: resolve(__dirname, 'snapshots'),
  snapshotPathTemplate: '{snapshotDir}/{testFilePath}/{arg}{ext}',
  // On CI allow one retry to guard against rendering flakiness
  retries: process.env.CI ? 1 : 0,
  expect: {
    // Allow up to 0.3% pixel difference to tolerate sub-pixel font rendering
    // differences across OS/GPU combinations
    toHaveScreenshot: { maxDiffPixelRatio: 0.003 },
  },
  use: {
    baseURL: STORYBOOK_URL,
    // Match the viewport used by the existing regression suite
    viewport: { width: 1000, height: 700 },
    // Disable animations so screenshots are deterministic
    reducedMotion: 'reduce',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  // Start the Storybook dev server. The static build excludes stories tagged
  // "dev" (the default for all user stories in Storybook 8.4+), so the dev
  // server is the only way to render them inside the iframe for screenshots.
  webServer: {
    command: 'pnpm -C playground/storybook dev',
    url: STORYBOOK_URL,
    reuseExistingServer: true,
    // Dev server takes longer to start than the static server
    timeout: 120_000,
  },
});
