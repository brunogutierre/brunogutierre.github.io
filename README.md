# This is my personal page

It will be built for both my personal practice and my portfolio.

> **Rewrite in progress.** The site is being rebuilt with Angular 22 and static prerendering in
> English, Portuguese and French. Until the new app replaces it, the committed `docs/` folder
> (the 2021 build) is what gets published.

## Development

Requires Node 24.

```bash
npm ci
npm start              # dev server on http://localhost:4200
npm test               # unit tests (Vitest), single run
npm run test:ci        # unit tests with coverage
npm run lint           # ESLint (angular-eslint, template accessibility rules)
npm run format:check   # Prettier
npm run build          # static site in dist/personal-site/browser
```

The app is built with `outputMode: "static"`: every route is prerendered to HTML at build time,
so the output is plain files that any static host can serve, with no Node server.

## Deployment

GitHub Pages publishes the site from GitHub Actions, not from a branch folder:

- [`deploy.yml`](.github/workflows/deploy.yml) runs on every push to `main` and on demand. It
  checks the asset links file (below), uploads the site directory as the Pages artifact, deploys
  it, and then verifies the file that is actually being served.
- [`ci.yml`](.github/workflows/ci.yml) runs the same checks on every pull request.

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

- The Pages artifact is uploaded with `include-hidden-files: true`; since
  `actions/upload-pages-artifact` v4, dot folders such as `.well-known/` are left out by default.
- No custom domain on this repository: `brunogutierre.github.io` would then redirect, and App
  Links verification does not follow redirects.
- GitHub disables scheduled workflows after 60 days without repository activity; re-enable the
  monitor in the Actions tab if that happens.

Checks can be run locally (Node 24, no dependencies):

```bash
node --test 'scripts/**/*.test.mjs'
node scripts/check-assetlinks.mjs docs
scripts/verify-live-assetlinks.sh https://brunogutierre.github.io/.well-known/assetlinks.json docs/.well-known/assetlinks.json
```
