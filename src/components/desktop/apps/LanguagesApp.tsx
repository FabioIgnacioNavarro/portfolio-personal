'use client';

import React from 'react';
import { Language } from '@/lib/schemas';
import { useViewPreferences } from '@/context/ViewPreferencesContext';
import { Languages } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { WindowPathBar } from './WindowPathBar';

// Ventana de idiomas en Modo Escritorio compartiendo content/languages.json
export function LanguagesApp({ languages }: { languages: Language[] }) {
  const { lang, t } = useViewPreferences();

  return (
    <div className="space-y-4">
      <WindowPathBar
        path="~/portfolio/languages/"
        icon={<Languages className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
        meta={`${languages.length} ${lang === 'es' ? 'idiomas' : 'languages'}`}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {languages.map((l) => (
          <div
            key={l.id}
            className="p-4 rounded-xl border border-slate-800 bg-slate-900 shadow-xs space-y-2"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-white">{t(l.language)}</h3>
              <Badge variant={l.id === 'es' ? 'primary' : 'accent'}>{t(l.proficiency)}</Badge>
            </div>
            {l.details && <p className="text-xs text-slate-300 leading-relaxed">{t(l.details)}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
