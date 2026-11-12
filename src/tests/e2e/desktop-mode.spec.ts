import { test, expect } from '@playwright/test';

test.describe('Desktop Mode (PC Navegable & Window Manager)', () => {
  test('switches to Desktop Mode and renders desktop icons and taskbar', async ({ page }) => {
    await page.goto('/?mode=desktop&lang=es');
    await expect(page.locator('[data-hydrated="true"]')).toBeVisible();

    // Verificar que la barra de tareas esté presente
    const taskbar = page.locator('nav[aria-label*="Barra de tareas"]');
    await expect(taskbar).toBeVisible();

    // Verificar el botón Inicio
    const startBtn = taskbar.locator('button[aria-label*="menú de inicio"]');
    await expect(startBtn).toBeVisible();

    // Verificar los íconos del escritorio mediante su rol accesible
    await expect(page.getByRole('button', { name: 'Sobre mí', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Proyectos', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Terminal', exact: true })).toBeVisible();
  });

  test('opens projects folder and launches case study detail window', async ({ page }) => {
    await page.goto('/?mode=desktop&lang=es');
    await expect(page.locator('[data-hydrated="true"]')).toBeVisible();

    // Abrir el ícono de escritorio 'Proyectos'
    const projectsBtn = page.getByRole('button', { name: 'Proyectos', exact: true });
    await expect(projectsBtn).toBeVisible();
    await projectsBtn.click();
    await projectsBtn.press('Enter');

    // Verificar que la ventana del explorador de proyectos esté abierta
    const projectsWindow = page.locator('div[role="dialog"][aria-label*="Proyectos"]');
    await expect(projectsWindow).toBeVisible();
    await expect(projectsWindow).toContainText('case-study.md');

    // Hacer clic en 'Abrir caso' para abrir la ventana de detalle
    const openCaseBtn = projectsWindow
      .locator('button:has-text("Abrir caso"), button:has-text("Open")')
      .first();
    await expect(openCaseBtn).toBeVisible();
    await openCaseBtn.click();

    // Verificar que la ventana de detalle del proyecto esté abierta
    const detailWindow = page.locator('div[role="dialog"][aria-label*="Detalle de Proyecto"]');
    await expect(detailWindow).toBeVisible();
    await expect(detailWindow).toContainText('~/portfolio/projects/');
    await expect(detailWindow).toContainText('.case-study.md');
    await expect(detailWindow).toContainText(/Problema|Problem/);
  });

  test('interacts with the simulated terminal application', async ({ page }) => {
    await page.goto('/?mode=desktop&lang=es');
    await expect(page.locator('[data-hydrated="true"]')).toBeVisible();

    // Abrir la Terminal desde el ícono del escritorio
    const terminalBtn = page.getByRole('button', { name: 'Terminal', exact: true });
    await expect(terminalBtn).toBeVisible();
    await terminalBtn.click();
    await terminalBtn.press('Enter');

    // La ventana de Terminal debería estar abierta
    const terminalWindow = page.locator('div[role="dialog"][aria-label*="Terminal"]');
    await expect(terminalWindow).toBeVisible();

    // Ingresar el comando 'skills'
    const terminalInput = terminalWindow.locator('input[aria-label*="terminal"]');
    await expect(terminalInput).toBeVisible();
    await terminalInput.fill('skills');
    await terminalInput.press('Enter');

    // Verificar que la salida contenga tecnologías o backend
    await expect(terminalWindow).toContainText(/Backend|TypeScript|Python/);
  });

  test('minimizes and restores window via taskbar tabs', async ({ page }) => {
    await page.goto('/?mode=desktop&lang=es');
    await expect(page.locator('[data-hydrated="true"]')).toBeVisible();

    // Asegurar que la ventana Sobre mí esté abierta
    const aboutBtn = page.getByRole('button', { name: 'Sobre mí', exact: true });
    await aboutBtn.click();
    await aboutBtn.press('Enter');

    const aboutWindow = page.locator('div[role="dialog"][aria-label*="Sobre mí"]');
    await expect(aboutWindow).toBeVisible();

    // Buscar la pestaña en la barra de tareas
    const aboutTab = page.locator('nav[aria-label*="Barra de tareas"] button:has-text("Sobre mí")');
    await expect(aboutTab).toBeVisible();

    // Al hacer clic en la pestaña activa se minimiza la ventana
    await aboutTab.click();
    await expect(aboutWindow).not.toBeVisible();

    // Al hacer clic en la pestaña minimizada se restaura la ventana
    await aboutTab.click();
    await expect(aboutWindow).toBeVisible();
  });

  test('switches back to Simple Mode from taskbar', async ({ page }) => {
    await page.goto('/?mode=desktop&lang=es');
    await expect(page.locator('[data-hydrated="true"]')).toBeVisible();

    // Hacer clic en el botón 'Simple' en la barra de tareas
    const simpleModeBtn = page.locator(
      'nav[aria-label*="Barra de tareas"] button[aria-label*="Modo Simple"]',
    );
    await expect(simpleModeBtn).toBeVisible();
    await simpleModeBtn.click();

    // Verificar que se renderice el Modo Simple (encabezado principal y sección hero)
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('#main-content')).toBeVisible();
  });

  test('closes StartMenu and active windows using Escape key', async ({ page }) => {
    await page.goto('/?mode=desktop&lang=es');
    await expect(page.locator('[data-hydrated="true"]')).toBeVisible();

    // Abrir el Menú Inicio y cerrarlo con Escape
    const startBtn = page.locator(
      'nav[aria-label*="Barra de tareas"] button[aria-label*="inicio"]',
    );
    await startBtn.click();
    await expect(page.locator('text=Aplicaciones del Sistema')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.locator('text=Aplicaciones del Sistema')).not.toBeVisible();

    // Abrir/enfocar la ventana Sobre mí (en móvil arranca cerrada por diseño) y cerrarla con Escape
    const aboutBtn = page.getByRole('button', { name: 'Sobre mí', exact: true });
    await aboutBtn.click();
    await aboutBtn.press('Enter');

    const aboutWindow = page.locator('div[role="dialog"][aria-label*="Sobre mí"]');
    await expect(aboutWindow).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(aboutWindow).not.toBeVisible();
  });

  test('opens trash bin from bottom-right corner and reads easter_egg.txt', async ({ page }) => {
    await page.goto('/?mode=desktop&lang=es');
    await expect(page.locator('[data-hydrated="true"]')).toBeVisible();

    const trashBtn = page.locator('button[aria-label="Papelera"]');
    await expect(trashBtn).toBeVisible();

    const isBottomRight = await trashBtn.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return rect.right > window.innerWidth * 0.6 && rect.bottom > window.innerHeight * 0.6;
    });
    expect(isBottomRight).toBe(true);

    const trashWindow = page.locator('div[role="dialog"][aria-label*="Papelera"]');
    await trashBtn.click();
    if (!(await trashWindow.isVisible())) {
      await trashBtn.press('Enter');
    }

    await expect(trashWindow).toBeVisible();
    await expect(trashWindow).toContainText('easter_egg.txt');

    const openFileBtn = trashWindow.getByRole('button', { name: 'Abrir', exact: true });
    await openFileBtn.click();
    await expect(trashWindow).toContainText(
      'Bueno no se que poner acá, pero me gustaría mostrar algo interesante o curioso',
    );

    // Validar traducción al inglés de easter_egg.txt en Papelera
    await page.goto('/?mode=desktop&lang=en');
    await expect(page.locator('[data-hydrated="true"]')).toBeVisible();

    const trashBtnEn = page.locator('button[aria-label="Trash"]');
    await trashBtnEn.click();
    const trashWindowEn = page.locator('div[role="dialog"][aria-label*="Trash"]');
    if (!(await trashWindowEn.isVisible())) {
      await trashBtnEn.press('Enter');
    }
    await expect(trashWindowEn).toBeVisible();
    await expect(trashWindowEn).toContainText('~/Trash/');
    await trashWindowEn.getByRole('button', { name: 'Open', exact: true }).click();
    await expect(trashWindowEn).toContainText('~/Trash/easter_egg.txt');
    await expect(trashWindowEn).toContainText("Well, I'm not sure what to put here");
  });

  test('renders consistent virtual path bars across all desktop application windows', async ({
    page,
  }) => {
    await page.goto('/?mode=desktop&lang=es');
    await expect(page.locator('[data-hydrated="true"]')).toBeVisible();

    const expectedWindows = [
      { iconName: 'Sobre mí', dialogMatch: 'Sobre mí', path: '~/portfolio/about.md' },
      { iconName: 'Proyectos', dialogMatch: 'Proyectos', path: '~/portfolio/projects/' },
      { iconName: 'Experiencia', dialogMatch: 'Experiencia', path: '~/portfolio/experience/' },
      { iconName: 'Habilidades', dialogMatch: 'Habilidades', path: '~/portfolio/skills/' },
      { iconName: 'Educación', dialogMatch: 'Educación', path: '~/portfolio/education/' },
      { iconName: 'Contacto', dialogMatch: 'Contacto', path: '~/portfolio/contact.vcf' },
      { iconName: 'Terminal', dialogMatch: 'Terminal', path: '~/portfolio/' },
      { iconName: 'Papelera', dialogMatch: 'Papelera', path: '~/Papelera/' },
    ];

    for (const item of expectedWindows) {
      const iconBtn = page.getByRole('button', { name: item.iconName, exact: true });
      await iconBtn.click();
      const dialog = page.locator(`div[role="dialog"][aria-label*="${item.dialogMatch}"]`);
      if (!(await dialog.isVisible())) {
        await iconBtn.press('Enter');
      }
      await expect(dialog).toBeVisible();
      await expect(dialog).toContainText(item.path);
      await dialog.locator('button[aria-label*="Cerrar"], button[aria-label*="Close"]').click();
      await expect(dialog).not.toBeVisible();
    }
  });

  test('renders mobile desktop windows fullscreen with single-tap launch and clamps tablet windows', async ({
    page,
  }) => {
    // 1. Teléfono (< 768px): íconos en cuadrícula sin superposición y ventanas fullscreen sobre la barra de tareas
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/?mode=desktop&lang=es');
    await expect(page.locator('[data-hydrated="true"]')).toBeVisible();

    const desktopHasNoOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    );
    expect(desktopHasNoOverflow).toBe(true);

    // Abrir Proyectos con un solo toque y luego Detalle de Proyecto (antes excedía 390px)
    await page.getByRole('button', { name: 'Proyectos', exact: true }).click();
    const projectsWindow = page.locator('div[role="dialog"][aria-label*="Proyectos"]');
    await expect(projectsWindow).toBeVisible();

    const projectsFullscreen = await projectsWindow.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return (
        Math.abs(r.left) <= 1 &&
        Math.abs(r.top) <= 1 &&
        Math.abs(r.right - window.innerWidth) <= 1 &&
        r.bottom <= window.innerHeight - 47
      );
    });
    expect(projectsFullscreen).toBe(true);

    // En móvil el botón Maximizar no debe renderizarse y Cerrar debe ser accesible dentro del viewport
    await expect(
      projectsWindow.locator('button[aria-label*="Maximizar"], button[aria-label*="Restaurar"]'),
    ).toHaveCount(0);

    await projectsWindow
      .locator('button:has-text("Abrir caso"), button:has-text("Open")')
      .first()
      .click();
    const detailWindow = page.locator('div[role="dialog"][aria-label*="Detalle de Proyecto"]');
    await expect(detailWindow).toBeVisible();
    const detailFits = await detailWindow.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return (
        r.left >= 0 &&
        r.right <= window.innerWidth &&
        document.documentElement.scrollWidth <= window.innerWidth
      );
    });
    expect(detailFits).toBe(true);
    await detailWindow.locator('button[aria-label*="Cerrar"]').click();

    // 2. Tablet (768px): ventanas flotantes clamped dentro del ancho visible
    await page.setViewportSize({ width: 768, height: 900 });
    await page.goto('/?mode=desktop&lang=es');
    await expect(page.locator('[data-hydrated="true"]')).toBeVisible();

    const tabletAbout = page.locator('div[role="dialog"][aria-label*="Sobre mí"]');
    await expect(tabletAbout).toBeVisible();
    await tabletAbout.locator('button[aria-label*="Cerrar"]').click();
    await expect(tabletAbout).not.toBeVisible();

    await page.getByRole('button', { name: 'Terminal', exact: true }).dblclick();
    const terminalWin = page.locator('div[role="dialog"][aria-label*="Terminal"]');
    await expect(terminalWin).toBeVisible();
    const tabletFits = await terminalWin.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return r.left >= 0 && r.right <= window.innerWidth;
    });
    expect(tabletFits).toBe(true);
  });
});
