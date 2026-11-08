import { expect, test } from './fixtures';

// These tests read the draft sample posts in content/blog, which the e2e build includes.

test(
  'a post opens from the blog and its contents link to its headings',
  { tag: '@smoke' },
  async ({ page }) => {
    await page.goto('/blog/');
    await page.getByRole('link', { name: 'Sample post: what a post can contain' }).click();
    await expect(page).toHaveURL('/blog/sample-post/');

    await page
      .getByRole('navigation', { name: 'On this page' })
      .getByRole('link', { name: 'Table' })
      .click();

    await expect(page).toHaveURL('/blog/sample-post/#table');
    await expect(page.getByRole('heading', { name: 'Table' })).toBeInViewport();
  },
);

test('a heading reached from the contents stops below the sticky header', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'the header is sticky from 900 px up');
  await page.goto('/blog/sample-post/');

  await page
    .getByRole('navigation', { name: 'On this page' })
    .getByRole('link', { name: 'Code', exact: true })
    .click();

  await expect(page).toHaveURL(/#code$/);
  const top = await page
    .locator('#code')
    .evaluate((heading) => heading.getBoundingClientRect().top);
  expect(Math.round(top)).toBe(64); // --header-h
});

test('back after a heading link returns to where the reader was', async ({ page }) => {
  await page.goto('/pt/blog/sample-post/');
  // a DOM click: Playwright's own click would scroll the link into view first
  await page
    .locator('a.header-anchor[href$="#codigo"]')
    .evaluate((link: HTMLElement) => link.click());
  await expect(page).toHaveURL(/#codigo$/);
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(0);

  await page.goBack();

  await expect(page).toHaveURL('/pt/blog/sample-post/');
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
});

test.describe('copy buttons', () => {
  test.use({ permissions: ['clipboard-read', 'clipboard-write'] });

  test('copy the code of their block', async ({ page }) => {
    await page.goto('/blog/sample-post/');
    const block = page.locator('.code-block').first();

    await block.getByRole('button', { name: 'Copy' }).click();

    await expect(block.getByRole('button', { name: 'Copied' })).toBeVisible();
    await expect(page.getByRole('status')).toHaveText('Code copied to the clipboard');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      await block.locator('pre').textContent(),
    );
  });
});

test(
  'a post in one language is listed elsewhere and has no translations',
  { tag: '@smoke' },
  async ({ page }) => {
    await page.goto('/pt/blog/');
    const elsewhere = page.getByRole('region', { name: 'Em outros idiomas' });
    const link = elsewhere.getByRole('link', { name: 'Sample post in one language' });
    await expect(link).toHaveAttribute('href', '/blog/sample-english-only/');
    await expect(link).toHaveAttribute('hreflang', 'en');

    await link.click();

    await expect(page).toHaveURL('/blog/sample-english-only/');
    const languages = page.getByRole('navigation', { name: 'Languages' });
    await expect(languages.getByRole('link', { name: /Português/ })).toHaveAttribute(
      'href',
      '/pt/blog/',
    );
    await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(2); // en, x-default
  },
);
