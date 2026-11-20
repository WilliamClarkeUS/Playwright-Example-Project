import { test, expect } from '@playwright/test';
import { CityPage } from '../pages/CityPage';

test.describe('Bristol city page', () => {
  test('loads with the Bristol heading and title @smoke', async ({ page }) => {
    const bristol = new CityPage(page, 'bristol');
    await bristol.open();

    await expect(page).toHaveTitle(/Bristol/i);
    await expect(bristol.heading).toContainText('BRISTOL', { ignoreCase: true });
  });

  test('lists residences with filters and sorting @smoke', async ({ page }) => {
    const bristol = new CityPage(page, 'bristol');
    await bristol.open();

    await expect(bristol.filterBar).toBeVisible();
    await expect(bristol.sortButton).toBeVisible();
    // Do NOT assert an exact number of properties: live data changes. Assert the
    // behaviour that matters (there is at least one) so the test is not brittle.
    await expect(bristol.propertyCards.first()).toBeVisible();
    expect(await bristol.propertyCards.count()).toBeGreaterThan(0);
  });

  test('user can open a Bristol residence from the list @regression', async ({ page }) => {
    const bristol = new CityPage(page, 'bristol');
    await bristol.open();

    await bristol.openFirstProperty();

    await expect(page).toHaveURL(/\/student-accommodation\/bristol\/.+/);
  });
});
