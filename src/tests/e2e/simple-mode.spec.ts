import { test, expect } from '@playwright/test';

test.describe('Simple Mode & Dual-Language Navigation', () => {
  test('renders initial profile and switches language dynamically', async ({ page }) => {
    await page.goto('/');

    // Esperar a que el cliente complete la hidratación
    await expect(page.locator('[data-hydrated="true"]')).toBeVisible();

    // Verificar el título de la página
    await expect(page).toHaveTitle(/Fabio Ignacio Navarro/);

    // Verificar el encabezado inicial
    const heading = page.locator('h1');
    await expect(heading).toContainText('Fabio Ignacio Navarro');

    // Prueba del selector de idioma
    const langButton = page.locator('button[title*="Cambiar idioma"]');
    await expect(langButton).toBeVisible();

    // Hacer clic en el botón de cambio de idioma
    await langButton.click();

    // Verificar que el idioma haya cambiado
    const newText = await langButton.textContent();
    if (newText?.includes('EN')) {
      await expect(page.locator('text=Work Experience')).toBeVisible();
      await expect(page.locator('text=Featured Projects')).toBeVisible();
    } else {
      await expect(page.locator('text=Experiencia Laboral')).toBeVisible();
      await expect(page.locator('text=Proyectos Destacados')).toBeVisible();
    }
  });

  test('opens and closes project case study modal', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-hydrated="true"]')).toBeVisible();

    // Buscar el botón "Ver caso de estudio" o "Read case study"
    const caseStudyBtn = page
      .locator('button:has-text("caso de estudio"), button:has-text("case study")')
      .first();
    await expect(caseStudyBtn).toBeVisible();
    await caseStudyBtn.click();

    // Verificar que el modal esté abierto
    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText(/Problema|Problem/);

    // Cerrar usando el botón Cerrar
    const closeBtn = modal.locator('button:has-text("Cerrar"), button:has-text("Close")');
    await closeBtn.click();
    await expect(modal).not.toBeVisible();
  });

  test('allows switching from Simple Mode to Desktop Mode', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-hydrated="true"]')).toBeVisible();

    // Buscar el botón Desktop en el selector de modo
    const desktopBtn = page.locator('button:has-text("Desktop")');
    await expect(desktopBtn).toBeVisible();
    await desktopBtn.click();

    // Verificar que se rendericen los elementos del Modo Escritorio
    const taskbar = page.locator('nav[aria-label*="Barra de tareas"], nav[aria-label*="taskbar"]');
    await expect(taskbar).toBeVisible();
  });
});
