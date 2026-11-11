'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { LocalizedText } from '@/lib/schemas';

export type Language = 'es' | 'en';
export type ViewMode = 'simple' | 'desktop';

interface ViewPreferencesContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  mode: ViewMode;
  setMode: (mode: ViewMode) => void;
  isTransitioning: boolean;
  toggleLang: () => void;
  t: (text: LocalizedText | string | null | undefined) => string;
}

const ViewPreferencesContext = createContext<ViewPreferencesContextType | undefined>(undefined);

export function ViewPreferencesProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('es');
  const [mode, setModeState] = useState<ViewMode>('simple');
  const [isHydrated, setIsHydrated] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // 1. Detección de idioma desde query param, almacenamiento local o navegador
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

    // 2. Detección del modo de visualización (Simple es predeterminado para máxima velocidad inicial)
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
      setModeState('simple');
    }

    // 3. Garantiza la apariencia única en modo oscuro para todo el documento
    document.documentElement.classList.add('dark');

    setIsHydrated(true);
  }, []);

  // Mantiene sincronizado el atributo lang del documento para accesibilidad y lectores de pantalla
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('portfolio-lang', newLang);
  };

  const toggleLang = () => {
    setLang(lang === 'es' ? 'en' : 'es');
  };

  const setMode = (newMode: ViewMode) => {
    if (newMode === mode) return;
    if (newMode === 'simple' && mode === 'desktop') {
      setIsTransitioning(true);
      setTimeout(() => {
        setModeState(newMode);
        localStorage.setItem('portfolio-mode', newMode);
        setIsTransitioning(false);
      }, 200);
    } else {
      setModeState(newMode);
      localStorage.setItem('portfolio-mode', newMode);
    }
  };

  const t = (text: LocalizedText | string | null | undefined): string => {
    if (!text) return '';
    if (typeof text === 'string') return text;
    return text[lang] || text.es || '';
  };

  return (
    <ViewPreferencesContext.Provider
      value={{
        lang,
        setLang,
        mode,
        setMode,
        isTransitioning,
        toggleLang,
        t,
      }}
    >
      <div
        data-hydrated={isHydrated}
        className={isHydrated ? 'opacity-100 transition-opacity duration-150' : 'opacity-90'}
      >
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
