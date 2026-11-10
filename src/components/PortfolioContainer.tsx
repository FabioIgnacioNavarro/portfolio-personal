'use client';

import React from 'react';
import { PortfolioContent } from '@/lib/content';
import { useViewPreferences } from '@/context/ViewPreferencesContext';
import { Header } from '@/components/common/Header';
import { HeroSection } from '@/components/simple/HeroSection';
import { ExperienceSection } from '@/components/simple/ExperienceSection';
import { ProjectsSection } from '@/components/simple/ProjectsSection';
import { SkillsSection } from '@/components/simple/SkillsSection';
import { EducationSection } from '@/components/simple/EducationSection';
import { LanguagesSection } from '@/components/simple/LanguagesSection';
import { ContactSection } from '@/components/simple/ContactSection';
import { Footer } from '@/components/simple/Footer';
import { Monitor, ArrowLeft } from 'lucide-react';

interface PortfolioContainerProps {
  content: PortfolioContent;
}

export function PortfolioContainer({ content }: PortfolioContainerProps) {
  const { mode, setMode, lang } = useViewPreferences();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Header />

      {/* Notice when Desktop mode is clicked during Phase 1 */}
      {mode === 'desktop' && (
        <div className="bg-blue-600 text-white px-4 py-3 text-center text-sm shadow-md flex items-center justify-center gap-3">
          <Monitor className="w-4 h-4 shrink-0" />
          <span>
            {lang === 'es'
              ? 'El Modo Escritorio interactivo (ventanas, terminal y sistema de archivos) se implementará en la Fase 2. Disfruta de la experiencia completa en Modo Simple.'
              : 'Interactive Desktop Mode (windows, terminal, and filesystem) will be implemented in Phase 2. Enjoy the full experience in Simple Mode.'}
          </span>
          <button
            onClick={() => setMode('simple')}
            className="underline font-bold hover:text-blue-100 ml-2 inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {lang === 'es' ? 'Volver a Modo Simple' : 'Back to Simple Mode'}
          </button>
        </div>
      )}

      {/* Main Content (Modo Simple) */}
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
