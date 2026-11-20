import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration: the ONE place to change how tests run.
 *
 * Quick guide, "where do I change...?"
 *   Environment / site under test ... BASE_URL environment variable (below)
 *   Browsers ........................ the `projects` list
 *   Parallel workers ................ `workers`
 *   Retries ......................... `retries`
 *   Timeouts ........................ `timeout` and `expect.timeout`
 *   Reports ......................... `reporter`
 *   Which tests run ................. `--grep @smoke` on the command line, or testDir
 */

// Fail loudly if BASE_URL is missing. A silent default could run the suite
// against the wrong environment without anyone noticing.
const baseURL = process.env.BASE_URL;
if (!baseURL) {
  throw new Error(
    'BASE_URL is not set. Locally: copy .env.example to .env and run with `BASE_URL=... npx playwright test`. In CI it comes from the pipeline variables.'
  );
}

export default defineConfig({
  testDir: './tests',

  // Run test FILES in parallel, and tests inside a file too. Tests must therefore
  // be independent: no test may rely on another having run first.
  fullyParallel: true,

  // Stop a stray `test.only` being merged: fails the build if one is left in.
  forbidOnly: !!process.env.CI,

  // Retries hide flakiness, so only use them in CI. Every retried pass shows up
  // as "flaky" in the report so it can be investigated rather than ignored.
  retries: process.env.CI ? 1 : 0,

  // Fewer workers in CI because shared agents have less CPU.
  workers: process.env.CI ? 2 : undefined,

  timeout: 30_000, // per test
  expect: { timeout: 10_000 }, // per assertion (auto-retried until it passes or times out)

  // html = human-readable report; junit = machine-readable, published to Azure DevOps / GitHub.
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'results/junit.xml' }],
  ],

  use: {
    baseURL,
    // Capture evidence only when needed: keeps runs fast and artefacts small.
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    locale: 'en-GB',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // To add a browser, add a project here, e.g. Firefox:
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // And for a mobile viewport:
    // { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
});
