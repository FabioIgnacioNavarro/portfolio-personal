'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { PortfolioContent } from '@/lib/content';
import { useViewPreferences } from '@/context/ViewPreferencesContext';
import { Header } from '@/components/common/Header';
import { SimpleBackground } from '@/components/simple/SimpleBackground';
import { HeroSection } from '@/components/simple/HeroSection';
import { ExperienceSection } from '@/components/simple/ExperienceSection';
import { ProjectsSection } from '@/components/simple/ProjectsSection';
import { SkillsSection } from '@/components/simple/SkillsSection';
import { EducationSection } from '@/components/simple/EducationSection';
import { LanguagesSection } from '@/components/simple/LanguagesSection';
import { ContactSection } from '@/components/simple/ContactSection';
import { Footer } from '@/components/simple/Footer';

// Carga diferida del Modo Escritorio para no penalizar el bundle inicial del Modo Simple
const DesktopWorkspace = dynamic(
  () => import('@/components/desktop/DesktopWorkspace').then((mod) => mod.DesktopWorkspace),
  {
    ssr: false,
    loading: () => (
      <div className="w-screen h-screen bg-slate-950 text-slate-300 flex items-center justify-center text-sm font-medium">
        <span className="animate-pulse">Cargando entorno de escritorio...</span>
      </div>
    ),
  },
);

interface PortfolioContainerProps {
  content: PortfolioContent;
}

export function PortfolioContainer({ content }: PortfolioContainerProps) {
  const { lang, mode } = useViewPreferences();

  // Vista de Modo Escritorio (chunk cargado bajo demanda)
  if (mode === 'desktop') {
    return <DesktopWorkspace content={content} />;
  }

  // Vista de Modo Simple en apariencia única oscura con fondo animado sutil
  return (
    <div className="relative min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-blue-600 focus:text-white focus:text-sm focus:font-semibold focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        {lang === 'es' ? 'Saltar al contenido principal' : 'Skip to main content'}
      </a>

      <SimpleBackground />
      <Header />

      <main className="relative z-10 flex-1 outline-none" id="main-content" tabIndex={-1}>
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
