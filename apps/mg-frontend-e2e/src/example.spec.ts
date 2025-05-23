import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect h2 to contain a substring.
  expect(await page.locator('h2').innerText()).toContain('MyGifts');
});
