'use client';

import React from 'react';
import { Profile } from '@/lib/schemas';
import { useViewPreferences } from '@/context/ViewPreferencesContext';
import { Mail, Download, MapPin, ArrowRight } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/common/Icons';
import { Badge } from '@/components/common/Badge';

interface HeroSectionProps {
  profile: Profile;
}

export function HeroSection({ profile }: HeroSectionProps) {
  const { lang, t } = useViewPreferences();

  const cvHref = lang === 'es' ? profile.links.cvUrl.es : profile.links.cvUrl.en;

  return (
    <section
      id="about"
      className="py-12 md:py-20 border-b border-slate-200/80 dark:border-slate-800/80"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Etiqueta de disponibilidad */}
        <div className="inline-flex items-center gap-2 mb-6">
          <Badge variant="accent" className="py-1 px-3 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block mr-1"></span>
            {lang === 'es'
              ? 'Disponible para nuevas oportunidades'
              : 'Available for new opportunities'}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <MapPin className="w-3.5 h-3.5" />
            <span>{t(profile.location)}</span>
          </div>
        </div>

        {/* Nombre y rol */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
          {profile.name}
        </h1>
        <p className="text-xl sm:text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4">
          {t(profile.role)}
        </p>

        {/* Stack tecnológico principal */}
        <div className="text-sm sm:text-base font-mono text-slate-600 dark:text-slate-300 mb-6 bg-slate-100 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700/60 inline-block">
          {t(profile.headline)}
        </div>

        {/* Resumen biográfico */}
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8 max-w-3xl">
          {t(profile.summary)}
        </p>

        {/* Botones de acción principales */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            <span>{lang === 'es' ? 'Ver proyectos' : 'View projects'}</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href={cvHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium text-sm transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>{lang === 'es' ? 'Descargar CV' : 'Download Resume'}</span>
          </a>

          <a
            href={`mailto:${profile.links.email}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium text-sm transition-colors shadow-sm"
          >
            <Mail className="w-4 h-4" />
            <span>{lang === 'es' ? 'Contactar' : 'Contact me'}</span>
          </a>
        </div>

        {/* Redes sociales y enlaces de contacto */}
        <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">
            {lang === 'es' ? 'Redes & Enlaces:' : 'Links:'}
          </span>
          <a
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={lang === 'es' ? 'Perfil de GitHub' : 'GitHub profile'}
            className="p-2 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <GithubIcon className="w-5 h-5" />
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={lang === 'es' ? 'Perfil de LinkedIn' : 'LinkedIn profile'}
            className="p-2 rounded-lg hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <LinkedinIcon className="w-5 h-5" />
          </a>
          <a
            href={`mailto:${profile.links.email}`}
            aria-label={lang === 'es' ? 'Enviar correo electrónico' : 'Send email'}
            className="p-2 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Mail className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
