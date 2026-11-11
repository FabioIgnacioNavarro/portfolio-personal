'use client';

import React, { useEffect, useRef } from 'react';

interface Star {
  // Coordenadas normalizadas (0..1) para conservar distribución uniforme al redimensionar
  nx: number;
  ny: number;
  radius: number;
  baseAlpha: number;
  twinkleAmp: number;
  twinkleSpeed: number;
  phase: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tailLength: number;
  age: number;
  duration: number;
}

interface NightGlow {
  baseX: number;
  baseY: number;
  sizeRatio: number;
  sprite: HTMLCanvasElement;
}

/**
 * Genera una textura radial suave una sola vez para nebulosas y halos estelares sin blur en tiempo real.
 */
function createGlowSprite(rgb: string, peakAlpha: number, size = 256): HTMLCanvasElement {
  const sprite = document.createElement('canvas');
  sprite.width = size;
  sprite.height = size;
  const sctx = sprite.getContext('2d');
  if (!sctx) return sprite;

  const half = size / 2;
  const grad = sctx.createRadialGradient(half, half, 0, half, half, half);
  grad.addColorStop(0, `rgba(${rgb}, ${peakAlpha})`);
  grad.addColorStop(0.4, `rgba(${rgb}, ${peakAlpha * 0.38})`);
  grad.addColorStop(0.75, `rgba(${rgb}, ${peakAlpha * 0.08})`);
  grad.addColorStop(1, `rgba(${rgb}, 0)`);

  sctx.fillStyle = grad;
  sctx.fillRect(0, 0, size, size);
  return sprite;
}

/**
 * Generador pseudoaleatorio determinístico para repartir estrellas de forma pareja sin agruparlas.
 */
function seededFraction(index: number, salt: number): number {
  const x = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

// Fondo nocturno estrellado HiDPI con titileo suave y estrellas fugaces esporádicas
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

    // Nebulosas muy tenues precalculadas para dar profundidad al cielo nocturno
    const glows: NightGlow[] = [
      {
        baseX: 0.22,
        baseY: 0.22,
        sizeRatio: 0.9,
        sprite: createGlowSprite('30, 64, 175', 0.22), // azul profundo
      },
      {
        baseX: 0.82,
        baseY: 0.68,
        sizeRatio: 0.85,
        sprite: createGlowSprite('67, 56, 202', 0.16), // índigo nocturno
      },
      {
        baseX: 0.5,
        baseY: 0.95,
        sizeRatio: 0.85,
        sprite: createGlowSprite('14, 116, 144', 0.12), // cian tenue en horizonte
      },
    ];

    const starColors = ['248, 250, 252', '186, 230, 253', '199, 210, 254'];
    const starGlowSprites = new Map(
      starColors.map((color) => [color, createGlowSprite(color, 0.52, 32)]),
    );
    const starCount = 135;
    const stars: Star[] = Array.from({ length: starCount }, (_, i) => {
      const layerRand = seededFraction(i, 1);
      const isForeground = layerRand > 0.9;
      const isMid = layerRand > 0.62 && !isForeground;

      return {
        nx: seededFraction(i, 2),
        ny: seededFraction(i, 3),
        radius: isForeground
          ? 1.35 + seededFraction(i, 4) * 0.5
          : isMid
            ? 0.95 + seededFraction(i, 4) * 0.35
            : 0.55 + seededFraction(i, 4) * 0.35,
        baseAlpha: isForeground
          ? 0.68 + seededFraction(i, 5) * 0.25
          : isMid
            ? 0.4 + seededFraction(i, 5) * 0.25
            : 0.18 + seededFraction(i, 5) * 0.2,
        twinkleAmp: 0.18 + seededFraction(i, 6) * 0.24,
        twinkleSpeed: 0.0008 + seededFraction(i, 7) * 0.0014,
        phase: seededFraction(i, 8) * Math.PI * 2,
        color: starColors[i % starColors.length],
      };
    });

    const shootingStars: ShootingStar[] = [];
    // La primera estrella fugaz aparece poco después de cargar (~1.8s) y luego pasan de manera esporádica
    let nextMeteorCooldown = 1.8;

    const spawnShootingStar = () => {
      const fromRight = Math.random() > 0.42;
      // En pantallas anchas alternamos apariciones entre los bordes despejados y la banda superior
      const startX = fromRight
        ? width * (0.62 + Math.random() * 0.35)
        : width * (0.03 + Math.random() * 0.36);
      const startY = height * (0.05 + Math.random() * 0.38);

      // Ángulo natural descendente entre 22° y 36°
      const angleDeg = 22 + Math.random() * 14;
      const angleRad = (angleDeg * Math.PI) / 180;
      const speed = 440 + Math.random() * 180;

      shootingStars.push({
        x: startX,
        y: startY,
        vx: (fromRight ? -1 : 1) * Math.cos(angleRad) * speed,
        vy: Math.sin(angleRad) * speed,
        tailLength: 145 + Math.random() * 75,
        age: 0,
        duration: 1.2 + Math.random() * 0.45,
      });
    };

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
      for (const glow of glows) {
        const size = baseSpan * glow.sizeRatio;
        ctx.drawImage(
          glow.sprite,
          glow.baseX * width - size / 2,
          glow.baseY * height - size / 2,
          size,
          size,
        );
      }

      // Estrellas con titileo suave y halo radial suave en las más brillantes
      for (const star of stars) {
        const sx = star.nx * width;
        const sy = star.ny * height;
        const twinkle = Math.sin(timeMs * star.twinkleSpeed + star.phase);
        const alpha = Math.max(0.08, Math.min(1, star.baseAlpha + twinkle * star.twinkleAmp));

        if (star.radius >= 1.35) {
          const haloSprite = starGlowSprites.get(star.color);
          if (haloSprite) {
            const haloRadius = star.radius * 4.2;
            ctx.globalAlpha = alpha * 0.55;
            ctx.drawImage(
              haloSprite,
              sx - haloRadius,
              sy - haloRadius,
              haloRadius * 2,
              haloRadius * 2,
            );
            ctx.globalAlpha = 1;
          }
        }

        ctx.fillStyle = `rgba(${star.color}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(sx, sy, star.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Estrellas fugaces esporádicas con estela cónica afilada y destello radial real
      for (const meteor of shootingStars) {
        const progress = meteor.age / meteor.duration;
        const fadeIn = Math.min(1, progress / 0.16);
        const fadeOut = Math.max(0, 1 - Math.max(0, progress - 0.55) / 0.45);
        const opacity = fadeIn * fadeOut;
        if (opacity <= 0.01) continue;

        const mag = Math.hypot(meteor.vx, meteor.vy);
        const ux = meteor.vx / mag;
        const uy = meteor.vy / mag;
        const px = -uy;
        const py = ux;
        const currentTail = meteor.tailLength * Math.min(1, progress * 2.3);
        const tailX = meteor.x - ux * currentTail;
        const tailY = meteor.y - uy * currentTail;
        const headHalfWidth = 1.65;

        const tailGrad = ctx.createLinearGradient(tailX, tailY, meteor.x, meteor.y);
        tailGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
        tailGrad.addColorStop(0.55, `rgba(125, 211, 252, ${opacity * 0.45})`);
        tailGrad.addColorStop(1, `rgba(248, 250, 252, ${opacity * 0.95})`);

        ctx.fillStyle = tailGrad;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(meteor.x + px * headHalfWidth, meteor.y + py * headHalfWidth);
        ctx.lineTo(meteor.x - px * headHalfWidth, meteor.y - py * headHalfWidth);
        ctx.closePath();
        ctx.fill();

        // Resplandor radial suave alrededor de la punta del meteoro
        const headGlow = ctx.createRadialGradient(meteor.x, meteor.y, 0, meteor.x, meteor.y, 7.5);
        headGlow.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.95})`);
        headGlow.addColorStop(0.35, `rgba(186, 230, 253, ${opacity * 0.45})`);
        headGlow.addColorStop(1, 'rgba(56, 189, 248, 0)');

        ctx.fillStyle = headGlow;
        ctx.beginPath();
        ctx.arc(meteor.x, meteor.y, 7.5, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const stepSimulation = (dtSec: number) => {
      // Deriva estelar casi imperceptible para aportar sensación viva sin distraer
      for (const star of stars) {
        star.nx += 0.0012 * dtSec;
        if (star.nx > 1) star.nx -= 1;
      }

      nextMeteorCooldown -= dtSec;
      if (nextMeteorCooldown <= 0) {
        if (shootingStars.length === 0) {
          spawnShootingStar();
        }
        nextMeteorCooldown = 4.5 + Math.random() * 4.5; // cada ~4.5 a 9 segundos
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const meteor = shootingStars[i];
        meteor.x += meteor.vx * dtSec;
        meteor.y += meteor.vy * dtSec;
        meteor.age += dtSec;

        if (meteor.age >= meteor.duration) {
          shootingStars.splice(i, 1);
        }
      }
    };

    resize();
    drawFrame(0);

    let rafId = 0;
    let lastDraw = performance.now();
    const frameInterval = 1000 / 30; // 30 FPS livianos y constantes

    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick);
      if (document.hidden || motionQuery.matches) return;

      const elapsed = now - lastDraw;
      if (elapsed < frameInterval) return;

      lastDraw = now - (elapsed % frameInterval);
      const dtSec = Math.min(elapsed / 1000, 0.1);
      stepSimulation(dtSec);
      drawFrame(now);
    };

    const startOrStop = () => {
      cancelAnimationFrame(rafId);
      shootingStars.length = 0;
      drawFrame(performance.now());
      if (!motionQuery.matches) {
        lastDraw = performance.now();
        rafId = requestAnimationFrame(tick);
      }
    };

    const handleVisibility = () => {
      if (!document.hidden) {
        lastDraw = performance.now();
      }
    };

    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', handleVisibility);
    motionQuery.addEventListener('change', startOrStop);
    startOrStop();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
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
