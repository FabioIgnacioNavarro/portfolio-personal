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
    // On touch / mobile screens, open on single tap
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
          ? 'bg-blue-500/20 dark:bg-blue-500/30 ring-1 ring-blue-500/50 backdrop-blur-xs'
          : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:backdrop-blur-xs'
      }`}
    >
      <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-xl bg-gradient-to-b from-white/90 to-slate-100/90 dark:from-slate-800/90 dark:to-slate-900/90 shadow-md border border-slate-200/60 dark:border-slate-700/60 group-hover:scale-105 transition-transform text-blue-600 dark:text-blue-400">
        {icon}
      </div>
      <span className="text-xs font-medium text-slate-800 dark:text-slate-100 line-clamp-2 px-1 rounded drop-shadow-xs leading-tight">
        {t(label)}
      </span>
    </button>
  );
}
