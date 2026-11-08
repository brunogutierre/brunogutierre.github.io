import { expect, test } from './fixtures';

test('the experience page prints as a CV, without the site around it', async ({ page }) => {
  await page.goto('/experience/');
  await page.emulateMedia({ media: 'print' });

  await expect(page.locator('app-site-header')).toBeHidden();
  await expect(page.locator('app-site-footer')).toBeHidden();
  await expect(page.locator('.cv-contact')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Print or save as PDF' })).toBeHidden();
});

test('while printing, the title names the PDF after the CV', async ({ page }) => {
  await page.goto('/experience/');
  const title = await page.title();

  await page.evaluate(() => dispatchEvent(new Event('beforeprint')));
  await expect(page).toHaveTitle('Bruno Gutierre - CV');

  await page.evaluate(() => dispatchEvent(new Event('afterprint')));
  await expect(page).toHaveTitle(title);
});
