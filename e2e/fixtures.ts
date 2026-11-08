import AxeBuilder from '@axe-core/playwright';
import { expect, test as base, type Page } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';

export { expect };

interface Options {
  /** Console messages a test expects, such as the 404 of a missing page. */
  readonly expectedConsole: readonly RegExp[];
}

/**
 * Every test fails on console errors or warnings (Angular reports hydration mismatches as
 * warnings) and on uncaught exceptions in the page.
 */
export const test = base.extend<Options & { consoleProblems: string[] }>({
  expectedConsole: [[], { option: true }],
  consoleProblems: [
    async ({ page, expectedConsole }, use) => {
      const problems: string[] = [];
      page.on('console', (message) => {
        const text = `${message.type()}: ${message.text()}`;
        const expected = expectedConsole.some((pattern) => pattern.test(text));
        if (['error', 'warning'].includes(message.type()) && !expected) problems.push(text);
      });
      page.on('pageerror', (error) => problems.push(`uncaught: ${error.message}`));
      await use(problems);
      expect(problems, 'console errors and warnings').toEqual([]);
    },
    { auto: true },
  ],
});

const SITE = 'dist/personal-site/browser';

/** Site paths of every page in the built sitemap: all indexable pages, in every language. */
export function sitemapPaths(): string[] {
  if (!existsSync(`${SITE}/sitemap.xml`)) {
    throw new Error('No built site to test: run `npm run build:drafts` first.');
  }
  const sitemap = readFileSync(`${SITE}/sitemap.xml`, 'utf8');
  return [...sitemap.matchAll(/<loc>https:\/\/brunogutierre\.github\.io(\/[^<]*)<\/loc>/g)].map(
    ([, path]) => path,
  );
}

/** axe violations of the page for WCAG 2.2 AA rules, one line each. */
export async function axeViolations(page: Page): Promise<string[]> {
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  return violations.map(
    ({ id, nodes }) => `${id}: ${nodes.map((node) => node.target.join(' ')).join(' | ')}`,
  );
}

/** How far the page is wider than the window: 0 when nothing sticks out sideways. */
export function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
}
