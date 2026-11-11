'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useViewPreferences } from '@/context/ViewPreferencesContext';
import { Monitor, FileText, Globe, Menu, X } from 'lucide-react';

interface HeaderProps {
  onDesktopModeSelect?: () => void;
}

export function Header({ onDesktopModeSelect }: HeaderProps) {
  const { lang, setLang, mode, setMode } = useViewPreferences();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const navLinks = [
    { href: '#about', label: lang === 'es' ? 'Sobre mí' : 'About' },
    { href: '#experience', label: lang === 'es' ? 'Experiencia' : 'Experience' },
    { href: '#projects', label: lang === 'es' ? 'Proyectos' : 'Projects' },
    { href: '#skills', label: lang === 'es' ? 'Habilidades' : 'Skills' },
    { href: '#education', label: lang === 'es' ? 'Educación' : 'Education' },
    { href: '#contact', label: lang === 'es' ? 'Contacto' : 'Contact' },
  ];

  // Permite cerrar el menú móvil con la tecla Escape restaurando el foco al botón disparador
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleModeChange = (newMode: 'simple' | 'desktop') => {
    setMode(newMode);
    if (newMode === 'desktop' && onDesktopModeSelect) {
      onDesktopModeSelect();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Marca / Logo */}
        <a
          href="#about"
          className="text-sm sm:text-lg font-bold tracking-tight text-white flex items-center gap-2 hover:opacity-80 transition-opacity rounded-md truncate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
          <span>Fabio Ignacio Navarro</span>
        </a>

        {/* Enlaces de navegación en escritorio */}
        <nav
          className="hidden md:flex items-center gap-6"
          aria-label={lang === 'es' ? 'Navegación principal' : 'Main navigation'}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors rounded-md px-1 py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Controles globales */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Selector de modo */}
          <div
            className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700"
            role="group"
            aria-label={lang === 'es' ? 'Selector de modo de visualización' : 'View mode selector'}
          >
            <button
              type="button"
              onClick={() => handleModeChange('simple')}
              aria-label={
                lang === 'es' ? 'Modo Simple (Lectura rápida)' : 'Simple Mode (Fast Reading)'
              }
              title={lang === 'es' ? 'Modo Simple (Lectura rápida)' : 'Simple Mode (Fast Reading)'}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                mode === 'simple'
                  ? 'bg-slate-700 text-blue-400 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Simple</span>
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('desktop')}
              aria-label={
                lang === 'es' ? 'Modo Escritorio interactivo' : 'Interactive Desktop Mode'
              }
              title={lang === 'es' ? 'Modo Escritorio interactivo' : 'Interactive Desktop Mode'}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                mode === 'desktop'
                  ? 'bg-slate-700 text-blue-400 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
          </div>

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
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>{lang.toUpperCase()}</span>
          </button>

          {/* Botón de menú móvil */}
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label={
              mobileMenuOpen
                ? lang === 'es'
                  ? 'Cerrar menú de navegación'
                  : 'Close navigation menu'
                : lang === 'es'
                  ? 'Abrir menú de navegación'
                  : 'Open navigation menu'
            }
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Menú desplegable en móvil */}
      {mobileMenuOpen && (
        <nav
          aria-label={lang === 'es' ? 'Navegación móvil' : 'Mobile navigation'}
          className="md:hidden border-b border-slate-800 bg-slate-900 px-4 pt-2 pb-4 space-y-1"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
