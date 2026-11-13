'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useViewPreferences } from '@/context/ViewPreferencesContext';
import { Monitor, FileText, Globe, Menu, X } from 'lucide-react';
import { GithubIcon } from '@/components/common/Icons';
import { BrandMark } from '@/components/common/BrandMark';

interface HeaderProps {
  onDesktopModeSelect?: () => void;
  portfolioRepoUrl?: string;
}

export function Header({ onDesktopModeSelect, portfolioRepoUrl }: HeaderProps) {
  const { lang, setLang, mode, setMode } = useViewPreferences();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('about');
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const navLinks = [
    { href: '#experience', id: 'experience', label: lang === 'es' ? 'Experiencia' : 'Experience' },
    { href: '#projects', id: 'projects', label: lang === 'es' ? 'Proyectos' : 'Projects' },
    { href: '#skills', id: 'skills', label: lang === 'es' ? 'Habilidades' : 'Skills' },
    { href: '#education', id: 'education', label: lang === 'es' ? 'Educación' : 'Education' },
    { href: '#contact', id: 'contact', label: lang === 'es' ? 'Contacto' : 'Contact' },
  ];

  // Rastrea la sección visible para resaltar la ubicación actual en la barra de navegación
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const sectionIds = [
      'about',
      'experience',
      'projects',
      'skills',
      'education',
      'languages',
      'contact',
    ];
    const elements = sectionIds
      .map((secId) => document.getElementById(secId))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((entry) => entry.isIntersecting);
        if (intersecting.length === 0) return;
        const topmost = intersecting.reduce((best, cur) =>
          cur.boundingClientRect.top < best.boundingClientRect.top ? cur : best,
        );
        if (topmost.target.id) {
          setActiveSection(topmost.target.id);
        }
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: 0.01 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

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
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Marca / Logo */}
        <a
          href="#about"
          className="min-w-0 text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-2.5 hover:opacity-85 transition-opacity rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <BrandMark size="sm" />
          <span className="truncate">Fabio Ignacio Navarro</span>
        </a>

        {/* Enlaces de navegación en escritorio (desde 1024px para evitar solapamiento en tablet) */}
        <nav
          className="hidden lg:flex items-center gap-4 xl:gap-6"
          aria-label={lang === 'es' ? 'Navegación principal' : 'Main navigation'}
        >
          {navLinks.map((link) => {
            const isCurrent = activeSection === link.id;
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={isCurrent ? 'location' : undefined}
                className={`text-sm font-medium transition-colors rounded-md px-1.5 py-1 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  isCurrent ? 'text-sky-400' : 'text-slate-300 hover:text-blue-400'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Controles globales */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Selector de modo */}
          <div
            className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700"
            role="group"
            aria-label={lang === 'es' ? 'Selector de modo de visualización' : 'View mode selector'}
          >
            <button
              type="button"
              onClick={() => handleModeChange('simple')}
              aria-pressed={mode === 'simple'}
              aria-label={
                lang === 'es' ? 'Modo Simple (Lectura rápida)' : 'Simple Mode (Fast Reading)'
              }
              title={lang === 'es' ? 'Modo Simple (Lectura rápida)' : 'Simple Mode (Fast Reading)'}
              className={`flex items-center gap-1.5 min-h-[38px] sm:min-h-0 px-2.5 py-1.5 sm:py-1 text-xs font-medium rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
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
              aria-pressed={mode === 'desktop'}
              aria-label={
                lang === 'es' ? 'Modo Escritorio interactivo' : 'Interactive Desktop Mode'
              }
              title={lang === 'es' ? 'Modo Escritorio interactivo' : 'Interactive Desktop Mode'}
              className={`flex items-center gap-1.5 min-h-[38px] sm:min-h-0 px-2.5 py-1.5 sm:py-1 text-xs font-medium rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
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
            className="flex items-center gap-1 min-h-[40px] sm:min-h-0 px-2.5 py-1.5 sm:py-1 text-xs font-semibold rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>{lang.toUpperCase()}</span>
          </button>

          {/* Enlace al repositorio fuente del portfolio */}
          {portfolioRepoUrl && (
            <a
              href={portfolioRepoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={
                lang === 'es'
                  ? 'Ver repositorio del portfolio en GitHub (abre en nueva pestaña)'
                  : 'View portfolio repository on GitHub (opens in a new tab)'
              }
              title={
                lang === 'es' ? 'Ver código fuente del portfolio' : 'View portfolio source code'
              }
              className="flex items-center gap-1.5 min-h-[40px] sm:min-h-0 px-2.5 py-1.5 sm:py-1 text-xs font-semibold rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <GithubIcon className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              <span className="hidden md:inline">{lang === 'es' ? 'Repo' : 'Source'}</span>
            </a>
          )}

          {/* Botón de menú móvil / tablet */}
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
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

      {/* Menú desplegable en móvil y tablet */}
      {mobileMenuOpen && (
        <nav
          aria-label={lang === 'es' ? 'Navegación móvil' : 'Mobile navigation'}
          className="lg:hidden border-b border-slate-800 bg-slate-900 px-4 pt-2 pb-4 space-y-1"
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
          {portfolioRepoUrl && (
            <a
              href={portfolioRepoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-blue-400 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <GithubIcon className="w-4 h-4 shrink-0" />
              <span>{lang === 'es' ? 'Repositorio del portfolio' : 'Portfolio repository'}</span>
            </a>
          )}
        </nav>
      )}
    </header>
  );
}
