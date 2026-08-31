---
name: execution-ci-cd
description: Exécute localement le workflow CI/CD généré par cicd-generation (.github/workflows/ci.yml) via l'outil `act`, job par job, en capturant les statuts et logs de chaque step. N'exécute jamais le job de déploiement sans confirmation explicite. Appelée en étape 4 par l'orchestrateur, jamais déclenchée directement par l'utilisateur.
---

## Rôle
Exécuter le workflow CI/CD généré, capturer le résultat de chaque step, et remonter un rapport structuré. Ne modifie jamais le fichier ci.yml (rôle de `cicd-generation`).

## Invocation
Appelée uniquement par l'orchestrateur (étape 4), avec en entrée le chemin de `.github/workflows/ci.yml` confirmé généré par `cicd-generation`.

## Prérequis
- Outil `act` disponible en local, lui-même dépendant de Docker (Docker daemon actif).
- Si `act` ou Docker indisponible → `"status": "failed", "error": "act ou Docker non disponible"`, ne rien exécuter.
- Si `.github/workflows/ci.yml` absent → rappeler `cicd-generation`, ne pas échouer silencieusement.
- Si YAML invalide → `"status": "failed", "error": "ci.yml invalide"`.

## Procédure
1. Vérifier l'existence de `.github/workflows/ci.yml`. Absent → rappeler `cicd-generation`.
2. Parser tous les jobs du workflow, sans supposer de nom fixe (ex. via `act -l` pour lister les jobs réels).
3. Pour chaque job **hors job de déploiement** (identifié par convention, ex. nom contenant `deploy` ou présence de secrets requis) :
   - Exécuter via `act -j <nom_job>`
   - Pour chaque step : nom, commande, code retour, logs
   - Si un step échoue → arrêter ce job, ne pas continuer les steps suivants
4. Si tous les jobs non-déploiement réussissent ET qu'un job de déploiement existe dans le workflow → **ne pas l'exécuter automatiquement**. Le signaler dans le rapport (`"deploy_job_pending_confirmation": true`) et attendre une confirmation explicite en amont (orchestrateur/utilisateur) avant tout appel ultérieur.
5. En cas d'échec d'un job (hors déploiement) → appeler `bug-diagnostic` avec les logs du job en échec.

## Tools à utiliser
- `run_command` (pour `act`), `read_file`. Aucun accès réseau hors ce que `act`/Docker requièrent pour tourner.

## Format de sortie
Écrire `./execution-ci-cd-report.json` (fichier unique, pas de multiples fichiers séparés) :

```json
{
  "status": "success",
  "jobs": [
    {
      "name": "",
      "status": "success",
      "steps": [
        { "name": "", "command": "", "exit_code": 0, "log": "" }
      ]
    }
  ],
  "deploy_job_pending_confirmation": false
}
```
`status` global ∈ `success` | `failed` | `partial` (si un job échoue mais d'autres réussissent).