'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { PortfolioContent } from '@/lib/content';
import { useWindowManager, WindowId } from '@/context/WindowManagerContext';
import { useViewPreferences } from '@/context/ViewPreferencesContext';
import { DesktopIcon } from './DesktopIcon';
import { Window } from './Window';
import { Taskbar } from './Taskbar';
import { AboutApp } from './apps/AboutApp';
import { ExperienceApp } from './apps/ExperienceApp';
import { ProjectsFolderApp } from './apps/ProjectsFolderApp';
import { ProjectDetailApp } from './apps/ProjectDetailApp';
import { SkillsApp } from './apps/SkillsApp';
import { EducationApp } from './apps/EducationApp';
import { LanguagesApp } from './apps/LanguagesApp';
import { ContactApp } from './apps/ContactApp';
import { TerminalApp } from './apps/TerminalApp';
import { TrashApp } from './apps/TrashApp';
import { BrandMark } from '@/components/common/BrandMark';
import {
  User,
  Folder,
  Briefcase,
  Cpu,
  GraduationCap,
  Languages,
  Mail,
  Terminal,
  FileCode,
  Trash2,
} from 'lucide-react';

interface DesktopViewProps {
  content: PortfolioContent;
}

export function DesktopView({ content }: DesktopViewProps) {
  const { windows, activeWindowId, isMobile, openWindow } = useWindowManager();
  const { isTransitioning, t } = useViewPreferences();
  const [selectedIcon, setSelectedIcon] = useState<WindowId | null>(null);

  // Asegura únicamente en desarrollo que el portal de Next.js no tape el escritorio emulado
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    const hideNextDevPortal = () => {
      const portals = document.querySelectorAll<HTMLElement>(
        'nextjs-portal, [data-nextjs-dev-overlay], [data-nextjs-toast], [data-nextjs-dialog-overlay]',
      );

      portals.forEach((portal) => {
        portal.style.setProperty('display', 'none', 'important');
        portal.style.setProperty('visibility', 'hidden', 'important');
        portal.style.setProperty('opacity', '0', 'important');
        portal.style.setProperty('pointer-events', 'none', 'important');

        if (
          portal.shadowRoot &&
          !portal.shadowRoot.querySelector('style[data-hide-next-dev-indicator="true"]')
        ) {
          const styleEl = document.createElement('style');
          styleEl.setAttribute('data-hide-next-dev-indicator', 'true');
          styleEl.textContent = `
            :host,
            [data-next-badge-root],
            [data-next-badge],
            #next-logo,
            [data-nextjs-dev-tools-button],
            [data-nextjs-toast],
            #data-devtools-indicator {
              display: none !important;
              visibility: hidden !important;
              opacity: 0 !important;
              pointer-events: none !important;
            }
          `;
          portal.shadowRoot.appendChild(styleEl);
        }
      });
    };

    hideNextDevPortal();

    const observer = new MutationObserver(() => {
      hideNextDevPortal();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  const desktopIcons: {
    id: WindowId;
    label: { es: string; en: string };
    icon: React.ReactNode;
  }[] = [
    {
      id: 'about',
      label: { es: 'Sobre mí', en: 'About Me' },
      icon: <User className="w-6 h-6" />,
    },
    {
      id: 'projects',
      label: { es: 'Proyectos', en: 'Projects' },
      icon: <Folder className="w-6 h-6 text-amber-500" />,
    },
    {
      id: 'experience',
      label: { es: 'Experiencia', en: 'Experience' },
      icon: <Briefcase className="w-6 h-6 text-emerald-500" />,
    },
    {
      id: 'skills',
      label: { es: 'Habilidades', en: 'Skills' },
      icon: <Cpu className="w-6 h-6 text-purple-500" />,
    },
    {
      id: 'education',
      label: { es: 'Educación', en: 'Education' },
      icon: <GraduationCap className="w-6 h-6 text-indigo-500" />,
    },
    {
      id: 'languages',
      label: { es: 'Idiomas', en: 'Languages' },
      icon: <Languages className="w-6 h-6 text-cyan-400" />,
    },
    {
      id: 'contact',
      label: { es: 'Contacto', en: 'Contact' },
      icon: <Mail className="w-6 h-6 text-rose-500" />,
    },
    {
      id: 'terminal',
      label: { es: 'Terminal', en: 'Terminal' },
      icon: <Terminal className="w-6 h-6 text-teal-500" />,
    },
  ];

  return (
    <div
      onClick={() => setSelectedIcon(null)}
      className={`relative w-full h-[100dvh] overflow-hidden select-none pb-12 bg-slate-950 transition-opacity duration-200 ${
        isTransitioning ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Encabezado accesible del escritorio */}
      <h1 className="sr-only">Portfolio OS — {content.profile.name}</h1>

      {/* Fondo de pantalla optimizado con next/image (AVIF/WebP automático) */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <Image
          src="/images/wallpaper.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={75}
          className="object-cover object-center"
        />
      </div>

      {/* Superposición oscura fija para legibilidad y contraste */}
      <div className="absolute inset-0 bg-black/35 pointer-events-none" aria-hidden="true" />

      {/* Área de íconos del escritorio: encabezado móvil no superpuesto + grilla tipo launcher */}
      <div className="absolute top-4 inset-x-3 md:inset-x-auto md:left-4 flex flex-col gap-3 z-10 pointer-events-none">
        {isMobile && !activeWindowId && (
          <div className="md:hidden pointer-events-auto flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800/80 shadow-md">
            <div className="flex items-center gap-2.5 min-w-0">
              <BrandMark size="sm" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{content.profile.name}</p>
                <p className="text-[11px] text-slate-300 truncate">
                  {t({
                    es: 'Tocá cualquier ícono para abrirlo',
                    en: 'Tap any icon below to open',
                  })}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openWindow('about');
              }}
              className="shrink-0 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              {t({ es: 'Abrir Bio', en: 'Open Bio' })}
            </button>
          </div>
        )}

        <div className="pointer-events-auto grid grid-cols-3 sm:grid-cols-4 md:grid-flow-col md:grid-rows-5 gap-2 justify-items-center md:justify-items-start">
          {desktopIcons.map((item) => (
            <div key={item.id} onClick={(e) => e.stopPropagation()}>
              <DesktopIcon
                id={item.id}
                label={item.label}
                icon={item.icon}
                isSelected={selectedIcon === item.id}
                onSelect={() => setSelectedIcon(item.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Ícono de Papelera en la esquina inferior derecha sobre la barra de tareas */}
      <div className="absolute bottom-16 right-4 z-10" onClick={(e) => e.stopPropagation()}>
        <DesktopIcon
          id="trash"
          label={{ es: 'Papelera', en: 'Trash' }}
          icon={<Trash2 className="w-6 h-6 text-slate-400" />}
          isSelected={selectedIcon === 'trash'}
          onSelect={() => setSelectedIcon('trash')}
        />
      </div>

      {/* Capa de ventanas */}
      <div className="absolute inset-0 pb-12 pointer-events-none [&>*]:pointer-events-auto">
        {/* 1. Ventana Sobre mí */}
        {windows.about.isOpen && (
          <Window windowState={windows.about} iconNode={<User className="w-4 h-4" />}>
            <AboutApp profile={content.profile} />
          </Window>
        )}

        {/* 2. Ventana Carpeta de Proyectos */}
        {windows.projects.isOpen && (
          <Window
            windowState={windows.projects}
            iconNode={<Folder className="w-4 h-4 text-amber-500" />}
          >
            <ProjectsFolderApp projects={content.projects} />
          </Window>
        )}

        {/* 3. Ventana Detalle de Proyecto */}
        {windows['project-detail'].isOpen && (
          <Window
            windowState={windows['project-detail']}
            iconNode={<FileCode className="w-4 h-4 text-blue-500" />}
          >
            <ProjectDetailApp
              projects={content.projects}
              activeSlug={windows['project-detail'].activeProjectSlug}
              onBackToFolder={() => openWindow('projects')}
            />
          </Window>
        )}

        {/* 4. Ventana de Experiencia */}
        {windows.experience.isOpen && (
          <Window
            windowState={windows.experience}
            iconNode={<Briefcase className="w-4 h-4 text-emerald-500" />}
          >
            <ExperienceApp experience={content.experience} />
          </Window>
        )}

        {/* 5. Ventana de Habilidades */}
        {windows.skills.isOpen && (
          <Window
            windowState={windows.skills}
            iconNode={<Cpu className="w-4 h-4 text-purple-500" />}
          >
            <SkillsApp skills={content.skills} />
          </Window>
        )}

        {/* 6. Ventana de Educación */}
        {windows.education.isOpen && (
          <Window
            windowState={windows.education}
            iconNode={<GraduationCap className="w-4 h-4 text-indigo-500" />}
          >
            <EducationApp education={content.education} certifications={content.certifications} />
          </Window>
        )}

        {/* 6b. Ventana de Idiomas */}
        {windows.languages.isOpen && (
          <Window
            windowState={windows.languages}
            iconNode={<Languages className="w-4 h-4 text-cyan-400" />}
          >
            <LanguagesApp languages={content.languages} />
          </Window>
        )}

        {/* 7. Ventana de Contacto */}
        {windows.contact.isOpen && (
          <Window
            windowState={windows.contact}
            iconNode={<Mail className="w-4 h-4 text-rose-500" />}
          >
            <ContactApp profile={content.profile} />
          </Window>
        )}

        {/* 8. Ventana de Terminal */}
        {windows.terminal.isOpen && (
          <Window
            windowState={windows.terminal}
            iconNode={<Terminal className="w-4 h-4 text-teal-500" />}
          >
            <TerminalApp content={content} />
          </Window>
        )}

        {/* 9. Ventana de Papelera */}
        {windows.trash.isOpen && (
          <Window
            windowState={windows.trash}
            iconNode={<Trash2 className="w-4 h-4 text-slate-400" />}
          >
            <TrashApp />
          </Window>
        )}
      </div>

      {/* Barra de tareas inferior */}
      <Taskbar profile={content.profile} />
    </div>
  );
}
