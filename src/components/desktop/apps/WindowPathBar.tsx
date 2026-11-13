'use client';

import React from 'react';

interface WindowPathBarProps {
  path: string;
  icon?: React.ReactNode;
  meta?: React.ReactNode;
  leadingAction?: React.ReactNode;
}

// Barra superior compartida de ruta ficticia para unificar todas las ventanas del Modo Escritorio
export function WindowPathBar({ path, icon, meta, leadingAction }: WindowPathBarProps) {
  return (
    <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800 text-xs text-slate-400 shrink-0">
      <div className="flex items-center gap-2 min-w-0">
        {leadingAction}
        <div className="flex items-center gap-1.5 font-mono bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60 truncate">
          {icon}
          <span className="truncate">{path}</span>
        </div>
      </div>

      {meta && <span className="shrink-0">{meta}</span>}
    </div>
  );
}
