---
name: bug-diagnostic
description: Diagnostique les échecs d'exécution du workflow CI/CD (.github/workflows/ci.yml) à partir du rapport de execution-ci-cd, propose des correctifs, et pilote une boucle de correction bornée (cicd-generation → execution-ci-cd). Appelée en étape 5 par l'orchestrateur, jamais déclenchée directement par l'utilisateur.
---

## Rôle
Analyser le rapport d'exécution CI/CD, identifier les causes racines des échecs, proposer des correctifs, et relancer une correction bornée si nécessaire. Ne modifie jamais directement le YAML (rôle de `cicd-generation`) ni n'exécute rien (rôle de `execution-ci-cd`).

## Invocation
Appelée uniquement par l'orchestrateur (étape 5), avec en entrée `./reports/execution-ci-cd-report.json` et un compteur de tentatives (`attempt`, défaut 1).

## Prérequis
Si `./reports/execution-ci-cd-report.json` n'existe pas → appeler `execution-ci-cd` d'abord.

## Procédure
1. Lire `./reports/execution-ci-cd-report.json`.
2. Si `status == "success"` :
   - Ne rien corriger. Proposer à l'utilisateur (texte, jamais d'exécution automatique) : "Le pipeline est en succès localement — souhaitez-vous que je prépare le commit/push sur `main` ?"
3. Si `status == "failed"` ou `"partial"` :
   - Pour chaque job en échec : extraire logs, identifier la cause racine (dépendance manquante, commande invalide, timeout, erreur de config), proposer un correctif concret.
   - Si `attempt < 2` : appeler `cicd-generation` avec les correctifs identifiés, puis `execution-ci-cd` pour re-tester, avec `attempt + 1`.
   - Si `attempt >= 2` : **arrêter la boucle**, ne pas relancer. Remonter un rapport final à l'utilisateur avec les correctifs proposés mais non appliqués automatiquement.
4. `repository-analysis` n'est **pas** rappelée dans cette boucle, sauf si le correctif identifié touche la stack elle-même (changement de version Node détecté comme cause racine) — cas rare, à signaler explicitement si ça arrive.

## Sortie
Écrire `./reports/bug-diagnostic-report.json` :

```json
{
  "status": "success",
  "attempt": 1,
  "pipeline_result": "success",
  "jobs_run": 0,
  "jobs_success": 0,
  "jobs_failed": 0,
  "root_causes": [
    { "job": "", "cause": "", "fix_proposed": "" }
  ],
  "next_action": "propose_push | retry | manual_review_required"
}
```