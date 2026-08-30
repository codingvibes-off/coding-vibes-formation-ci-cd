---
name: repository-analysis
description: Analyse LOCALE d'un repository (stack technique, tests, Docker,
  workflows GitHub Actions existants) avant génération d'une configuration
  CI/CD. Ne nécessite aucun accès réseau ni token — lecture de fichiers
  uniquement.
---

## Rôle

Cette Skill analyse un repository local et produit un rapport factuel
sur son état actuel (stack technique, tests, Docker, workflows GitHub
Actions existants).

Elle ne juge pas si le projet est "prêt" et ne génère aucun fichier
de configuration CI/CD — ces responsabilités appartiennent exclusivement
à la Skill `cicd-generation`, qui utilise ce rapport comme entrée.


## Déclencheurs

- Avant toute génération de configuration CI/CD sur un repo, en amont
  de `cicd-generation`
- Avant de proposer une stratégie de tests, en amont de `test-strategy`
- Quand l'utilisateur demande explicitement "analyse mon projet" ou
  "qu'est-ce qu'il y a dans ce repo"
- Quand un nouveau repo est ajouté à l'orchestrateur et qu'aucun
  rapport d'analyse n'existe encore pour lui
- Quand un fichier structurant a changé depuis le dernier rapport
  (ex: `package.json`, `angular.json`, `.github/workflows/*.yml`,
  ajout/suppression d'un `Dockerfile`) — pas à chaque commit


## Checklist

1. Analyser le projet dans cet ordre précis : stack technique, tests,
   Docker, workflows GitHub Actions existants.

2. Stack technique
   - Lire `package.json` → framework principal, version
   - Vérifier la cohérence entre `package-lock.json` et `package.json`
   - Lire `angular.json` séparément → configurations de build disponibles

3. Tests
   - Chercher les dossiers `e2e/` et `tests/`
   - Lire les scripts `test` et `e2e` dans `package.json`
   - Compter les fichiers de test présents, identifier le framework
   - NE PAS exécuter les tests (rôle de `pipeline-execution`)

4. Docker
   - Chercher un `Dockerfile` dans tout le repo, pas uniquement à la racine
   - Remonter un booléen `true`/`false`, jamais une conclusion du type
     "le projet n'utilise pas Docker"

5. Workflows GitHub Actions existants
   - Vérifier la présence de `.github/workflows/ci.yml` (booléen)
   - Si présent, lister les steps existants tels quels
   - NE PAS juger si une étape manque (rôle de `cicd-generation`)

## Tools à utiliser

- `read_file` : lire le contenu d'un fichier dont le chemin est déjà
  connu (package.json, angular.json, package-lock.json, ci.yml)
- `list_directory` : lister le contenu d'un dossier connu
  (e2e/, tests/, .github/workflows/)
- `search_files` : localiser un fichier par nom dans TOUT le repo,
  sans connaître son chemin à l'avance (Dockerfile, playwright.config.ts)

Cette Skill n'utilise AUCUN Tool d'exécution (run_command) ni AUCUN
Tool réseau (appel API GitHub) — cohérent avec le Rôle défini ci-dessus.


## Format de sortie

Cette Skill retourne uniquement un objet JSON valide en sortie de son
exécution — jamais un fichier écrit sur le disque, jamais de texte
autour. L'orchestrateur reçoit ce JSON directement en mémoire et
décide quoi en faire (le transmettre à `test-strategy`, l'afficher...).

{
  "stack": {
    "framework": string,
    "version": string | null,
    "lockfile_consistent": boolean
  },
  "tests": {
    "e2e": {
      "detected": boolean,
      "framework": string | null,
      "test_files_count": number | null,
      "folder": string | null
    }
  },
  "docker": {
    "detected": boolean
  },
  "existing_workflows": {
    "detected": boolean,
    "file": string | null,
    "steps": string[]
  }
}