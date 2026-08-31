---
name: tests-strategy
description: Génère une stratégie de tests (unitaires, intégration, Playwright, SonarQube optionnel) à partir du rapport JSON produit par la skill repository-analysis. Appelée par l'orchestrateur CI/CD à l'étape 2, jamais déclenchée directement par l'utilisateur. Produit un rapport JSON structuré consommé ensuite par cicd-generation.
---

## Rôle
Analyser le rapport de `repository-analysis` et produire une stratégie de tests structurée, sans exécuter aucun test (l'exécution est du ressort de `execution-ci-cd`).

## Invocation
Appelée uniquement par l'orchestrateur, avec en entrée le chemin du rapport `repository-analysis-report.json`. Ne pas déclencher sur une phrase utilisateur directe.

## Prérequis
Si `repository-analysis-report.json` est absent ou invalide → écrire `{ "status": "failed", "error": "rapport source manquant ou invalide" }` dans la sortie et arrêter.

## Checklist
1. Lire `repository-analysis-report.json`.
2. Identifier, par comparaison avec la stack détectée, les types de tests **absents du projet** :
   - Tests unitaires
   - Tests d'intégration
   - Tests Playwright (e2e)
   - Analyse SonarQube (optionnel — inclure seulement si `sonar-project.properties` ou équivalent CI existant est détecté dans le rapport source)
3. Pour chaque type absent, proposer : fichiers/dossiers concernés, priorité (haute/moyenne/basse), commande de lancement recommandée.
4. Vérifier la faisabilité technique (sans exécuter) :
   - Playwright → `npx playwright test --list`
   - Unitaires → détection de `jest`/`vitest`/`mocha` dans `package.json`
   - Intégration → détection de config équivalente

## Tools
Lecture de fichiers, `npx playwright test --list` (dry-run, ne lance rien), pas d'exécution réelle de suite de tests.

## Sortie
Écrire `./tests-strategy-report.json` :

```json
{
  "status": "success",
  "missing_tests": [
    { "type": "unit", "priority": "high", "target": "", "command": "" },
    { "type": "integration", "priority": "medium", "target": "", "command": "" },
    { "type": "e2e_playwright", "priority": "high", "target": "", "command": "" }
  ],
  "sonarqube": { "included": false, "reason": "" }
}
```