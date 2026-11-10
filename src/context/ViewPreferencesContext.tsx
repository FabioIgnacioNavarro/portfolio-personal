'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { LocalizedText } from '@/lib/schemas';

export type Language = 'es' | 'en';
export type ViewMode = 'simple' | 'desktop';
export type Theme = 'light' | 'dark';

interface ViewPreferencesContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  mode: ViewMode;
  setMode: (mode: ViewMode) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  toggleLang: () => void;
  t: (text: LocalizedText | undefined) => string;
}

const ViewPreferencesContext = createContext<ViewPreferencesContextType | undefined>(undefined);

export function ViewPreferencesProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('es');
  const [mode, setModeState] = useState<ViewMode>('simple');
  const [theme, setThemeState] = useState<Theme>('light');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // 1. Language detection
    const params = new URLSearchParams(window.location.search);
    const queryLang = params.get('lang') as Language;
    const storedLang = localStorage.getItem('portfolio-lang') as Language;

    if (queryLang === 'es' || queryLang === 'en') {
      setLangState(queryLang);
    } else if (storedLang === 'es' || storedLang === 'en') {
      setLangState(storedLang);
    } else {
      const browserLang = navigator.language?.toLowerCase() || '';
      setLangState(browserLang.startsWith('es') ? 'es' : 'en');
    }

    // 2. View Mode detection
    const queryMode = params.get('mode') as ViewMode;
    const storedMode = localStorage.getItem('portfolio-mode') as ViewMode;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    if (queryMode === 'simple' || queryMode === 'desktop') {
      setModeState(queryMode);
    } else if (storedMode === 'simple' || storedMode === 'desktop') {
      setModeState(storedMode);
    } else if (isMobile || prefersReducedMotion) {
      setModeState('simple');
    } else {
      setModeState('simple'); // Default for Phase 1 is simple mode
    }

    // 3. Theme detection
    const storedTheme = localStorage.getItem('portfolio-theme') as Theme;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme: Theme =
      storedTheme === 'dark' || storedTheme === 'light'
        ? storedTheme
        : prefersDark
          ? 'dark'
          : 'light';

    setThemeState(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    setIsHydrated(true);
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('portfolio-lang', newLang);
  };

  const toggleLang = () => {
    setLang(lang === 'es' ? 'en' : 'es');
  };

  const setMode = (newMode: ViewMode) => {
    setModeState(newMode);
    localStorage.setItem('portfolio-mode', newMode);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const t = (text: LocalizedText | undefined): string => {
    if (!text) return '';
    return text[lang] || text.es || '';
  };

  return (
    <ViewPreferencesContext.Provider
      value={{
        lang,
        setLang,
        mode,
        setMode,
        theme,
        setTheme,
        toggleTheme,
        toggleLang,
        t,
      }}
    >
      <div className={isHydrated ? 'opacity-100 transition-opacity duration-150' : 'opacity-90'}>
        {children}
      </div>
    </ViewPreferencesContext.Provider>
  );
}

export function useViewPreferences() {
  const context = useContext(ViewPreferencesContext);
  if (!context) {
    throw new Error('useViewPreferences must be used within a ViewPreferencesProvider');
  }
  return context;
}
