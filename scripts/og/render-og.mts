// Renders the link preview images: scripts/og/og-image.html → site-root/og/<locale>.jpg.
// Usage: npm run og (needs the Playwright Chromium: npx playwright install chromium)
import { chromium } from '@playwright/test';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const LOCALES = ['en', 'pt-BR', 'fr'] as const;
const template = pathToFileURL(join(import.meta.dirname, 'og-image.html')).href;
const outDir = join(import.meta.dirname, '..', '..', 'site-root', 'og');

const browser = await chromium.launch();
try {
  for (const locale of LOCALES) {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
    await page.goto(`${template}#${locale}`);
    // wait for the fonts and the photo, or the screenshot catches the fallbacks
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map((image) => image.decode()));
    });
    const file = join(outDir, `${locale}.jpg`);
    await page.screenshot({ path: file, type: 'jpeg', quality: 88 });
    await page.close();
    console.log(`Link preview image: ${file}`);
  }
} finally {
  await browser.close();
}
