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
      {/* Brillo superior izquierdo en azul técnico */}
      <div
        className="animate-aurora-1 absolute -top-[18%] -left-[12%] h-[42rem] w-[42rem] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(59, 130, 246, 0.14) 0%, rgba(37, 99, 235, 0.05) 45%, transparent 72%)',
        }}
      />

      {/* Contrapunto medio derecho en índigo */}
      <div
        className="animate-aurora-2 absolute top-[22%] -right-[14%] h-[38rem] w-[38rem] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(99, 102, 241, 0.11) 0%, rgba(79, 70, 229, 0.04) 45%, transparent 72%)',
        }}
      />

      {/* Acento inferior tenue en cian */}
      <div
        className="animate-aurora-3 absolute -bottom-[18%] left-[18%] h-[34rem] w-[44rem] rounded-full"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(14, 165, 233, 0.09) 0%, rgba(14, 165, 233, 0.03) 45%, transparent 70%)',
        }}
      />
    </div>
  );
}
