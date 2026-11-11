'use client';

import React from 'react';
import { WindowId, useWindowManager } from '@/context/WindowManagerContext';
import { useViewPreferences } from '@/context/ViewPreferencesContext';
import { LocalizedText } from '@/lib/schemas';

interface DesktopIconProps {
  id: WindowId;
  label: LocalizedText;
  icon: React.ReactNode;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function DesktopIcon({ id, label, icon, isSelected = false, onSelect }: DesktopIconProps) {
  const { openWindow } = useWindowManager();
  const { t } = useViewPreferences();

  const handleOpen = () => {
    openWindow(id);
  };

  const handleClick = () => {
    onSelect?.();
    // En pantallas táctiles o móviles, abrir con un solo toque
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      handleOpen();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOpen();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onDoubleClick={handleOpen}
      onKeyDown={handleKeyDown}
      aria-label={t(label)}
      className={`group w-24 sm:w-28 p-2.5 flex flex-col items-center gap-1.5 rounded-xl cursor-pointer text-center select-none transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
        isSelected
          ? 'bg-blue-600/40 ring-1 ring-blue-300 shadow-sm'
          : 'hover:bg-white/15'
      }`}
    >
      <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-xl bg-gradient-to-b from-white/95 to-slate-100/90 dark:from-slate-800/95 dark:to-slate-900/90 shadow-md border border-white/40 dark:border-slate-700/60 group-hover:scale-105 transition-transform text-blue-600 dark:text-blue-400">
        {icon}
      </div>
      <span className="text-xs font-semibold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)] line-clamp-2 px-1 rounded leading-tight">
        {t(label)}
      </span>
    </button>
  );
}
