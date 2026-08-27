import { test, expect } from '@playwright/test';
import { InscriptionPage } from '../pages/inscription.page';

test.describe('Formulaire d\'inscription', () => {
  let inscriptionPage: InscriptionPage;

  test.beforeEach(async ({ page }) => {
    inscriptionPage = new InscriptionPage(page);
    await inscriptionPage.goto();
  });

  test('affiche le formulaire avec les valeurs par défaut 001', async () => {
    await expect(inscriptionPage.prenomInput).toHaveValue('');
    await expect(inscriptionPage.emailInput).toHaveValue('');
    await expect(inscriptionPage.niveauSelect).toHaveValue('debutant');
    await expect(inscriptionPage.submitButton).toBeVisible();
  });

  test('une soumission vide affiche les erreurs de validation - 002', async () => {
    await inscriptionPage.soumettre();

    await expect(inscriptionPage.prenomError).toBeVisible();
    await expect(inscriptionPage.emailError).toBeVisible();
  });

  test('un prénom trop court affiche une erreur de validation 003', async () => {
    await inscriptionPage.remplirFormulaire({ prenom: 'A', email: 'ada@coding-vibes.fr' });
    await inscriptionPage.soumettre();

    await expect(inscriptionPage.prenomError).toBeVisible();
    await expect(inscriptionPage.emailError).toBeHidden();
  });

  test('un email invalide affiche une erreur de validation - 004', async () => {
    await inscriptionPage.remplirFormulaire({ prenom: 'Ada', email: 'pas-un-email' });
    await inscriptionPage.soumettre();

    await expect(inscriptionPage.emailError).toBeVisible();
    await expect(inscriptionPage.prenomError).toBeHidden();
  });

  test('le niveau sélectionné est bien pris en compte', async () => {
    await inscriptionPage.niveauSelect.selectOption('avance');

    await expect(inscriptionPage.niveauSelect).toHaveValue('avance');
  });

  test('un formulaire valide redirige vers la page des formations', async ({ page }) => {
    await inscriptionPage.sinscrire({ prenom: 'Ada', email: 'ada@coding-vibes.fr', niveau: 'intermediaire' });

    await expect(page).toHaveURL(/\/$/);
  });
});
