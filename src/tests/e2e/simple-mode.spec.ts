import { test, expect } from '@playwright/test';

test.describe('Simple Mode, Accessibility, SEO & Dual-Language Navigation', () => {
  test('renders initial profile in dark-only mode with animated background and switches language dynamically', async ({
    page,
  }) => {
    await page.goto('/');

    // Esperar a que el cliente complete la hidratación
    await expect(page.locator('[data-hydrated="true"]')).toBeVisible();

    // Verificar apariencia única en modo oscuro fija en <html>
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Verificar fondo ambiental animado en Modo Simple
    await expect(page.getByTestId('simple-background')).toBeVisible();

    // Verificar enlace de salto accesible al contenido principal
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toHaveCount(1);

    // Verificar el título de la página
    await expect(page).toHaveTitle(/Fabio Ignacio Navarro/);

    // Verificar el encabezado inicial
    const heading = page.locator('h1');
    await expect(heading).toContainText('Fabio Ignacio Navarro');

    // Prueba del selector de idioma y sincronización de <html lang>
    const langButton = page.locator(
      'header button[aria-label*="idioma"], header button[aria-label*="language"]',
    );
    await expect(langButton).toBeVisible();

    const initialText = await langButton.textContent();
    await langButton.click();

    const newText = await langButton.textContent();
    expect(newText).not.toBe(initialText);

    if (newText?.includes('EN')) {
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
      await expect(page.locator('text=Work Experience')).toBeVisible();
      await expect(page.locator('text=Featured Projects')).toBeVisible();
    } else {
      await expect(page.locator('html')).toHaveAttribute('lang', 'es');
      await expect(page.locator('text=Experiencia Laboral')).toBeVisible();
      await expect(page.locator('text=Proyectos Destacados')).toBeVisible();
    }
  });

  test('exposes Open Graph metadata, JSON-LD, robots.txt and sitemap.xml', async ({
    page,
    request,
  }) => {
    await page.goto('/');

    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
    await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);

    const robotsRes = await request.get('/robots.txt');
    expect(robotsRes.status()).toBe(200);
    expect(await robotsRes.text()).toContain('Sitemap:');

    const sitemapRes = await request.get('/sitemap.xml');
    expect(sitemapRes.status()).toBe(200);
    expect(await sitemapRes.text()).toContain('<urlset');

    // Verificar que los enlaces reales de CV en ambos idiomas devuelvan un PDF válido
    await page.goto('/?lang=es');
    const cvEsHref = await page
      .getByRole('link', { name: 'Descargar CV' })
      .first()
      .getAttribute('href');
    expect(cvEsHref).toBeTruthy();
    const cvEsRes = await request.get(cvEsHref!);
    expect(cvEsRes.status()).toBe(200);
    expect(cvEsRes.headers()['content-type']).toContain('application/pdf');

    await page.goto('/?lang=en');
    const cvEnHref = await page
      .getByRole('link', { name: 'Download Resume' })
      .first()
      .getAttribute('href');
    expect(cvEnHref).toBeTruthy();
    const cvEnRes = await request.get(cvEnHref!);
    expect(cvEnRes.status()).toBe(200);
    expect(cvEnRes.headers()['content-type']).toContain('application/pdf');
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
