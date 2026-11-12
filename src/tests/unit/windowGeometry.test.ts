import { describe, it, expect } from 'vitest';
import {
  MOBILE_BREAKPOINT_PX,
  TASKBAR_HEIGHT_PX,
  isMobileViewportWidth,
  clampFloatingWindow,
} from '@/lib/windowGeometry';

describe('windowGeometry', () => {
  it('detects mobile viewport below 768px', () => {
    expect(isMobileViewportWidth(390)).toBe(true);
    expect(isMobileViewportWidth(MOBILE_BREAKPOINT_PX - 1)).toBe(true);
    expect(isMobileViewportWidth(MOBILE_BREAKPOINT_PX)).toBe(false);
    expect(isMobileViewportWidth(1280)).toBe(false);
  });

  it('clamps oversized or off-screen floating windows on tablet viewports', () => {
    const result = clampFloatingWindow(
      { position: { x: 200, y: 120 }, size: { width: 700, height: 500 } },
      768,
      700,
    );

    expect(result.size.width).toBeLessThanOrEqual(768);
    expect(result.size.height).toBeLessThanOrEqual(700 - TASKBAR_HEIGHT_PX);
    expect(result.position.x + result.size.width).toBeLessThanOrEqual(768);
    expect(result.position.y + result.size.height).toBeLessThanOrEqual(700 - TASKBAR_HEIGHT_PX);
  });

  it('preserves window geometry cleanly when it already fits within desktop viewport', () => {
    const input = { position: { x: 120, y: 70 }, size: { width: 640, height: 420 } };
    const result = clampFloatingWindow(input, 1280, 800);
    expect(result).toEqual(input);
  });
});
