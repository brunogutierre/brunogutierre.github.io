# This is my personal page

It will be built for both my personal practice and my portfolio.

> **Rewrite in progress.** The site is being rebuilt with Angular 22 and static prerendering in
> English, Portuguese and French. The shell, languages and design are live; the content sections
> (projects, experience, blog) are placeholders for now.

## Development

Requires Node 24.

```bash
npm ci
npm start              # dev server on http://localhost:4200 (English)
npm run start:pt       # Portuguese, also at / (one locale per dev server)
npm run start:fr       # French, also at /
npm test               # unit tests (Vitest), single run
npm run test:ci        # unit tests with coverage (gate: 80%)
npm run test:scripts   # tests of the Node guard scripts
npm run test:content   # type-check and tests of the blog content pipeline
npm run content:drafts # regenerate blog content (drafts included) while npm start runs
npm run lint           # ESLint (angular-eslint, template accessibility rules)
npm run format:check   # Prettier
npm run build          # every locale, prerendered, in dist/personal-site/browser
npm run check:dist     # validates the built site (see below)
npm run i18n:extract   # refreshes src/locale/messages.json from the templates
```

A dev server runs a single language at `/`, so the language switcher links only work in the full
build (`npm run build`, then serve `dist/personal-site/browser`).

The app is built with `outputMode: "static"`: every route is prerendered to HTML at build time,
so the output is plain files that any static host can serve, with no Node server.

## Languages

The site is built once per language with `@angular/localize`:

| Language             | Locale  | URL    | Translations                     |
| -------------------- | ------- | ------ | -------------------------------- |
| English (source)     | `en`    | `/`    | `src/locale/messages.json`       |
| Brazilian Portuguese | `pt-BR` | `/pt/` | `src/locale/messages.pt-BR.json` |
| French               | `fr`    | `/fr/` | `src/locale/messages.fr.json`    |

- Texts carry custom ids (`i18n="@@nav.blog"`, `` $localize`:@@seo.home.title:...` ``), so a
  translation survives rewording of the English text. A missing translation fails the build.
- The root serves real English content instead of redirecting by browser language, so link
  previews work and search engines see a stable page; every page links its other language
  versions (`hreflang`, with `x-default` on English) and the header switches language with plain
  links, since each language is a separate build.
- URLs always end with `/` (`TrailingSlashPathLocationStrategy`), the form GitHub Pages serves
  folders at without a redirect.

`scripts/check-dist.mjs` runs in CI after the build and fails when a locale lacks its home or 404
page, an HTML file declares the wrong `lang`, a page is a meta-refresh redirect stub, any internal
link, hreflang URL or asset does not resolve to a served file, or a folder would shadow
`/AdvancedSudoku/` (published on this domain by another repository).

## Design

- **Direction: "Canopy".** An evolution of the teal → green → lime gradient of the 2021 site, with
  the downward chevron of its banner as the brand motif (favicon, brand mark, current-section
  marker, labels and the notch at the bottom of the home hero). Deep teal is the accent in the
  light theme and lime in the dark one; lime is only ever a fill behind dark text in light.
- **Tokens** live in [`src/styles/_tokens.scss`](src/styles/_tokens.scss) as CSS custom
  properties: surfaces, text, accent, the hero gradient stops, a fluid type scale sized so French
  fits at 360px, 4px spacing, radii, elevation and motion. Colors use `light-dark()`, so a theme
  is just `color-scheme`; `data-theme` on `<html>` pins light or dark and its absence follows the
  system. The token names match the author's Advanced Sudoku, so both projects read as related.
- **Theme:** the toggle switches to the other theme; switching back to the system's theme forgets
  the choice. An inline script applies the stored choice (`bgsite:v1:theme`) before first paint.
  The prerendered HTML has no theme state: icons switch through CSS and `aria-pressed` is set
  after the first client render, so hydration never sees a different DOM.
- **Fonts:** [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque)
  (display, with its optical-size axis), [Inter](https://rsms.me/inter/) (text) and
  [JetBrains Mono](https://www.jetbrains.com/lp/mono/) (labels), variable woff2 files from
  Fontsource, self-hosted in `public/fonts/` with their SIL Open Font License files. Latin and
  latin-ext subsets load by `unicode-range`; the display font is preloaded.
- **Icons:** inline SVG with `currentColor`, always decorative: [Lucide](https://lucide.dev)
  (ISC) and the GitHub and LinkedIn marks from [Bootstrap Icons](https://icons.getbootstrap.com)
  (MIT).
- **Accessibility:** WCAG AA contrast for every text pair in both themes, visible
  `:focus-visible` outline (white inside the hero), 44px targets, skip link, landmarks,
  `prefers-reduced-motion` (no gradient drift, no transitions), `prefers-contrast: more` and
  `forced-colors` support. No horizontal scroll from 320px.

## Blog

Posts are Markdown files, one per language: `content/blog/<slug>/<locale>.md` (`en.md`,
`pt-BR.md`, `fr.md`). The folder name is the post URL in every language. A post may exist in only
some languages; each language lists only its own posts.

```markdown
---
title: 'Keeping App Links alive'
description: Shown in listings, search results and link previews (up to 200 characters).
date: 2026-11-07
updated: 2026-11-20 # optional
tags: [angular, github-pages] # optional, lowercase slugs, up to 5
draft: true # optional: shown by npm start, left out of production builds
---

Body in Markdown. Headings start at `##`: the title is the page's only `h1`.
```

`npm run content` (`scripts/content/build-content.mts`) runs before `start`, `build`, `test` and
`i18n:extract`. It writes TypeScript into `src/generated/content/` (git-ignored), which the Angular
build compiles and type-checks:

| Output                     | Holds                                                      |
| -------------------------- | ---------------------------------------------------------- |
| `blog.ts`                  | `POSTS`: the posts of each language, newest first; loaders |
| `posts/<locale>/<slug>.ts` | The post HTML, imported lazily: each post is its own chunk |

Decisions:

- **Markdown is rendered at build time, in Node.** `markdown-it` with raw HTML disabled (it is
  escaped) and `markdown-it-anchor` for heading links. Shiki highlights code with `light-dark()`
  colors, so code follows the site theme and no parser or highlighter reaches the browser.
  Rejected: rendering in Angular (`ngx-markdown`), which ships both to every reader; Analog.js, a
  second framework for one feature; unified/remark/rehype, many packages for the same output.
- **Strict content.** Frontmatter is validated with `zod` (unknown keys, bad dates and tags are
  errors), code fences must use a known language, and every problem in every file is reported in
  one run. Drafts are checked too.
- **TypeScript without a build step.** The pipeline is `.mts` that Node 24 runs directly (type
  stripping); `tsconfig.scripts.json` type-checks it. No `tsx` or `ts-node`.
- **Generated code is not committed.** It always matches the Markdown, and reviews show only
  the Markdown.

## Deployment

GitHub Pages publishes the site from GitHub Actions, not from a branch folder:

- [`deploy.yml`](.github/workflows/deploy.yml) runs on every push to `main` and on demand: it
  builds every language, checks the output (`check:dist` and the asset links file, below),
  uploads it as the Pages artifact, deploys it, and then verifies the live site.
- [`ci.yml`](.github/workflows/ci.yml) runs the same build and checks on every pull request.
- `npm run build` ends with [`postbuild.mjs`](scripts/postbuild.mjs) (the npm `postbuild` hook):
  - it copies [`site-root/`](site-root) into the site root. Files that must exist once, at the
    domain root, live there instead of `public/`, which the i18n build copies into every language
    folder;
  - it publishes the prerendered English 404 page as `/404.html`, the single file GitHub Pages
    serves for any missing path. On a missing page the language switcher links to each
    language's home, since the missing URL has no translation.

## Android App Links

`/.well-known/assetlinks.json` holds the
[Digital Asset Links](https://developer.android.com/training/app-links/verify-android-applinks)
of the Advanced Sudoku Android app (`com.altcozygames.advancedsudoku` and its `.timetravel`
variant). Android downloads it to verify the app's links; if it is missing, invalid or behind a
redirect, those links stop opening the app. It is guarded in three layers:

| Layer                                                                | When                                       | What it checks                                                                                                                                                            |
| -------------------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`check-assetlinks.mjs`](scripts/check-assetlinks.mjs)               | Every pull request and before every upload | The file exists in the published directory, is valid JSON, lists exactly the expected packages with well-formed SHA-256 fingerprints, and is byte-identical to its source |
| [`verify-live-assetlinks.sh`](scripts/verify-live-assetlinks.sh)     | After every deployment                     | The live URL answers HTTP 200 without a redirect, with a JSON content type and the committed bytes                                                                        |
| [`assetlinks-monitor.yml`](.github/workflows/assetlinks-monitor.yml) | Weekly and on demand                       | The same live check, independent of deployments                                                                                                                           |

Rules that keep it working:

- The file lives in [`site-root/.well-known/`](site-root/.well-known) and is excluded from
  Prettier: it is published byte for byte, and the live check compares its sha256.

- The Pages artifact is uploaded with `include-hidden-files: true`; since
  `actions/upload-pages-artifact` v4, dot folders such as `.well-known/` are left out by default.
- No custom domain on this repository: `brunogutierre.github.io` would then redirect, and App
  Links verification does not follow redirects.
- GitHub disables scheduled workflows after 60 days without repository activity; re-enable the
  monitor in the Actions tab if that happens.

Checks can be run locally (Node 24; the guard scripts have no dependencies):

```bash
node --test 'scripts/**/*.test.mjs'
npm run build && node scripts/check-assetlinks.mjs dist/personal-site/browser --source site-root/.well-known/assetlinks.json
scripts/verify-live-assetlinks.sh https://brunogutierre.github.io/.well-known/assetlinks.json site-root/.well-known/assetlinks.json
```
