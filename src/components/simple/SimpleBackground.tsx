'use client';

import React from 'react';

// Fondo ambiental animado de bajo costo para Modo Simple (usa solo transform y opacity en GPU)
export function SimpleBackground() {
  return (
    <div
      data-testid="simple-background"
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none"
    >
      {/* Grilla técnica sutil que aporta textura sin competir con el texto */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: 'radial-gradient(rgba(148, 163, 184, 0.16) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse 85% 75% at 50% 45%, black 35%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 85% 75% at 50% 45%, black 35%, transparent 100%)',
        }}
      />

      {/* Brillo principal superior izquierdo en azul técnico (sin recorte circular para evitar bordes duros) */}
      <div
        className="animate-aurora-1 absolute -top-[14%] -left-[6%] h-[42rem] w-[42rem] blur-3xl"
        style={{
          background:
            'radial-gradient(circle at center, rgba(59, 130, 246, 0.34) 0%, rgba(37, 99, 235, 0.16) 34%, rgba(29, 78, 216, 0.04) 52%, transparent 66%)',
        }}
      />

      {/* Contrapunto medio derecho en índigo/violeta */}
      <div
        className="animate-aurora-2 absolute top-[12%] -right-[6%] h-[40rem] w-[40rem] blur-3xl"
        style={{
          background:
            'radial-gradient(circle at center, rgba(99, 102, 241, 0.28) 0%, rgba(124, 58, 237, 0.13) 36%, rgba(79, 70, 229, 0.03) 54%, transparent 68%)',
        }}
      />

      {/* Acento inferior en cian */}
      <div
        className="animate-aurora-3 absolute -bottom-[14%] left-[18%] h-[36rem] w-[46rem] blur-3xl"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(14, 165, 233, 0.25) 0%, rgba(6, 182, 212, 0.11) 36%, rgba(14, 165, 233, 0.02) 54%, transparent 66%)',
        }}
      />
    </div>
  );
}
