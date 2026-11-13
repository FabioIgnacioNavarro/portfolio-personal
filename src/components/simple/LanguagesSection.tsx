'use client';

import React from 'react';
import { Language } from '@/lib/schemas';
import { useViewPreferences } from '@/context/ViewPreferencesContext';
import { Languages } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { SectionPanel } from './SectionPanel';

interface LanguagesSectionProps {
  languages: Language[];
}

export function LanguagesSection({ languages }: LanguagesSectionProps) {
  const { lang, t } = useViewPreferences();

  return (
    <SectionPanel id="languages">
      <div className="flex items-center gap-2 mb-2">
        <Languages className="w-5 h-5 text-blue-400" />
        <h2 className="text-2xl font-bold tracking-tight text-white">
          {lang === 'es' ? 'Idiomas' : 'Languages'}
        </h2>
      </div>
      <p className="text-sm text-slate-400 mb-6">
        {lang === 'es'
          ? 'Capacidades de comunicación técnica y colaboración multicultural.'
          : 'Technical communication and cross-border collaborative capabilities.'}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {languages.map((l) => (
          <div
            key={l.id}
            className="bg-slate-900/70 p-5 rounded-xl border border-slate-800/90 shadow-sm"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <h3 className="text-base font-bold text-white">{t(l.language)}</h3>
              <Badge variant={l.id === 'es' ? 'primary' : 'accent'}>{t(l.proficiency)}</Badge>
            </div>

            {l.details && (
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{t(l.details)}</p>
            )}
          </div>
        ))}
      </div>
    </SectionPanel>
  );
}
