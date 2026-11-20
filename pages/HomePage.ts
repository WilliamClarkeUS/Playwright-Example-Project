import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { CityPage } from './CityPage';

/** The unitestudents.com homepage. */
export class HomePage extends BasePage {
  protected readonly path = '/';

  // Locators are defined once, as readonly fields.
  // Preference order for locators: role / test id (stable) > text > CSS > XPath (brittle).
  readonly heading: Locator;
  readonly citiesMenuButton: Locator;
  readonly exploreAccommodationLink: Locator;
  readonly lengthOfStayButton: Locator;
  readonly academicYearButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { level: 1 }).first();
    // "Cities" is a link (with no href) that opens a menu, so we locate it by role: link.
    this.citiesMenuButton = page.getByRole('navigation').getByRole('link', { name: 'Cities' }).first();
    this.exploreAccommodationLink = page.getByRole('link', { name: 'Explore accommodation' }).first();
    // data-testid attributes are put there for tests: the most stable option.
    this.lengthOfStayButton = page.getByTestId('hero-length-of-stay-popover-button');
    this.academicYearButton = page.getByTestId('hero-academic-year-popover-button');
  }

  /** Open the Cities menu and choose Bristol. Returns the page we land on. */
  async goToBristol(): Promise<CityPage> {
    await this.citiesMenuButton.click();
    await this.page.getByRole('navigation').getByRole('link', { name: 'Bristol', exact: true }).first().click();
    const cityPage = new CityPage(this.page);
    await expect(this.page).toHaveURL(/\/student-accommodation\/bristol/);
    return cityPage;
  }
}
