---
name: repository-analysis
description: Analyse LOCALE d'un repository (stack technique, tests, Docker, workflows GitHub Actions existants) avant génération d'une configuration CI/CD. Ne nécessite aucun accès réseau ni token — lecture de fichiers uniquement. Appelée en première étape par l'orchestrateur CI/CD, ou directement par l'utilisateur pour un audit ponctuel du repo.
---

## Rôle
Analyser un repository local et produire un rapport factuel sur son état actuel (stack technique, tests, Docker, workflows GitHub Actions existants). Ne juge rien, ne génère aucun fichier de configuration CI/CD — rôle exclusif de `cicd-generation`.

## Déclencheurs
- Appelée en étape 1 par l'orchestrateur (trigger "Analyse le projet")
- Directement par l'utilisateur : "analyse mon projet", "qu'est-ce qu'il y a dans ce repo" (hors contexte pipeline — audit simple, sans enchaîner les skills suivantes)
- Quand `repository-analysis-report.json` n'existe pas encore pour ce repo
- Quand un fichier structurant a changé depuis le timestamp du dernier `repository-analysis-report.json` (`package.json`, `angular.json`, `.github/workflows/*.yml`, apparition/suppression d'un `Dockerfile`) — pas à chaque commit

## Checklist
1. Détection du type de projet en amont : chercher `package.json` (Node), `requirements.txt`/`pyproject.toml` (Python), `go.mod` (Go), etc. Si aucun reconnu → `"stack": "unknown"`, ne pas bloquer le reste.
2. **Stack technique** (si Node) : lire `package.json` → framework principal, version ; cohérence `package-lock.json` vs `package.json` ; lire `angular.json` séparément si présent → configurations de build disponibles. Si monorepo (plusieurs `package.json`) → lister chaque sous-projet séparément.
3. **Tests** : chercher `e2e/`, `tests/` ; lire scripts `test`/`e2e` dans `package.json` ; compter les fichiers de test, identifier le framework. Ne pas exécuter (rôle de `execution-ci-cd`).
4. **Docker** : chercher un `Dockerfile` dans tout le repo. Retourner un booléen brut, jamais une interprétation.
5. **Workflows GitHub Actions existants** : vérifier `.github/workflows/ci.yml` (booléen). Si présent, lister les steps tels quels, sans juger de ce qui manque (rôle de `cicd-generation`).

## Tools à utiliser
- `read_file`, `list_directory`, `search_files` uniquement — aucun `run_command`, aucun appel réseau.

## Format de sortie
Écrire `./repository-analysis-report.json` :

```json
{
  "generated_at": "",
  "stack": { "type": "node|python|go|unknown", "framework": "", "version": "" },
  "monorepo": { "detected": false, "projects": [] },
  "tests": { "unit_command": "", "e2e_command": "", "test_files_count": 0, "framework": "" },
  "docker": { "dockerfile_found": false },
  "ci": { "workflow_found": false, "existing_steps": [] }
}
```
Aucun texte hors JSON. En cas d'erreur de lecture, remonter `"status": "failed"` avec `"error"`.