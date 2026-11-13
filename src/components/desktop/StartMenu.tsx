'use client';

import React, { useRef, useEffect } from 'react';
import { useWindowManager, WindowId } from '@/context/WindowManagerContext';
import { useViewPreferences } from '@/context/ViewPreferencesContext';
import { Profile } from '@/lib/schemas';
import {
  User,
  Folder,
  Briefcase,
  Cpu,
  GraduationCap,
  Languages,
  Mail,
  Terminal,
  Download,
  FileText,
  X,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/common/Icons';
import { BrandMark } from '@/components/common/BrandMark';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
  returnFocusRef?: React.RefObject<HTMLButtonElement | null>;
}

export function StartMenu({ isOpen, onClose, profile, returnFocusRef }: StartMenuProps) {
  const { openWindow } = useWindowManager();
  const { lang, t, setMode } = useViewPreferences();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        !returnFocusRef?.current?.contains(target)
      ) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        returnFocusRef?.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handleOutsideClick);
    window.addEventListener('keydown', handleKeyDown, true);
    requestAnimationFrame(() => menuRef.current?.focus());
    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isOpen, onClose, returnFocusRef]);

  if (!isOpen) return null;

  const appItems: { id: WindowId; label: { es: string; en: string }; icon: React.ReactNode }[] = [
    {
      id: 'about',
      label: { es: 'Sobre mí', en: 'About Me' },
      icon: <User className="w-4 h-4 text-blue-500" />,
    },
    {
      id: 'projects',
      label: { es: 'Proyectos', en: 'Projects' },
      icon: <Folder className="w-4 h-4 text-amber-500" />,
    },
    {
      id: 'experience',
      label: { es: 'Experiencia', en: 'Experience' },
      icon: <Briefcase className="w-4 h-4 text-emerald-500" />,
    },
    {
      id: 'skills',
      label: { es: 'Habilidades', en: 'Skills' },
      icon: <Cpu className="w-4 h-4 text-purple-500" />,
    },
    {
      id: 'education',
      label: { es: 'Educación & Certificaciones', en: 'Education' },
      icon: <GraduationCap className="w-4 h-4 text-indigo-500" />,
    },
    {
      id: 'languages',
      label: { es: 'Idiomas', en: 'Languages' },
      icon: <Languages className="w-4 h-4 text-cyan-400" />,
    },
    {
      id: 'contact',
      label: { es: 'Contacto', en: 'Contact' },
      icon: <Mail className="w-4 h-4 text-rose-500" />,
    },
    {
      id: 'terminal',
      label: { es: 'Terminal', en: 'Terminal' },
      icon: <Terminal className="w-4 h-4 text-teal-500" />,
    },
  ];

  const cvHref = lang === 'es' ? profile.links.cvUrl.es : profile.links.cvUrl.en;

  const handleLaunch = (id: WindowId) => {
    openWindow(id);
    onClose();
  };

  return (
    <div
      ref={menuRef}
      role="dialog"
      tabIndex={-1}
      aria-label={lang === 'es' ? 'Menú de inicio' : 'Start menu'}
      className="absolute bottom-14 left-2 w-[calc(100vw-1rem)] max-w-sm max-h-[calc(100dvh-4.5rem)] overflow-y-auto rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-800 shadow-2xl z-50 animate-start-menu outline-none"
    >
      {/* Encabezado superior con datos del perfil */}
      <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/80 border-b border-slate-800 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BrandMark size="sm" />
          <div>
            <h3 className="font-bold text-sm tracking-tight text-white">{profile.name}</h3>
            <p className="text-xs text-slate-300">{t(profile.role)}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            onClose();
            returnFocusRef?.current?.focus();
          }}
          aria-label={lang === 'es' ? 'Cerrar menú de inicio' : 'Close start menu'}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Lista de aplicaciones */}
      <div className="p-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1 block">
          {lang === 'es' ? 'Aplicaciones del Sistema' : 'System Applications'}
        </span>
        <div className="space-y-1 mt-1">
          {appItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleLaunch(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-200 hover:bg-slate-800 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <span>{t(item.label)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Acciones rápidas del pie */}
      <div className="p-3 bg-slate-950/70 border-t border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <a
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            title="GitHub"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            title="LinkedIn"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <LinkedinIcon className="w-4 h-4" />
          </a>
          <a
            href={cvHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={lang === 'es' ? 'Descargar CV' : 'Download CV'}
            title={lang === 'es' ? 'Descargar CV' : 'Download CV'}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <Download className="w-4 h-4" />
          </a>
        </div>

        <button
          onClick={() => {
            setMode('simple');
            onClose();
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-950/60 text-blue-400 hover:bg-blue-900/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{lang === 'es' ? 'Modo Simple' : 'Simple Mode'}</span>
        </button>
      </div>
    </div>
  );
}
