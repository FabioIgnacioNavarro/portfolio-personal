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
            className="p-4 rounded-xl border border-slate-800 bg-slate-900 shadow-xs"
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 pb-2 mb-3 border-b border-slate-800">
              {t(category.category)}
            </h3>

            <div className="flex flex-wrap gap-1.5">
              {category.skills.map((s) =>
                s.highlight ? (
                  <Badge
                    key={resolveLocalizedText(s.name, 'en')}
                    variant="accent"
                    className="font-semibold"
                  >
                    {t(s.name)}
                  </Badge>
                ) : (
                  <span
                    key={resolveLocalizedText(s.name, 'en')}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium border border-slate-800 bg-slate-950/70 text-slate-300"
                  >
                    {t(s.name)}
                  </span>
                ),
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
