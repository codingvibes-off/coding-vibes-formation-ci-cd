# Coding Vibes — Formation

Petite application Angular (standalone components, signals) réalisée pour la vidéo
"CI/CD" de la chaîne Coding Vibes.

## Fonctionnement

1. `/inscription` — un formulaire réactif (prénom, email, niveau) avec validation.
2. À la soumission, l'utilisateur est redirigé vers `/videos`.
3. `/videos` — liste des vidéos YouTube de la chaîne, récupérées en direct via
   l'API oEmbed de YouTube (titre, auteur, miniature) — aucune donnée statique.

## Démarrer en local

```bash
npm install
npm start
```

L'application est disponible sur http://localhost:4200.

## Build de production

```bash
npm run build
```

Les fichiers générés sont dans `dist/coding-vibes-formation`.

## Tests

```bash
npm test
```

Utilise Karma + ChromeHeadless (Puppeteer fournit le binaire Chrome en CI).

## CI/CD

Le pipeline GitHub Actions (`.github/workflows/ci.yml`) installe les dépendances,
lance les tests unitaires, build l'application en production et publie le
résultat comme artefact — support pour la démo CI/CD de la vidéo.

## Stack

- Angular 18 (standalone components, signals, control flow `@if`/`@for`)
- Reactive Forms
- Thème visuel Coding Vibes (dark / gold #FFD700 / teal #2DD4BF)
