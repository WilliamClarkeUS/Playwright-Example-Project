# Playwright Example Project

A small, readable Playwright (TypeScript) framework testing two pages of
[unitestudents.com](https://www.unitestudents.com): the **homepage** and the **Bristol city page**.
It exists as a **discussion piece**: every file is commented to explain *why* it is set up that way.

Tests are read-only (no logins, forms or bookings) and safe to run against the public site.

## Run it

```bash
npm ci                                  # install exact dependency versions
npx playwright install chromium         # download the browser (once)
BASE_URL=https://www.unitestudents.com npm test
npm run test:smoke                      # only tests tagged @smoke (needs BASE_URL too)
npm run report                          # open the HTML report
```

`npm run test:headed` shows the browser; `npm run test:ui` opens Playwright's interactive runner.

## Structure

```
playwright.config.ts          # ALL run settings: environment, browsers, retries, workers, reports
pages/                        # Page Object Model: one class per page
  BasePage.ts                 #   shared behaviour (open the page, accept cookies)
  HomePage.ts                 #   homepage locators and actions
  CityPage.ts                 #   city page (takes a city slug, so it works for any city)
  components/CookieBanner.ts  #   reusable UI piece used by every page
tests/                        # Readable tests: business steps, no locators in sight
  home.spec.ts
  bristol.spec.ts
.github/workflows/ci.yml      # GitHub Actions pipeline (this one really runs)
azure-pipelines.yml           # Azure DevOps equivalent, for discussion
.azure/playwright-steps.yml   # Reusable ADO steps used by each stage
.env.example                  # Shows the one setting that varies by environment
```

## Where do I change...?

| I want to... | Change this |
|---|---|
| Test a different environment | `BASE_URL` (env var locally, pipeline variable in CI). No code change |
| Add a browser or mobile viewport | Add a project in `playwright.config.ts` |
| Run more or fewer tests in parallel | `workers` in `playwright.config.ts` |
| Retry failures | `retries` in `playwright.config.ts` |
| Change timeouts | `timeout` / `expect.timeout` in `playwright.config.ts` |
| Run only some tests | `--grep @smoke`, or the `grep` parameter in the pipeline |
| Fix a broken locator | The page object, once (not in each test) |
| Add a page | New class in `pages/` extending `BasePage`, new spec in `tests/` |
| Change when the pipeline runs | `on:` in `ci.yml` / `trigger`, `schedules` in `azure-pipelines.yml` |

## The pipeline in one minute

1. **Pull request:** smoke tests only, for fast feedback.
2. **Merge to main / nightly:** the full suite.
3. Tests run headless in Chromium; HTML report, traces and JUnit results are uploaded **even when tests fail**.
4. Environment URL and secrets come from pipeline variables, never from the repo.

## Discussion prompts

- Why does `playwright.config.ts` throw if `BASE_URL` is missing, instead of using a default?
- Why are retries on in CI but off locally, and what is the risk of retries?
- Which locator would you choose for the Cities menu, and why? What if the page text changes to Welsh?
- The tests don't assert an exact number of properties. Why?
- How would you add a second environment (UAT) and a nightly run against it?
- What would you change to make the suite run in under 5 minutes if it had 500 tests? (sharding, API set-up, fewer UI tests)
- Where would test data and secrets go if we added a login journey?
- What is missing from this framework? (Accessibility checks, visual checks, API layer, Datadog synthetics...)
