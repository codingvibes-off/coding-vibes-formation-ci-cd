import { test, expect } from '@playwright/test';
import { InscriptionPage } from '../pages/inscription.page';
import { VideosPage } from '../pages/videos.page';
import { mockVideosApiSuccess } from '../fixtures/videos.mock';

test.describe('Thème clair / sombre', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
  });

  test('démarre en mode clair par défaut (préférence système)', async ({ page }) => {
    const inscriptionPage = new InscriptionPage(page);
    await inscriptionPage.goto();

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(inscriptionPage.themeToggle).toHaveText('🌙');
  });

  test('bascule en mode sombre au clic et inversement 006', async ({ page }) => {
    const inscriptionPage = new InscriptionPage(page);
    await inscriptionPage.goto();

    await inscriptionPage.themeToggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(inscriptionPage.themeToggle).toHaveText('☀️');

    await inscriptionPage.themeToggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(inscriptionPage.themeToggle).toHaveText('🌙');
  });

  test('le choix de thème est conservé après rechargement de la page', async ({ page }) => {
    const inscriptionPage = new InscriptionPage(page);
    await inscriptionPage.goto();
    await inscriptionPage.themeToggle.click();

    await page.reload();

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('le choix de thème est conservé en naviguant entre les pages', async ({ page }) => {
    await mockVideosApiSuccess(page);

    const inscriptionPage = new InscriptionPage(page);
    await inscriptionPage.goto();
    await inscriptionPage.themeToggle.click();

    const videosPage = new VideosPage(page);
    await videosPage.goto();

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(videosPage.themeToggle).toHaveText('☀️');
  });
});
