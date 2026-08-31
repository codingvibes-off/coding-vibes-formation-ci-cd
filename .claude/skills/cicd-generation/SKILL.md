---
name: cicd-generation
description: Génère le fichier .github/workflows/ci.yml (jobs build-and-test et deploy) à partir des rapports de repository-analysis et tests-strategy. Appelée en étape 3 par l'orchestrateur CI/CD, jamais déclenchée directement par l'utilisateur.
---

## Rôle
Générer une configuration GitHub Actions complète (tests + déploiement conditionnel) à partir des deux rapports produits en amont. Ne génère aucune stratégie de test (rôle de `tests-strategy`) et n'exécute rien (rôle de `execution-ci-cd`).

## Invocation
Appelée uniquement par l'orchestrateur (étape 3), avec en entrée :
- `repository-analysis-report.json` (stack, gestionnaire de paquets, version)
- `tests-strategy-report.json` (tests manquants, commandes)

## Prérequis
Si l'un des deux rapports est absent/invalide → `"status": "failed", "error": "rapport(s) source manquant(s)"`, ne rien générer.

## Procédure
1. Lire les deux rapports sources.
2. Déterminer le gestionnaire de paquets à partir de `repository-analysis` (npm/yarn/pnpm) — pas de valeur par défaut supposée sans vérification.
3. Si `.github/workflows/ci.yml` existe déjà (signalé par `repository-analysis`) → demander confirmation avant écrasement (via l'orchestrateur), sinon générer directement.
4. Générer le job **`build-and-test`** :
   - `on: [push, pull_request]` sur `main`
   - Setup Node (version détectée), installation des dépendances (commande selon le gestionnaire détecté), installation de Playwright + navigateurs (`npx playwright install --with-deps chromium`)
   - Exécution des commandes remontées par `tests-strategy` (unitaires, intégration, e2e)
   - Upload du rapport Playwright en artifact, rétention 7 jours
5. Générer le job **`deploy`** (nom fixe, sans accent) :
   - `needs: build-and-test`, condition `if: github.ref == 'refs/heads/main' && needs.build-and-test.result == 'success'`
   - `permissions: pages: write / id-token: write`
   - `environment: name: github-pages`
   - Build de l'application, `actions/upload-pages-artifact`, `actions/deploy-pages`
   - **Note obligatoire en commentaire dans le YAML généré** : ce job se déclenche automatiquement sur GitHub, mais ne doit jamais être exécuté localement par `execution-ci-cd` sans confirmation explicite.
6. Écrire `.github/workflows/ci.yml`.

## Tools à utiliser
`read_file`, `write_file`. Aucune exécution, aucun accès réseau.

## Format de sortie
Écrire `./cicd-generation-report.json` :

```json
{
  "status": "success",
  "workflow_path": ".github/workflows/ci.yml",
  "jobs_generated": ["build-and-test", "deploy"],
  "package_manager_used": ""
}
```