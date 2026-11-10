'use client';

import React, { useState, useEffect } from 'react';
import { useWindowManager, WindowId } from '@/context/WindowManagerContext';
import { useViewPreferences } from '@/context/ViewPreferencesContext';
import { Profile } from '@/lib/schemas';
import { StartMenu } from './StartMenu';
import {
  Sparkles,
  Sun,
  Moon,
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
} from 'lucide-react';

interface TaskbarProps {
  profile: Profile;
}

export function Taskbar({ profile }: TaskbarProps) {
  const { windows, activeWindowId, focusWindow, minimizeWindow } = useWindowManager();
  const { lang, setLang, theme, toggleTheme, setMode, t } = useViewPreferences();
  const [startMenuOpen, setStartMenuOpen] = useState(false);
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
      <StartMenu isOpen={startMenuOpen} onClose={() => setStartMenuOpen(false)} profile={profile} />

      <nav
        aria-label="Barra de tareas del escritorio"
        className="fixed bottom-0 left-0 right-0 h-12 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 px-2 sm:px-3 flex items-center justify-between gap-2 shadow-lg select-none"
      >
        {/* Left: Start Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStartMenuOpen(!startMenuOpen)}
            aria-label="Abrir menú de inicio"
            aria-expanded={startMenuOpen}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
              startMenuOpen
                ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="tracking-tight">{lang === 'es' ? 'Inicio' : 'Start'}</span>
          </button>
        </div>

        {/* Center: Open Window Tabs */}
        <div className="flex-1 flex items-center gap-1.5 overflow-x-auto px-2 no-scrollbar">
          {openWindows.map((w) => {
            const isActive = activeWindowId === w.id && !w.isMinimized;
            return (
              <button
                key={w.id}
                onClick={() => handleTabClick(w.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium max-w-[170px] truncate transition-all shrink-0 border ${
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

        {/* Right: System Tray */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Switch to Simple Mode button */}
          <button
            onClick={() => setMode('simple')}
            title={lang === 'es' ? 'Cambiar a Modo Simple' : 'Switch to Simple Mode'}
            aria-label="Cambiar a Modo Simple"
            className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">Simple</span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            aria-label={`Cambiar idioma (${lang.toUpperCase()})`}
            title={`Cambiar idioma (${lang.toUpperCase()})`}
            className="flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-blue-500" />
            <span>{lang.toUpperCase()}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Activar tema claro' : 'Activar tema oscuro'}
            title={theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
            className="p-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-slate-600" />
            )}
          </button>

          {/* Clock */}
          <div className="hidden sm:flex items-center px-2 py-1 rounded-lg text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
            {time}
          </div>
        </div>
      </nav>
    </>
  );
}
