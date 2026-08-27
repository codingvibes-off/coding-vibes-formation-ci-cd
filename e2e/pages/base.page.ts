import { Locator, Page } from '@playwright/test';

export abstract class BasePage {
  protected constructor(protected readonly page: Page) {}

  get brandName(): Locator {
    return this.page.locator('.brand .brand-name');
  }

  get themeToggle(): Locator {
    return this.page.locator('button.theme-toggle');
  }

  abstract goto(): Promise<void>;
}
