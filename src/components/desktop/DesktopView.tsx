'use client';

import React, { useState } from 'react';
import { PortfolioContent } from '@/lib/content';
import { useWindowManager, WindowId } from '@/context/WindowManagerContext';
import { DesktopIcon } from './DesktopIcon';
import { Window } from './Window';
import { Taskbar } from './Taskbar';
import { AboutApp } from './apps/AboutApp';
import { ExperienceApp } from './apps/ExperienceApp';
import { ProjectsFolderApp } from './apps/ProjectsFolderApp';
import { ProjectDetailApp } from './apps/ProjectDetailApp';
import { SkillsApp } from './apps/SkillsApp';
import { EducationApp } from './apps/EducationApp';
import { ContactApp } from './apps/ContactApp';
import { TerminalApp } from './apps/TerminalApp';
import {
  User,
  Folder,
  Briefcase,
  Cpu,
  GraduationCap,
  Mail,
  Terminal,
  FileCode,
} from 'lucide-react';

interface DesktopViewProps {
  content: PortfolioContent;
}

export function DesktopView({ content }: DesktopViewProps) {
  const { windows, openWindow } = useWindowManager();
  const [selectedIcon, setSelectedIcon] = useState<WindowId | null>(null);

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
      className="relative w-screen h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-slate-200 to-blue-100 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 select-none pb-12"
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(100, 116, 139, 0.15) 1px, transparent 0)`,
        backgroundSize: '24px 24px',
      }}
    >
      {/* Desktop Icons Area */}
      <div className="absolute top-4 left-4 grid grid-flow-col grid-rows-5 gap-2 z-10">
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

      {/* Windows Layer */}
      <div className="absolute inset-0 pb-12 pointer-events-none [&>*]:pointer-events-auto">
        {/* 1. About Window */}
        <Window windowState={windows.about} iconNode={<User className="w-4 h-4" />}>
          <AboutApp profile={content.profile} />
        </Window>

        {/* 2. Projects Folder Window */}
        <Window
          windowState={windows.projects}
          iconNode={<Folder className="w-4 h-4 text-amber-500" />}
        >
          <ProjectsFolderApp projects={content.projects} />
        </Window>

        {/* 3. Project Detail Window */}
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

        {/* 4. Experience Window */}
        <Window
          windowState={windows.experience}
          iconNode={<Briefcase className="w-4 h-4 text-emerald-500" />}
        >
          <ExperienceApp experience={content.experience} />
        </Window>

        {/* 5. Skills Window */}
        <Window windowState={windows.skills} iconNode={<Cpu className="w-4 h-4 text-purple-500" />}>
          <SkillsApp skills={content.skills} />
        </Window>

        {/* 6. Education Window */}
        <Window
          windowState={windows.education}
          iconNode={<GraduationCap className="w-4 h-4 text-indigo-500" />}
        >
          <EducationApp education={content.education} certifications={content.certifications} />
        </Window>

        {/* 7. Contact Window */}
        <Window windowState={windows.contact} iconNode={<Mail className="w-4 h-4 text-rose-500" />}>
          <ContactApp profile={content.profile} />
        </Window>

        {/* 8. Terminal Window */}
        <Window
          windowState={windows.terminal}
          iconNode={<Terminal className="w-4 h-4 text-teal-500" />}
        >
          <TerminalApp content={content} />
        </Window>
      </div>

      {/* Bottom Taskbar */}
      <Taskbar profile={content.profile} />
    </div>
  );
}
