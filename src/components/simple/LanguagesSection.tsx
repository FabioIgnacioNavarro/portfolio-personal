'use client';

import React from 'react';
import { Language } from '@/lib/schemas';
import { useViewPreferences } from '@/context/ViewPreferencesContext';
import { Languages } from 'lucide-react';
import { Badge } from '@/components/common/Badge';

interface LanguagesSectionProps {
  languages: Language[];
}

export function LanguagesSection({ languages }: LanguagesSectionProps) {
  const { lang, t } = useViewPreferences();

  return (
    <section
      id="languages"
      className="py-12 md:py-16 border-b border-slate-200/80 dark:border-slate-800/80"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 mb-2">
          <Languages className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {lang === 'es' ? 'Idiomas' : 'Languages'}
          </h2>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          {lang === 'es'
            ? 'Capacidades de comunicación técnica y colaboración multicultural.'
            : 'Technical communication and cross-border collaborative capabilities.'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {languages.map((l) => (
            <div
              key={l.id}
              className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {t(l.language)}
                </h3>
                <Badge variant={l.id === 'es' ? 'primary' : 'accent'}>{t(l.proficiency)}</Badge>
              </div>

              {l.details && (
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t(l.details)}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
