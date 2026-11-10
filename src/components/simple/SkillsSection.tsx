'use client';

import React from 'react';
import { SkillCategory } from '@/lib/schemas';
import { useViewPreferences } from '@/context/ViewPreferencesContext';
import { Cpu } from 'lucide-react';
import { Badge } from '@/components/common/Badge';

interface SkillsSectionProps {
  skills: SkillCategory[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  const { lang, t } = useViewPreferences();

  return (
    <section
      id="skills"
      className="py-12 md:py-16 border-b border-slate-200/80 dark:border-slate-800/80"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 mb-2">
          <Cpu className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {lang === 'es' ? 'Habilidades y Tecnologías' : 'Skills & Technologies'}
          </h2>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
          {lang === 'es'
            ? 'Herramientas y lenguajes aplicados en producción y proyectos de software.'
            : 'Tools and languages applied in production and engineering workflows.'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {skills.map((category) => (
            <div
              key={category.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm"
            >
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                {t(category.category)}
              </h3>

              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <Badge
                    key={skill.name}
                    variant={skill.highlight ? 'accent' : 'secondary'}
                    className={skill.highlight ? 'font-semibold' : ''}
                  >
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
