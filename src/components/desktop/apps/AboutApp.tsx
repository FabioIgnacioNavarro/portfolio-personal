'use client';

import React from 'react';
import { Profile } from '@/lib/schemas';
import { useViewPreferences } from '@/context/ViewPreferencesContext';
import { MapPin, Mail, Download, ArrowUpRight, User } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/common/Icons';
import { Badge } from '@/components/common/Badge';
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
            FN
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {profile.name}
              </h2>
              <Badge variant="accent" className="text-[10px] py-0.5">
                Argentina
              </Badge>
            </div>
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              {t(profile.role)}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <MapPin className="w-3.5 h-3.5" />
              <span>{t(profile.location)}</span>
            </div>
          </div>
        </div>

        {/* Stack tecnológico principal */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            {lang === 'es' ? 'Stack Principal:' : 'Core Stack:'}
          </h4>
          <div className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl font-mono text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60">
            {t(profile.headline)}
          </div>
        </div>

        {/* Biografía / Resumen */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            {lang === 'es' ? 'Resumen Profesional:' : 'Professional Summary:'}
          </h4>
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {t(profile.summary)}
          </p>
        </div>

        {/* Botones de acción rápida */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-3">
          <a
            href={cvHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{lang === 'es' ? 'Descargar CV' : 'Download CV'}</span>
          </a>

          <a
            href={`mailto:${profile.links.email}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium text-xs transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{profile.links.email}</span>
          </a>

          <a
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium text-xs transition-colors"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub</span>
            <ArrowUpRight className="w-3 h-3 text-slate-400" />
          </a>

          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium text-xs transition-colors"
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
