'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
}

interface GlowOrb {
  baseX: number;
  baseY: number;
  ampX: number;
  ampY: number;
  speedX: number;
  speedY: number;
  phase: number;
  sizeRatio: number;
  sprite: HTMLCanvasElement;
}

/**
 * Genera una textura radial suave una sola vez para evitar filtros blur en tiempo real.
 */
function createGlowSprite(rgb: string, peakAlpha: number): HTMLCanvasElement {
  const size = 256;
  const sprite = document.createElement('canvas');
  sprite.width = size;
  sprite.height = size;
  const sctx = sprite.getContext('2d');
  if (!sctx) return sprite;

  const half = size / 2;
  const grad = sctx.createRadialGradient(half, half, 0, half, half, half);
  grad.addColorStop(0, `rgba(${rgb}, ${peakAlpha})`);
  grad.addColorStop(0.45, `rgba(${rgb}, ${peakAlpha * 0.45})`);
  grad.addColorStop(0.75, `rgba(${rgb}, ${peakAlpha * 0.1})`);
  grad.addColorStop(1, `rgba(${rgb}, 0)`);

  sctx.fillStyle = grad;
  sctx.fillRect(0, 0, size, size);
  return sprite;
}

// Fondo animado nativo HiDPI en canvas: movimiento calmo, alta nitidez y mínimo costo GPU
export function SimpleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Texturas precalculadas para brillos ambientales sin usar ctx.filter
    const orbs: GlowOrb[] = [
      {
        baseX: 0.2,
        baseY: 0.25,
        ampX: 0.12,
        ampY: 0.1,
        speedX: 0.00018,
        speedY: 0.00014,
        phase: 0.2,
        sizeRatio: 0.85,
        sprite: createGlowSprite('59, 130, 246', 0.26), // azul técnico
      },
      {
        baseX: 0.8,
        baseY: 0.35,
        ampX: 0.14,
        ampY: 0.11,
        speedX: 0.00015,
        speedY: 0.00019,
        phase: 2.1,
        sizeRatio: 0.8,
        sprite: createGlowSprite('99, 102, 241', 0.22), // índigo
      },
      {
        baseX: 0.48,
        baseY: 0.82,
        ampX: 0.16,
        ampY: 0.09,
        speedX: 0.00016,
        speedY: 0.00012,
        phase: 4.3,
        sizeRatio: 0.78,
        sprite: createGlowSprite('14, 165, 233', 0.18), // cian
      },
    ];

    const palette = ['125, 211, 252', '96, 165, 250', '165, 180, 252'];
    const particleCount = 42;
    const particles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
      x: ((i * 0.61803398875) % 1) * width,
      y: (((i * 0.38196601125 + 0.17) * 7) % 1) * height,
      vx: ((i % 5) - 2) * 0.06,
      vy: -(0.14 + (i % 4) * 0.06),
      radius: 1 + (i % 3) * 0.55,
      alpha: 0.28 + (i % 4) * 0.14,
      color: palette[i % palette.length],
    }));

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawFrame = (timeMs: number) => {
      // Fondo base slate-950 (#020617)
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      const baseSpan = Math.max(width, height);

      // Auroras ambientales lentas compuestas mediante sprites suaves
      for (const orb of orbs) {
        const cx = (orb.baseX + Math.sin(timeMs * orb.speedX + orb.phase) * orb.ampX) * width;
        const cy = (orb.baseY + Math.cos(timeMs * orb.speedY + orb.phase) * orb.ampY) * height;
        const size = baseSpan * orb.sizeRatio;
        ctx.drawImage(orb.sprite, cx - size / 2, cy - size / 2, size, size);
      }

      // Partículas HiDPI nítidas con deriva suave
      for (const p of particles) {
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const updateParticles = (dtRatio: number) => {
      for (const p of particles) {
        p.x += p.vx * dtRatio;
        p.y += p.vy * dtRatio;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = (p.x + width * 0.17) % width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
      }
    };

    resize();
    drawFrame(0);

    let rafId = 0;
    let lastDraw = performance.now();
    const frameInterval = 1000 / 30; // 30 FPS estables: fluido a la vista y consumo mínimo

    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick);
      if (document.hidden || motionQuery.matches) return;

      const elapsed = now - lastDraw;
      if (elapsed < frameInterval) return;

      lastDraw = now - (elapsed % frameInterval);
      const dtRatio = Math.min(elapsed / 16.67, 3);
      updateParticles(dtRatio);
      drawFrame(now);
    };

    const startOrStop = () => {
      cancelAnimationFrame(rafId);
      drawFrame(performance.now());
      if (!motionQuery.matches) {
        lastDraw = performance.now();
        rafId = requestAnimationFrame(tick);
      }
    };

    window.addEventListener('resize', resize);
    motionQuery.addEventListener('change', startOrStop);
    startOrStop();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      motionQuery.removeEventListener('change', startOrStop);
    };
  }, []);

  return (
    <div
      data-testid="simple-background"
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none bg-slate-950"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
