export const MOBILE_BREAKPOINT_PX = 768;
export const TASKBAR_HEIGHT_PX = 48;

export interface WindowBounds {
  position: { x: number; y: number };
  size: { width: number; height: number };
}

// Determina si el ancho actual corresponde a vista móvil de escritorio a pantalla completa
export function isMobileViewportWidth(width: number): boolean {
  return width < MOBILE_BREAKPOINT_PX;
}

// Ajusta ventanas flotantes en tablet o desktop para evitar desbordamientos fuera del viewport
export function clampFloatingWindow(
  bounds: WindowBounds,
  viewportWidth: number,
  viewportHeight: number,
  padding = 12,
): WindowBounds {
  const availableWidth = Math.max(280, viewportWidth - padding * 2);
  const availableHeight = Math.max(220, viewportHeight - TASKBAR_HEIGHT_PX - padding * 2);

  const width = Math.min(bounds.size.width, availableWidth);
  const height = Math.min(bounds.size.height, availableHeight);

  const maxX = Math.max(0, viewportWidth - width - padding);
  const maxY = Math.max(0, viewportHeight - TASKBAR_HEIGHT_PX - height - padding);

  return {
    size: { width, height },
    position: {
      x: Math.min(Math.max(padding, bounds.position.x), maxX),
      y: Math.min(Math.max(padding, bounds.position.y), maxY),
    },
  };
}
