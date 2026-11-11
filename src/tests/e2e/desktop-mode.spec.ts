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
});
