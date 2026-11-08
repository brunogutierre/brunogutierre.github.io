import { axeViolations, expect, horizontalOverflow, sitemapPaths, test } from './fixtures';

// Every page of the sitemap, plus the 404 page, in the light and the dark theme.
for (const path of [...sitemapPaths(), '/404/']) {
  test(`${path} passes axe and fits the window, in both themes`, async ({ page }) => {
    for (const colorScheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme });
      await page.goto(path);
      expect(await axeViolations(page), `axe, ${colorScheme} theme`).toEqual([]);
      expect(await horizontalOverflow(page), `overflow, ${colorScheme} theme`).toBe(0);
    }
  });
}
