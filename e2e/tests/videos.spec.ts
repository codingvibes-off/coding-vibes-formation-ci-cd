import { test, expect } from '@playwright/test';
import { InscriptionPage } from '../pages/inscription.page';
import { VideosPage } from '../pages/videos.page';
import { mockVideosApiFailure, mockVideosApiSuccess, VIDEOS_COUNT } from '../fixtures/videos.mock';

test.describe('Page vidéos', () => {
  test('affiche un message de bienvenue personnalisé après une inscription', async ({ page }) => {
    await mockVideosApiSuccess(page);

    const inscriptionPage = new InscriptionPage(page);
    await inscriptionPage.goto();
    await inscriptionPage.sinscrire({ prenom: 'Ada', email: 'ada@coding-vibes.fr' });

    const videosPage = new VideosPage(page);
    await expect(videosPage.welcomeMessage).toContainText('Bienvenue Ada');
  });

  test('affiche un message générique sans inscription préalable', async ({ page }) => {
    await mockVideosApiSuccess(page);

    const videosPage = new VideosPage(page);
    await videosPage.goto();

    await expect(videosPage.welcomeMessage).toHaveText('Nos formations');
  });

  test('affiche la grille de vidéos une fois le chargement terminé', async ({ page }) => {
    await mockVideosApiSuccess(page);

    const videosPage = new VideosPage(page);
    await videosPage.goto();
    await videosPage.attendreChargementTermine();

    await expect(videosPage.videoCards).toHaveCount(VIDEOS_COUNT);
    await expect(videosPage.videoCardTitle(0)).not.toBeEmpty();
    await expect(videosPage.videoCardAuteur(0)).toHaveText('Coding Vibes');
  });

  test('chaque carte vidéo pointe vers YouTube dans un nouvel onglet', async ({ page }) => {
    await mockVideosApiSuccess(page);

    const videosPage = new VideosPage(page);
    await videosPage.goto();
    await videosPage.attendreChargementTermine();

    const premiereCarte = videosPage.videoCards.first();
    await expect(premiereCarte).toHaveAttribute('href', /youtube\.com\/watch\?v=/);
    await expect(premiereCarte).toHaveAttribute('target', '_blank');
    await expect(premiereCarte).toHaveAttribute('rel', 'noopener');
  });

  test('affiche des vidéos de repli si l\'API YouTube échoue', async ({ page }) => {
    await mockVideosApiFailure(page);

    const videosPage = new VideosPage(page);
    await videosPage.goto();
    await videosPage.attendreChargementTermine();

    await expect(videosPage.videoCards).toHaveCount(VIDEOS_COUNT);
    await expect(videosPage.videoCardTitle(0)).toHaveText('Vidéo indisponible');
  });

  test('le lien "S\'inscrire" mène vers le formulaire d\'inscription', async ({ page }) => {
    await mockVideosApiSuccess(page);

    const videosPage = new VideosPage(page);
    await videosPage.goto();
    await videosPage.inscriptionLink.click();

    await expect(page).toHaveURL(/\/inscription$/);
  });
});
