import { Page } from '@playwright/test';
import { CookieBanner } from './components/CookieBanner';

/**
 * Parent of all page objects: shared behaviour lives here.
 *
 * Page Object Model (POM) in one sentence: each page gets a class that knows its
 * locators and actions, so tests read like business steps and a UI change is fixed
 * in one file instead of in every test.
 */
export abstract class BasePage {
  protected readonly cookies: CookieBanner;

  constructor(protected readonly page: Page) {
    this.cookies = new CookieBanner(page);
  }

  /** Path of the page relative to BASE_URL, e.g. '/'. */
  protected abstract readonly path: string;

  async open(): Promise<void> {
    await this.page.goto(this.path);
    await this.cookies.acceptIfShown();
  }
}
