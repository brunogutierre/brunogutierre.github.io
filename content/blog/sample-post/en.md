---
title: 'Sample post: what a post can contain'
description: A draft that shows every element the blog renders, in three languages. It never reaches the published site.
date: 2026-11-07
tags: [sample]
draft: true
---

This post is a **draft**: `npm start` shows it, production builds leave it out. It exists to try
the blog pipeline and the post layout with every element a post can use.

## Text

A paragraph with a [link to the projects](/projects/), _emphasis_, **strong text** and
`inline code`.

- A list item
- Another one, with `code`

1. First step
2. Second step

> A quote, for when someone else said it better.

## Code

### TypeScript

```ts
export function readingMinutes(words: number): number {
  return Math.max(1, Math.round(words / 200));
}
```

### SCSS and shell

```scss
.post {
  max-inline-size: var(--reading-max);
}
```

```bash
npm run content:drafts && npm start
```

## Table

| Element | Rendered by    |
| ------- | -------------- |
| Text    | markdown-it    |
| Code    | Shiki at build |
