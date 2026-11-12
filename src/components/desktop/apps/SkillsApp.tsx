'use client';

import React from 'react';
import { SkillCategory } from '@/lib/schemas';
import { resolveLocalizedText } from '@/lib/schemas/common';
import { useViewPreferences } from '@/context/ViewPreferencesContext';
import { Badge } from '@/components/common/Badge';
import { Cpu } from 'lucide-react';
import { WindowPathBar } from './WindowPathBar';

export function SkillsApp({ skills }: { skills: SkillCategory[] }) {
  const { lang, t } = useViewPreferences();

  return (
    <div className="space-y-4">
      <WindowPathBar
        path="~/portfolio/skills/"
        icon={<Cpu className="w-3.5 h-3.5 text-purple-500 shrink-0" />}
        meta={`${skills.length} ${lang === 'es' ? 'categorías' : 'categories'}`}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {skills.map((category) => (
          <div
            key={category.id}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs"
          >
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 pb-2 mb-3 border-b border-slate-100 dark:border-slate-800">
              {t(category.category)}
            </h4>

            <div className="flex flex-wrap gap-1.5">
              {category.skills.map((s) => (
                <Badge
                  key={resolveLocalizedText(s.name, 'en')}
                  variant={s.highlight ? 'accent' : 'secondary'}
                  className={s.highlight ? 'font-semibold' : ''}
                >
                  {t(s.name)}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
