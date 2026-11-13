'use client';

import React from 'react';
import { SkillCategory } from '@/lib/schemas';
import { resolveLocalizedText } from '@/lib/schemas/common';
import { useViewPreferences } from '@/context/ViewPreferencesContext';
import { Cpu } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { SectionPanel } from './SectionPanel';

interface SkillsSectionProps {
  skills: SkillCategory[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  const { lang, t } = useViewPreferences();

  return (
    <SectionPanel id="skills">
      <div className="flex items-center gap-2 mb-2">
        <Cpu className="w-5 h-5 text-blue-400" />
        <h2 className="text-2xl font-bold tracking-tight text-white">
          {lang === 'es' ? 'Habilidades y Tecnologías' : 'Skills & Technologies'}
        </h2>
      </div>
      <p className="text-sm text-slate-400 mb-8">
        {lang === 'es'
          ? 'Herramientas y lenguajes aplicados en producción y proyectos de software.'
          : 'Tools and languages applied in production and engineering workflows.'}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {skills.map((category) => (
          <div
            key={category.id}
            className="bg-slate-900/70 rounded-xl border border-slate-800/90 p-5"
          >
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4 pb-2 border-b border-slate-800">
              {t(category.category)}
            </h3>

            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) =>
                skill.highlight ? (
                  <Badge
                    key={resolveLocalizedText(skill.name, 'en')}
                    variant="accent"
                    className="font-semibold"
                  >
                    {t(skill.name)}
                  </Badge>
                ) : (
                  <span
                    key={resolveLocalizedText(skill.name, 'en')}
                    className="inline-flex items-center rounded-lg border border-slate-800 bg-slate-950/70 px-2.5 py-1 text-xs font-medium text-slate-300"
                  >
                    {t(skill.name)}
                  </span>
                ),
              )}
            </div>
          </div>
        ))}
      </div>
    </SectionPanel>
  );
}
