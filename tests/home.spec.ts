import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

// Tags (@smoke, @regression) let the pipeline choose which tests to run:
//   npx playwright test --grep @smoke
test.describe('Homepage', () => {
  // Each test gets a fresh browser context and page, so tests do not share state.
  test('loads with the expected title and main heading @smoke', async ({ page }) => {
    const home = new HomePage(page);
    await home.open();

    await expect(page).toHaveTitle(/Student Accommodation/i);
    await expect(home.heading).toContainText('Find your perfect student home');
  });

  test('shows the main navigation and search options @smoke', async ({ page }) => {
    const home = new HomePage(page);
    await home.open();

    await expect(home.citiesMenuButton).toBeVisible();
    await expect(home.exploreAccommodationLink).toBeVisible();
    await expect(home.lengthOfStayButton).toBeVisible();
    await expect(home.academicYearButton).toBeVisible();
  });

  test('user can navigate to Bristol from the Cities menu @regression', async ({ page }) => {
    const home = new HomePage(page);
    await home.open();

    const bristol = await home.goToBristol();

    await expect(bristol.heading).toContainText('BRISTOL', { ignoreCase: true });
  });
});
