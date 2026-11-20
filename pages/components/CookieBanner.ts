import { Page } from '@playwright/test';

/**
 * Cookie consent banner (OneTrust).
 *
 * A "component" is a reusable piece of UI that appears on many pages. Keeping it
 * in one class means a change to the banner is fixed in ONE place, not in every test.
 */
export class CookieBanner {
  constructor(private readonly page: Page) {}

  /** Accept cookies if the banner is shown. Safe to call when it is not. */
  async acceptIfShown(): Promise<void> {
    const accept = this.page.locator('#onetrust-accept-btn-handler');
    // Wait briefly: the banner loads a moment after the page does.
    // `.catch` keeps the test going when no banner appears (e.g. already accepted).
    await accept.waitFor({ state: 'visible', timeout: 5_000 }).catch(() => undefined);
    if (await accept.isVisible()) {
      await accept.click();
      await accept.waitFor({ state: 'hidden' });
    }
  }
}
