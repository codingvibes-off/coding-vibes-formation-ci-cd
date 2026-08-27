import { test, expect } from '@playwright/test';
import { mockVideosApiSuccess } from '../fixtures/videos.mock';

test.describe('Navigation & routing', () => {
  test('la route racine "/" affiche directement les formations', async ({ page }) => {
    await mockVideosApiSuccess(page);

    await page.goto('/');

    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('h1')).toContainText('formations');
  });

  test('la route "/videos" redirige vers "/"', async ({ page }) => {
    await mockVideosApiSuccess(page);

    await page.goto('/videos');

    await expect(page).toHaveURL(/\/$/);
  });

  test('une route inconnue redirige vers "/"', async ({ page }) => {
    await mockVideosApiSuccess(page);

    await page.goto('/une-route-qui-nexiste-pas');

    await expect(page).toHaveURL(/\/$/);
  });
});
