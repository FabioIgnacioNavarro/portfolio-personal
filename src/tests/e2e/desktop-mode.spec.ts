import { test, expect } from '@playwright/test';

test.describe('Desktop Mode (PC Navegable & Window Manager)', () => {
  test('switches to Desktop Mode and renders desktop icons and taskbar', async ({ page }) => {
    await page.goto('/?mode=desktop&lang=es');
    await expect(page.locator('[data-hydrated="true"]')).toBeVisible();

    // Verify taskbar is present
    const taskbar = page.locator('nav[aria-label*="Barra de tareas"]');
    await expect(taskbar).toBeVisible();

    // Verify Start button
    const startBtn = taskbar.locator('button[aria-label*="menú de inicio"]');
    await expect(startBtn).toBeVisible();

    // Verify Desktop icons via accessible role
    await expect(page.getByRole('button', { name: 'Sobre mí', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Proyectos', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Terminal', exact: true })).toBeVisible();
  });

  test('opens projects folder and launches case study detail window', async ({ page }) => {
    await page.goto('/?mode=desktop&lang=es');
    await expect(page.locator('[data-hydrated="true"]')).toBeVisible();

    // Open 'Proyectos' desktop icon
    const projectsBtn = page.getByRole('button', { name: 'Proyectos', exact: true });
    await expect(projectsBtn).toBeVisible();
    await projectsBtn.click();
    await projectsBtn.press('Enter');

    // Verify Projects Explorer Window is open
    const projectsWindow = page.locator('div[role="dialog"][aria-label*="Proyectos"]');
    await expect(projectsWindow).toBeVisible();
    await expect(projectsWindow).toContainText('case-study.md');

    // Click 'Abrir caso' to open detail window
    const openCaseBtn = projectsWindow
      .locator('button:has-text("Abrir caso"), button:has-text("Open")')
      .first();
    await expect(openCaseBtn).toBeVisible();
    await openCaseBtn.click();

    // Verify Project Detail Window is open
    const detailWindow = page.locator('div[role="dialog"][aria-label*="Detalle de Proyecto"]');
    await expect(detailWindow).toBeVisible();
    await expect(detailWindow).toContainText(/Problema|Problem/);
  });

  test('interacts with the simulated terminal application', async ({ page }) => {
    await page.goto('/?mode=desktop&lang=es');
    await expect(page.locator('[data-hydrated="true"]')).toBeVisible();

    // Open Terminal via Desktop icon
    const terminalBtn = page.getByRole('button', { name: 'Terminal', exact: true });
    await expect(terminalBtn).toBeVisible();
    await terminalBtn.click();
    await terminalBtn.press('Enter');

    // Terminal window should be open
    const terminalWindow = page.locator('div[role="dialog"][aria-label*="Terminal"]');
    await expect(terminalWindow).toBeVisible();

    // Input command 'skills'
    const terminalInput = terminalWindow.locator('input[aria-label*="terminal"]');
    await expect(terminalInput).toBeVisible();
    await terminalInput.fill('skills');
    await terminalInput.press('Enter');

    // Check output contains backend or technologies
    await expect(terminalWindow).toContainText(/Backend|TypeScript|Python/);
  });

  test('minimizes and restores window via taskbar tabs', async ({ page }) => {
    await page.goto('/?mode=desktop&lang=es');
    await expect(page.locator('[data-hydrated="true"]')).toBeVisible();

    // Ensure About window is open
    const aboutBtn = page.getByRole('button', { name: 'Sobre mí', exact: true });
    await aboutBtn.click();
    await aboutBtn.press('Enter');

    const aboutWindow = page.locator('div[role="dialog"][aria-label*="Sobre mí"]');
    await expect(aboutWindow).toBeVisible();

    // Find tab on taskbar
    const aboutTab = page.locator('nav[aria-label*="Barra de tareas"] button:has-text("Sobre mí")');
    await expect(aboutTab).toBeVisible();

    // Clicking active tab minimizes window
    await aboutTab.click();
    await expect(aboutWindow).not.toBeVisible();

    // Clicking minimized tab restores window
    await aboutTab.click();
    await expect(aboutWindow).toBeVisible();
  });

  test('switches back to Simple Mode from taskbar', async ({ page }) => {
    await page.goto('/?mode=desktop&lang=es');
    await expect(page.locator('[data-hydrated="true"]')).toBeVisible();

    // Click 'Simple' button on taskbar
    const simpleModeBtn = page.locator(
      'nav[aria-label*="Barra de tareas"] button[aria-label*="Modo Simple"]',
    );
    await expect(simpleModeBtn).toBeVisible();
    await simpleModeBtn.click();

    // Verify Simple Mode is rendered (main header and hero section)
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('#main-content')).toBeVisible();
  });
});
