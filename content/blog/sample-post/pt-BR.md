---
title: 'Post de exemplo: o que um post pode ter'
description: Um rascunho que mostra cada elemento que o blog renderiza, em três idiomas. Ele nunca chega ao site publicado.
date: 2026-11-07
tags: [sample]
draft: true
---

Este post é um **rascunho**: o `npm start` mostra, os builds de produção deixam de fora. Ele
existe para testar o pipeline do blog e o layout dos posts com cada elemento que um post pode usar.

## Texto

Um parágrafo com um [link para os projetos](/pt/projects/), _ênfase_, **texto forte** e
`código inline`.

- Um item de lista
- Outro, com `código`

1. Primeiro passo
2. Segundo passo

> Uma citação, para quando alguém já disse melhor.

## Código

### TypeScript

```ts
export function readingMinutes(words: number): number {
  return Math.max(1, Math.round(words / 200));
}
```

### SCSS e shell

```scss
.post {
  max-inline-size: var(--reading-max);
}
```

```bash
npm run content:drafts && npm start
```

## Tabela

| Elemento | Renderizado por |
| -------- | --------------- |
| Texto    | markdown-it     |
| Código   | Shiki, no build |
