'use client';

import React from 'react';

interface SectionPanelProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  panelClassName?: string;
}

// Contenedor unificado con opacidad reducida para agrupar visualmente cada bloque en Modo Simple
export function SectionPanel({
  id,
  children,
  className = '',
  panelClassName = '',
}: SectionPanelProps) {
  return (
    <section id={id} className={`scroll-mt-20 py-3 sm:py-4 ${className}`.trim()}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div
          className={`rounded-2xl border border-slate-800/80 bg-slate-900/55 p-5 sm:p-8 shadow-lg ${panelClassName}`.trim()}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
