import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * A city landing page, e.g. /student-accommodation/bristol.
 * Takes the city slug so the same class works for Leeds, Bath, etc.
 */
export class CityPage extends BasePage {
  protected readonly path: string;

  readonly heading: Locator;
  readonly filterBar: Locator;
  readonly propertyCards: Locator;
  readonly sortButton: Locator;

  constructor(page: Page, citySlug = 'bristol') {
    super(page);
    this.path = `/student-accommodation/${citySlug}`;
    this.heading = page.getByRole('heading', { level: 1 });
    this.filterBar = page.getByTestId('city-properties-filter-bar');
    this.propertyCards = page.getByTestId('property-card');
    // The page has two buttons with the same test id (one hidden at this screen size).
    // Playwright's strict mode fails if a locator matches more than one element: a useful safety net.
    // Locating by accessible role + name picks the one a real user can see and use.
    this.sortButton = page.getByRole('button', { name: 'Sort by' });
  }

  /** Click the first property and return its name for the test to check. */
  async openFirstProperty(): Promise<void> {
    await this.propertyCards.first().getByRole('link').first().click();
  }
}
