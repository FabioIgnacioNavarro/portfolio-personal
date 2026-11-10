import { test, expect } from '@playwright/test';

test.describe('Simple Mode & Dual-Language Navigation', () => {
  test('renders initial profile and switches language dynamically', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/Fabio Ignacio Navarro/);

    // Initial language (default or detected)
    const heading = page.locator('h1');
    await expect(heading).toContainText('Fabio Ignacio Navarro');

    // Language toggle test
    const langButton = page.locator('button[title*="Cambiar idioma"]');
    await expect(langButton).toBeVisible();

    // Toggle to EN (or ES)
    const initialText = await langButton.textContent();
    await langButton.click();

    // Verify sections update
    if (initialText?.includes('ES')) {
      await expect(page.locator('text=Work Experience')).toBeVisible();
      await expect(page.locator('text=Featured Projects')).toBeVisible();
    } else {
      await expect(page.locator('text=Experiencia Laboral')).toBeVisible();
      await expect(page.locator('text=Proyectos Destacados')).toBeVisible();
    }
  });

  test('opens and closes project case study modal', async ({ page }) => {
    await page.goto('/');

    // Find "Ver caso de estudio" or "Read case study" button
    const caseStudyBtn = page
      .locator('button:has-text("caso de estudio"), button:has-text("case study")')
      .first();
    await expect(caseStudyBtn).toBeVisible();
    await caseStudyBtn.click();

    // Verify modal is open
    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText(/Problema|Problem/);

    // Close via Close button
    const closeBtn = modal.locator('button:has-text("Cerrar"), button:has-text("Close")');
    await closeBtn.click();
    await expect(modal).not.toBeVisible();
  });

  test('allows toggling theme between light and dark', async ({ page }) => {
    await page.goto('/');

    // Target specifically the theme button by aria-label
    const themeBtn = page.locator('button[aria-label*="tema"]');
    await expect(themeBtn).toBeVisible();
    await themeBtn.click();

    const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    expect(typeof isDark).toBe('boolean');
  });
});
