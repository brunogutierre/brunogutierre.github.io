# This is my personal page

It will be built for both my personal practice and my portfolio.

> **Rewrite in progress.** The site is being rebuilt with Angular 22 and static prerendering in
> English, Portuguese and French. The home page (About and featured projects) and the projects
> page are live; experience and blog are placeholders for now.

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
npm run build:drafts   # the same with the draft posts, to preview them prerendered
npm run check:dist     # validates the built site (see below)
npm run e2e            # end-to-end and accessibility tests of the built site (see Tests)
npm run i18n:extract   # refreshes src/locale/messages.json from the templates
npm run og             # renders the link preview images again
```

A dev server runs a single language at `/`, so the language switcher links only work in the full
build: `npm run build`, then `node scripts/serve-dist.mjs dist/personal-site/browser 4310`, which
serves it the way GitHub Pages does.

## Tests

| Layer            | Command                                     | What it covers                                                                          |
| ---------------- | ------------------------------------------- | --------------------------------------------------------------------------------------- |
| Unit             | `npm test` (`test:ci` with coverage, ≥ 80%) | Components, services and content files, with Vitest in jsdom                            |
| Content pipeline | `npm run test:content`                      | Frontmatter, Markdown rendering, code contrast, generator and feeds (`node:test`)       |
| Build scripts    | `npm run test:scripts`                      | Dist check, postbuild, sitemap and the asset links guard (`node:test`, no dependencies) |
| Built site       | `npm run check:dist`                        | Languages, links, assets, feeds, sitemap and robots.txt of the output (see Languages)   |
| End-to-end, a11y | `npm run e2e`                               | The prerendered site in real browsers, served like GitHub Pages                         |

The end-to-end tests ([`e2e/`](e2e), Playwright) run on the site built with the draft posts, so
the post pages are covered; they read the sample posts in `content/blog/`:

```bash
npx playwright install --with-deps chromium firefox webkit   # once per Playwright version
npm run build:drafts && npm run e2e
```

- **Accessibility:** axe, with the WCAG 2.2 AA rules, on every page of the built sitemap and on
  the 404 page, in the light and dark themes. Pages must also fit the window (no horizontal
  overflow).
- **Flows:** navigation, language switcher, theme kept after a reload, skip link, the 404 status,
  the blog (contents links, back button, copy buttons, a post in one language) and the CV in
  print.
- **Every test** fails on a console error or warning (Angular reports hydration mismatches as
  warnings) or an uncaught exception.
- **Browsers:** the full suite runs in Chromium, on a desktop and on a phone. Firefox and WebKit,
  as an iPhone, run the tests tagged `@smoke`. WebKit needs system libraries that
  `--with-deps` installs on Debian and Ubuntu; elsewhere, run `npm run e2e -- --project chromium
--project mobile --project firefox`.

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

`scripts/check-dist.mjs` runs in CI after the build and fails when:

- a locale lacks its home or 404 page, or the site root lacks `404.html`, `sitemap.xml` or
  `robots.txt`;
- an HTML file declares the wrong `lang`, or a page is a meta-refresh redirect stub;
- any internal link, hreflang URL, asset or link preview image, or any link of a language's feed,
  does not resolve to a served file;
- a folder would shadow `/AdvancedSudoku/` (published on this domain by another repository).

## Search engines, link previews and feeds

Each page declares its metadata in its route (`data.seo`, or a resolver when it depends on the
language or the post), and `SeoService` writes it into the prerendered HTML:

| What                  | Where                                                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Title, description    | Every page                                                                                                         |
| Canonical, `hreflang` | Every indexable page; a post links only the languages it exists in                                                 |
| Open Graph            | Every page; posts are `article`s with their dates and topics                                                       |
| Link preview image    | `site-root/og/<locale>.jpg` (1200×630), one per language                                                           |
| Structured data       | JSON-LD: `Person` on the home page, `BlogPosting` on posts                                                         |
| Atom feed             | `/feed.xml`, `/pt/feed.xml`, `/fr/feed.xml`: full posts, written by `npm run content`, linked from every page head |
| `sitemap.xml`         | Written by `postbuild.mjs` from the prerendered pages: canonical URLs, their alternates, post dates                |
| `robots.txt`          | `site-root/`: the whole domain may be crawled, `/AdvancedSudoku/` included                                         |

The link preview images are rendered from [`scripts/og/og-image.html`](scripts/og/og-image.html)
(name, job title and photo on the hero gradient; the language comes from the URL hash: `#en`,
`#pt-BR`, `#fr`). After changing it, `npm run og` renders each language to
`site-root/og/<locale>.jpg` (1200×630, JPEG quality 88) with Playwright's Chromium.

Decisions:

- **The sitemap is built from the output.** It reads the canonical and `hreflang` links the pages
  already carry, so it cannot disagree with them, and pages marked `noindex` stay out.
- **Feeds carry the full post.** Posts are CC BY 4.0, so readers can stay in their feed reader.
  Entry HTML gets an `xml:base`, so its links resolve.
- **One preview image per language, not per post.** No image renderer in the build; a post shares
  the image of its language.
- **No analytics or third-party scripts.**

## Content

Interface texts (navigation, buttons, headings) go through `@angular/localize`. The site's
content lives in typed files instead, with every language side by side:

| File                        | Holds                                                                  |
| --------------------------- | ---------------------------------------------------------------------- |
| `src/content/profile.ts`    | Role line, city, About paragraphs, highlights and contact links        |
| `src/content/projects.ts`   | Projects (summary, stack, links, featured or in progress), Android app |
| `src/content/experience.ts` | The CV: summary, jobs, skills, education and spoken languages          |
| `public/images/`            | The photo, as WebP at 240 and 480 px                                   |

- Texts are `Localized<string>` values (`{ en, 'pt-BR', fr }`): a missing language is a compile
  error. Components pick the current one with the `CURRENT_LOCALE` token.
- Why not translation files for content: a project summary is edited as a whole, in three
  languages at once, and reads better next to its stack and links than spread over three JSON
  files keyed by id.
- `src/content/content.spec.ts` checks for empty texts, unique ids, exactly three featured
  projects, HTTPS links, a source link on every project, the same number of achievements in every
  language, and CV dates (`YYYY` or `YYYY-MM`, newest first).
- Technology names (project stacks, job stacks, skills) are plain strings: they read the same in
  every language.
- Project order is the order of the list, and each card's sheet number (`P-01`) is its position.
- Photos are exported without metadata (EXIF, GPS). Images are referenced from the site root
  (`/images/...`), so the three language builds share the root copy.

### Printable CV

The experience page is the CV. There is no PDF in the repository: the browser makes one from the
page, so the CV is always the same as the site and exists in each language.

- "Print or save as PDF" calls `window.print()`. Ctrl+P works the same way.
- Print styles (`src/styles/_print.scss`, plus the page's own `@media print` block) hide the
  site header and footer, force light colors, show name and contacts on top (`.print-only`) and
  turn chips into comma-separated lines. The CV fits on two pages in A4 and Letter.
- During printing, the document title becomes "Bruno Gutierre - CV" (`beforeprint` /
  `afterprint`), so the PDF gets a useful file name.

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
| `posts/<locale>/<slug>.ts` | The post HTML and its table of contents, imported lazily   |

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

### Blog pages

| URL                         | Page                                                          |
| --------------------------- | ------------------------------------------------------------- |
| `/blog/`, `/pt/blog/`, …    | The language's posts, newest first, then "In other languages" |
| `/blog/<slug>/`, `/pt/…`, … | A post: one prerendered page per post the language has        |

A post page shows its date, reading time and topics, links to its translations, a table of
contents (from two `##` sections), a copy button on code blocks and links to the older and newer
posts. A gradient bar under the header shows reading progress.

Links between pages of the site are plain Markdown links with the language prefix, such as
`[projects](/pt/projects/)`; the dist check fails the build if one leads nowhere.

Decisions:

- **Untranslated posts stay visible.** A language lists the posts it lacks under "In other
  languages", linking to the version that exists. The post page declares only its own languages,
  so `hreflang` links never point to a missing page, and the language switcher sends readers to
  the blog index of a language without the post.
- **One trusted HTML component.** `PostBody` is the only use of `bypassSecurityTrustHtml`: its
  HTML comes from the repository's Markdown, with raw HTML escaped at build time, and nothing a
  visitor sends reaches it. Angular's sanitizer would strip the heading ids and code colors.
- **Prerendered per language.** `getPrerenderParams` lists the posts of the language being built;
  any other slug is GitHub Pages' 404, and a resolver shows the 404 page for it in the app.
- **Code colors checked for contrast.** Code sits on `--surface-2`, where two colors of
  `github-light-default` fall short of 4.5:1; they are replaced, and a test checks every color.
- **No JavaScript needed to read.** The copy buttons are added in the browser only, and the
  reading progress bar is a CSS scroll-driven animation (no bar where it is unsupported).
- **Drafts are checked in CI.** Until the first real post, the production build has no post
  pages, so CI also prerenders the drafts (`npm run build:drafts`) and runs the dist check.

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
  - it copies `src/generated/site/` (each language's feed, written by `npm run content`) the
    same way;
  - it publishes the prerendered English 404 page as `/404.html`, the single file GitHub Pages
    serves for any missing path. On a missing page the language switcher links to each
    language's home, since the missing URL has no translation;
  - it writes `/sitemap.xml` from the prerendered pages ([`sitemap.mjs`](scripts/sitemap.mjs)).

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

## License

- Code: [MIT](LICENSE).
- Blog posts (`content/blog/`):
  [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Share and adapt them, with credit.
- Fonts: SIL Open Font License, with their license files in `public/fonts/`.
- The photo of Bruno Gutierre and the link preview images (`public/images/`, `site-root/og/`):
  all rights reserved.
