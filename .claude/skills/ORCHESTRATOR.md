---
name: orchestrator
description: Orchestre un pipeline complet d'analyse de repo, génération de stratégie de tests, génération et exécution de CI/CD, et diagnostic d'erreurs. Se déclenche sur "Analyse le projet", "lance le pipeline CI/CD", "check mon projet", ou toute demande d'audit/génération de pipeline CI/CD pour un dépôt de code. Appelle séquentiellement 5 skills dans .claude/skills/ en respectant un ordre strict, avec passage de contexte entre chaque étape.
---

## Rôle
Orchestrer, dans l'ordre, 5 skills pour produire une pipeline CI/CD fonctionnelle et diagnostiquée.

## Déclencheurs
- "Analyse le projet"
- "Lance le pipeline CI/CD"
- Toute demande d'audit ou génération de pipeline CI/CD sur un repo

## Pipeline (ordre strict, arrêt en cascade)

| # | Skill | Chemin | Entrée | Sortie attendue |
|---|-------|--------|--------|------------------|
| 1 | Analyse repo | `.claude/skills/repository-analysis/SKILL.md` | Racine du projet | Structure, stack, dépendances détectées |
| 2 | Stratégie de tests | `.claude/skills/tests-strategy/SKILL.md` | Sortie SKILL 1 | Plan de tests unitaires/intégration/Playwright |
| 3 | Génération CI/CD | `.claude/skills/cicd-generation/SKILL.md` | Sortie SKILL 1 + SKILL 2 | Fichier YAML dans `.github/workflows/` |
| 4 | Exécution CI/CD | `.claude/skills/execution-ci-cd/SKILL.md` | Fichier généré par SKILL 3 | Résultat d'exécution (logs, statut) |
| 5 | Diagnostic bugs | `.claude/skills/bugdiagnostic/SKILL.md` | Logs de SKILL 4 | Rapport d'erreurs + suggestions de fix |

## Règle d'arrêt
Si une skill échoue, ne pas appeler la suivante. Marquer les étapes restantes comme `"skipped"` dans le JSON final.

## Format de sortie
Écrire le résultat dans `./orchestrator-report.json` :

```json
{
  "skill_1_repository_analysis": { "status": "success", "output": "" },
  "skill_2_tests_strategy": { "status": "success", "output": "" },
  "skill_3_cicd_generation": { "status": "success", "output": "" },
  "skill_4_execution_ci_cd": { "status": "failed", "error": "" },
  "skill_5_bugdiagnostic": { "status": "skipped", "output": "" }
}
```

`status` ∈ `success` | `failed` | `skipped`.