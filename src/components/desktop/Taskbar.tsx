'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useWindowManager, WindowId } from '@/context/WindowManagerContext';
import { useViewPreferences } from '@/context/ViewPreferencesContext';
import { Profile } from '@/lib/schemas';
import { StartMenu } from './StartMenu';
import {
  Power,
  Globe,
  FileText,
  User,
  Folder,
  Briefcase,
  Cpu,
  GraduationCap,
  Mail,
  Terminal,
  FileCode,
  Trash2,
} from 'lucide-react';

interface TaskbarProps {
  profile: Profile;
}

function SystemClock({ lang }: { lang: 'es' | 'en' }) {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString(lang === 'es' ? 'es-AR' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [lang]);

  return (
    <div className="hidden sm:flex items-center px-2 py-1 rounded-lg text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
      {time}
    </div>
  );
}

export function Taskbar({ profile }: TaskbarProps) {
  const { windows, activeWindowId, focusWindow, minimizeWindow } = useWindowManager();
  const { lang, setLang, setMode, t } = useViewPreferences();
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const startButtonRef = useRef<HTMLButtonElement>(null);

  const getWindowIcon = (id: WindowId) => {
    switch (id) {
      case 'about':
        return <User className="w-3.5 h-3.5" />;
      case 'projects':
        return <Folder className="w-3.5 h-3.5 text-amber-500" />;
      case 'project-detail':
        return <FileCode className="w-3.5 h-3.5 text-blue-500" />;
      case 'experience':
        return <Briefcase className="w-3.5 h-3.5 text-emerald-500" />;
      case 'skills':
        return <Cpu className="w-3.5 h-3.5 text-purple-500" />;
      case 'education':
        return <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />;
      case 'contact':
        return <Mail className="w-3.5 h-3.5 text-rose-500" />;
      case 'terminal':
        return <Terminal className="w-3.5 h-3.5 text-teal-500" />;
      case 'trash':
        return <Trash2 className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const openWindows = Object.values(windows).filter((w) => w.isOpen);

  const handleTabClick = (wId: WindowId) => {
    const w = windows[wId];
    if (activeWindowId === wId && !w.isMinimized) {
      minimizeWindow(wId);
    } else {
      focusWindow(wId);
    }
  };

  return (
    <>
      <StartMenu
        isOpen={startMenuOpen}
        onClose={() => setStartMenuOpen(false)}
        profile={profile}
        returnFocusRef={startButtonRef}
      />

      <nav
        aria-label={lang === 'es' ? 'Barra de tareas del escritorio' : 'Desktop taskbar'}
        className="fixed bottom-0 left-0 right-0 h-12 z-40 bg-slate-900/85 backdrop-blur-md border-t border-slate-800/80 px-2 sm:px-3 flex items-center justify-between gap-2 shadow-lg select-none"
      >
        {/* Izquierda: Botón Inicio */}
        <div className="flex items-center gap-2">
          <button
            ref={startButtonRef}
            type="button"
            onClick={() => setStartMenuOpen(!startMenuOpen)}
            aria-label={lang === 'es' ? 'Abrir menú de inicio' : 'Open start menu'}
            aria-expanded={startMenuOpen}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
              startMenuOpen
                ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-100'
            }`}
          >
            <Power className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
            <span className="tracking-tight">{lang === 'es' ? 'Inicio' : 'Start'}</span>
          </button>
        </div>

        {/* Centro: Pestañas de ventanas abiertas */}
        <div className="flex-1 min-w-0 flex items-center gap-1.5 overflow-x-auto px-1 sm:px-2 no-scrollbar">
          {openWindows.map((w) => {
            const isActive = activeWindowId === w.id && !w.isMinimized;
            return (
              <button
                key={w.id}
                onClick={() => handleTabClick(w.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium max-w-[118px] sm:max-w-[170px] truncate transition-all shrink-0 border ${
                  isActive
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border-blue-500/50 shadow-xs'
                    : w.isMinimized
                      ? 'bg-slate-100/50 dark:bg-slate-800/40 text-slate-400 border-transparent hover:bg-slate-200/60 dark:hover:bg-slate-800'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {getWindowIcon(w.id)}
                <span className="truncate">{t(w.title)}</span>
              </button>
            );
          })}
        </div>

        {/* Derecha: Bandeja del sistema */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Botón para cambiar a Modo Simple */}
          <button
            onClick={() => setMode('simple')}
            title={lang === 'es' ? 'Cambiar a Modo Simple' : 'Switch to Simple Mode'}
            aria-label={lang === 'es' ? 'Cambiar a Modo Simple' : 'Switch to Simple Mode'}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">Simple</span>
          </button>

          {/* Selector de idioma */}
          <button
            type="button"
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            aria-label={lang === 'es' ? 'Cambiar idioma a Inglés' : 'Switch language to Spanish'}
            title={
              lang === 'es'
                ? `Cambiar idioma (${lang.toUpperCase()})`
                : `Switch language (${lang.toUpperCase()})`
            }
            className="flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-lg text-slate-300 hover:bg-slate-800 border border-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <Globe className="w-3.5 h-3.5 text-blue-500" />
            <span>{lang.toUpperCase()}</span>
          </button>

          {/* Reloj */}
          <SystemClock lang={lang} />
        </div>
      </nav>
    </>
  );
}
