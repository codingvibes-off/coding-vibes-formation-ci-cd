import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class VideosPage extends BasePage {
  readonly title: Locator = this.page.locator('h1');
  readonly welcomeMessage: Locator = this.page.locator('.eyebrow');
  readonly backButton: Locator = this.page.locator('button.link-btn');
  readonly spinner: Locator = this.page.locator('.spinner');
  readonly errorState: Locator = this.page.locator('.state p');
  readonly videoCards: Locator = this.page.locator('.grid .card');

  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.page.goto('/videos');
  }

  async attendreChargementTermine(): Promise<void> {
    await this.spinner.waitFor({ state: 'detached' });
  }

  videoCardTitle(index: number): Locator {
    return this.videoCards.nth(index).locator('h2');
  }

  videoCardAuteur(index: number): Locator {
    return this.videoCards.nth(index).locator('.auteur');
  }
}
