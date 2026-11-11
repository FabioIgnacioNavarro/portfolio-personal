'use client';

import React from 'react';
import { PortfolioContent } from '@/lib/content';
import { useViewPreferences } from '@/context/ViewPreferencesContext';
import { WindowManagerProvider } from '@/context/WindowManagerContext';
import { DesktopView } from '@/components/desktop/DesktopView';
import { Header } from '@/components/common/Header';
import { HeroSection } from '@/components/simple/HeroSection';
import { ExperienceSection } from '@/components/simple/ExperienceSection';
import { ProjectsSection } from '@/components/simple/ProjectsSection';
import { SkillsSection } from '@/components/simple/SkillsSection';
import { EducationSection } from '@/components/simple/EducationSection';
import { LanguagesSection } from '@/components/simple/LanguagesSection';
import { ContactSection } from '@/components/simple/ContactSection';
import { Footer } from '@/components/simple/Footer';

interface PortfolioContainerProps {
  content: PortfolioContent;
}

export function PortfolioContainer({ content }: PortfolioContainerProps) {
  const { mode } = useViewPreferences();

  // Vista de Modo Escritorio
  if (mode === 'desktop') {
    return (
      <WindowManagerProvider>
        <DesktopView content={content} />
      </WindowManagerProvider>
    );
  }

  // Vista de Modo Simple (lineal, accesible y predeterminada para móvil o movimiento reducido)
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Header />
      <main className="flex-1" id="main-content">
        <HeroSection profile={content.profile} />
        <ExperienceSection experience={content.experience} />
        <ProjectsSection projects={content.projects} />
        <SkillsSection skills={content.skills} />
        <EducationSection education={content.education} certifications={content.certifications} />
        <LanguagesSection languages={content.languages} />
        <ContactSection profile={content.profile} />
      </main>
      <Footer />
    </div>
  );
}
