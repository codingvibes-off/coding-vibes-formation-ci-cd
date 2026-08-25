import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export type Niveau = 'debutant' | 'intermediaire' | 'avance';

export interface InscriptionData {
  prenom: string;
  email: string;
  niveau?: Niveau;
}

export class InscriptionPage extends BasePage {
  readonly prenomInput: Locator = this.page.locator('input[formcontrolname="prenom"]');
  readonly emailInput: Locator = this.page.locator('input[formcontrolname="email"]');
  readonly niveauSelect: Locator = this.page.locator('select[formcontrolname="niveau"]');
  readonly submitButton: Locator = this.page.locator('button.cta');
  readonly prenomError: Locator = this.page.locator('.field:has(input[formcontrolname="prenom"]) .error');
  readonly emailError: Locator = this.page.locator('.field:has(input[formcontrolname="email"]) .error');

  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.page.goto('/inscription');
  }

  async remplirFormulaire({ prenom, email, niveau }: InscriptionData): Promise<void> {
    await this.prenomInput.fill(prenom);
    await this.emailInput.fill(email);
    if (niveau) {
      await this.niveauSelect.selectOption(niveau);
    }
  }

  async soumettre(): Promise<void> {
    await this.submitButton.click();
  }

  async sinscrire(data: InscriptionData): Promise<void> {
    await this.remplirFormulaire(data);
    await this.soumettre();
  }
}
