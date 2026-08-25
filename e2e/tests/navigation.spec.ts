import { test, expect } from '@playwright/test';

test.describe('Navigation & routing', () => {
  test('la route racine "/" redirige vers /inscription', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveURL(/\/inscription$/);
  });

  test('une route inconnue redirige vers /inscription', async ({ page }) => {
    await page.goto('/une-route-qui-nexiste-pas');

    await expect(page).toHaveURL(/\/inscription$/);
  });
});
