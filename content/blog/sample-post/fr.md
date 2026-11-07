---
title: 'Article d’exemple : ce qu’un article peut contenir'
description: Un brouillon qui montre chaque élément que le blogue affiche, en trois langues. Il n’arrive jamais sur le site publié.
date: 2026-11-07
tags: [sample]
draft: true
---

Cet article est un **brouillon** : `npm start` l’affiche, les builds de production l’excluent. Il
sert à essayer le pipeline du blogue et la mise en page des articles avec chaque élément possible.

## Texte

Un paragraphe avec un [lien vers les projets](/fr/projects/), de l’_emphase_, du **texte fort** et
du `code en ligne`.

- Un élément de liste
- Un autre, avec du `code`

1. Première étape
2. Deuxième étape

> Une citation, pour quand quelqu’un l’a déjà mieux dit.

## Code

### TypeScript

```ts
export function readingMinutes(words: number): number {
  return Math.max(1, Math.round(words / 200));
}
```

### SCSS et shell

```scss
.post {
  max-inline-size: var(--reading-max);
}
```

```bash
npm run content:drafts && npm start
```

## Tableau

| Élément | Affiché par     |
| ------- | --------------- |
| Texte   | markdown-it     |
| Code    | Shiki, au build |
