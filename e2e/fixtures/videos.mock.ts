import { Page } from '@playwright/test';

// Doit correspondre au nombre d'ids dans VIDEO_IDS (src/app/services/videos.service.ts).
export const VIDEOS_COUNT = 8;

/**
 * Intercepte les appels à l'API oEmbed de YouTube et répond avec des données
 * déterministes, pour ne pas dépendre du réseau ni de YouTube dans les tests e2e.
 */
export async function mockVideosApiSuccess(page: Page): Promise<void> {
  await page.route('**/oembed**', async (route) => {
    const requestUrl = new URL(route.request().url());
    const videoUrl = requestUrl.searchParams.get('url') ?? '';
    const id = videoUrl.match(/v=([^&]+)/)?.[1] ?? 'inconnu';

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        title: `Vidéo de test ${id}`,
        author_name: 'Coding Vibes',
        thumbnail_url: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
      })
    });
  });
}

/** Simule une API oEmbed indisponible pour déclencher le repli côté service. */
export async function mockVideosApiFailure(page: Page): Promise<void> {
  await page.route('**/oembed**', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Erreur serveur' })
    });
  });
}
