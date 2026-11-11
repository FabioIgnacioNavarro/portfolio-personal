'use client';

import React from 'react';

// Fondo ambiental animado liviano en WebP (sin filtros blur en tiempo real para mantener 60fps al scrollear)
export function SimpleBackground() {
  return (
    <div
      data-testid="simple-background"
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none bg-slate-950"
    >
      <picture className="block w-full h-full">
        {/* Respeta preferencia de movimiento reducido sirviendo la versión estática */}
        <source srcSet="/images/simple-bg-static.webp" media="(prefers-reduced-motion: reduce)" />
        <img
          src="/images/simple-bg.webp"
          alt=""
          decoding="async"
          className="w-full h-full object-cover opacity-85"
        />
      </picture>
    </div>
  );
}
