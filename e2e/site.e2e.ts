import { expect, test } from './fixtures';

test('every section opens and hydrates without errors', { tag: '@smoke' }, async ({ page }) => {
  for (const [path, heading] of [
    ['/', /Bruno\s*Gutierre/],
    ['/projects/', 'Projects'],
    ['/experience/', 'Experience'],
    ['/blog/', 'Blog'],
    ['/pt/blog/sample-post/', 'Post de exemplo: o que um post pode ter'],
  ] as const) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
  }
});

test('the header navigates between sections in the app', { tag: '@smoke' }, async ({ page }) => {
  await page.goto('/');
  await page
    .getByRole('navigation', { name: 'Main' })
    .getByRole('link', { name: 'Projects' })
    .click();

  await expect(page).toHaveURL('/projects/');
  await expect(page).toHaveTitle('Projects · Bruno Gutierre');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Projects');
});

test(
  'the language switcher opens the same page in another language',
  { tag: '@smoke' },
  async ({ page }) => {
    await page.goto('/experience/');
    await page
      .getByRole('navigation', { name: 'Languages' })
      .getByRole('link', { name: /Português/ })
      .click();

    await expect(page).toHaveURL('/pt/experience/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Experiência');
  },
);

test('the theme choice survives a reload', { tag: '@smoke' }, async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Dark theme' });
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');

  await toggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
});

test('the skip link moves focus to the content', async ({ page }) => {
  await page.goto('/projects/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();

  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
});

test.describe('a missing page', () => {
  test.use({ expectedConsole: [/status of 404/] });

  test('answers 404 with the not found page', { tag: '@smoke' }, async ({ page }) => {
    const response = await page.goto('/pt/does-not-exist/');

    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  });
});

test('feeds, sitemap and robots.txt are served', async ({ request }) => {
  const feed = await request.get('/pt/feed.xml');
  expect(feed.headers()['content-type']).toContain('xml');
  expect(await feed.text()).toContain('xml:lang="pt-BR"');

  expect(await (await request.get('/sitemap.xml')).text()).toContain('<urlset');
  expect(await (await request.get('/robots.txt')).text()).toContain('Sitemap:');
});
