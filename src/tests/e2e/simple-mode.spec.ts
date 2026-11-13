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

    // Verificar fondo ambiental animado HiDPI en Modo Simple (canvas activo)
    const simpleBg = page.getByTestId('simple-background');
    await expect(simpleBg).toBeVisible();
    const canvasReady = await simpleBg
      .locator('canvas')
      .evaluate((canvas: HTMLCanvasElement) => canvas.width > 0 && canvas.height > 0);
    expect(canvasReady).toBe(true);

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
      await expect(page.getByRole('heading', { name: 'Work Experience' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Featured Projects' })).toBeVisible();
    } else {
      await expect(page.locator('html')).toHaveAttribute('lang', 'es');
      await expect(page.getByRole('heading', { name: 'Experiencia Laboral' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Proyectos Destacados' })).toBeVisible();
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

    // Verificar que el modal esté abierto, centrado y quepa completo en pantalla
    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText(/Problema|Problem/);
    const modalFitsViewport = await modal.locator('.animate-modal-open').evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.left >= 0 &&
        rect.right <= window.innerWidth
      );
    });
    expect(modalFitsViewport).toBe(true);

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

  test('displays updated portfolio repo link, centered timeline nodes, and bilingual updates', async ({
    page,
  }) => {
    // Validar en Español
    await page.goto('/?lang=es');
    await expect(page.locator('[data-hydrated="true"]')).toBeVisible();

    const headerRepoLink = page.locator(
      'header a[href="https://github.com/FabioIgnacioNavarro/portfolio-personal"]',
    );
    await expect(headerRepoLink).toBeVisible();

    // Verificar alineación horizontal entre línea de tiempo y nodos circulares en Experiencia
    const timelineAligned = await page
      .locator('#experience .relative.pl-9')
      .first()
      .evaluate((node) => {
        const parent = node.parentElement;
        const circle = node.querySelector('span.rounded-full');
        if (!parent || !circle) return false;
        const beforeStyle = window.getComputedStyle(parent, '::before');
        const parentRect = parent.getBoundingClientRect();
        const beforeLeft = parseFloat(beforeStyle.left || '0');
        const lineCenterX = parentRect.left + beforeLeft;
        const circleRect = circle.getBoundingClientRect();
        const circleCenterX = circleRect.left + circleRect.width / 2;
        return Math.abs(lineCenterX - circleCenterX) <= 1.5;
      });
    expect(timelineAligned).toBe(true);

    // Experiencia, Proyectos, Habilidades IA, Educación y Certificación B2 en español
    await expect(page.locator('#about')).not.toContainText('Junior');
    await expect(page.locator('#about')).not.toContainText('sector público');
    await expect(page.locator('#about')).toContainText('1 año de experiencia');
    await expect(page.locator('#about ul li')).toHaveCount(7);
    await expect(page.locator('#experience')).toContainText('Responsabilidades:');
    await expect(page.locator('#experience')).not.toContainText('Logros:');
    await expect(page.locator('#experience')).toContainText('Traducción y localización de juegos');
    await expect(page.locator('#experience')).toContainText('Proyectos Independientes');
    await expect(page.locator('#experience')).not.toContainText('Especialista');
    await expect(page.locator('#projects')).toContainText('Proyecto académico (UTN FRRe)');
    await expect(page.locator('#projects')).toContainText('Backend y decisiones de arquitectura');
    await expect(page.locator('#projects')).toContainText('Desarrollador full stack');
    await expect(page.locator('#skills')).toContainText('Manejo de LLMs y Agentes de IA');
    await expect(page.locator('#skills')).toContainText('Uso y Diseño de AI Skills');
    await expect(page.locator('#education')).toContainText('luego de dos años');
    await expect(page.locator('#education')).toContainText('En progreso');
    const credentialLinksEs = page.locator('#education a', { hasText: 'Mostrar credencial' });
    await expect(credentialLinksEs).toHaveCount(1);
    await expect(credentialLinksEs.first()).toHaveAttribute(
      'href',
      'https://drive.google.com/file/d/1g0upewkTFriiEQWD02LJR_cb01RyVqjv/view',
    );

    // Validar en Inglés
    await page.goto('/?lang=en');
    await expect(page.locator('[data-hydrated="true"]')).toBeVisible();

    await expect(page.locator('#about')).not.toContainText('Junior');
    await expect(page.locator('#about')).not.toContainText('public sector');
    await expect(page.locator('#about')).toContainText('1 Year of Experience');
    await expect(page.locator('#experience')).toContainText('Responsibilities:');
    await expect(page.locator('#experience')).toContainText('Game Translation & Localization');
    await expect(page.locator('#experience')).toContainText('Independent Projects');
    await expect(page.locator('#projects')).toContainText('Academic project (UTN FRRe)');
    await expect(page.locator('#projects')).toContainText('Backend & Architectural Decisions');
    await expect(page.locator('#projects')).toContainText('Full Stack Developer');
    await expect(page.locator('#skills')).toContainText('LLM & AI Agent Management');
    await expect(page.locator('#skills')).toContainText('AI Skills Usage & Design');
    await expect(page.locator('#education')).toContainText('after two years');
    await expect(page.locator('#education')).toContainText('In progress');
    const credentialLinksEn = page.locator('#education a', { hasText: 'Show credential' });
    await expect(credentialLinksEn).toHaveCount(1);
  });
});
