'use client';

import React from 'react';
import { Profile } from '@/lib/schemas';
import { useViewPreferences } from '@/context/ViewPreferencesContext';
import { MapPin, Mail, Download, ArrowUpRight, User } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/common/Icons';
import { BrandMark } from '@/components/common/BrandMark';
import { TechStackBubbles } from '@/components/common/TechStackBubbles';
import { WindowPathBar } from './WindowPathBar';

export function AboutApp({ profile }: { profile: Profile }) {
  const { lang, t } = useViewPreferences();
  const cvHref = lang === 'es' ? profile.links.cvUrl.es : profile.links.cvUrl.en;

  return (
    <div className="space-y-4">
      <WindowPathBar
        path="~/portfolio/about.md"
        icon={<User className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
        meta="README"
      />
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Tarjeta superior de perfil */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b border-slate-800">
          <BrandMark size="lg" />
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white">{profile.name}</h2>
            <p className="text-sm font-semibold text-blue-400">{t(profile.role)}</p>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5" />
              <span>{t(profile.location)}</span>
            </div>
          </div>
        </div>

        {/* Stack tecnológico principal */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            {lang === 'es' ? 'Stack Principal:' : 'Core Stack:'}
          </h3>
          <TechStackBubbles headline={t(profile.headline)} variant="desktop" />
        </div>

        {/* Biografía / Resumen */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            {lang === 'es' ? 'Resumen Profesional:' : 'Professional Summary:'}
          </h3>
          <p className="text-sm leading-relaxed text-slate-300">{t(profile.summary)}</p>
        </div>

        {/* Botones de acción rápida */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-3">
          <a
            href={cvHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{lang === 'es' ? 'Descargar CV' : 'Download CV'}</span>
          </a>

          <a
            href={`mailto:${profile.links.email}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 font-medium text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{profile.links.email}</span>
          </a>

          <a
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub</span>
            <ArrowUpRight className="w-3 h-3 text-slate-400" />
          </a>

          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <LinkedinIcon className="w-3.5 h-3.5" />
            <span>LinkedIn</span>
            <ArrowUpRight className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>
    </div>
  );
}
