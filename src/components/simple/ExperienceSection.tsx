'use client';

import React from 'react';
import { Experience } from '@/lib/schemas';
import { useViewPreferences } from '@/context/ViewPreferencesContext';
import { Briefcase, Calendar, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/common/Badge';

interface ExperienceSectionProps {
  experience: Experience[];
}

export function ExperienceSection({ experience }: ExperienceSectionProps) {
  const { lang, t } = useViewPreferences();

  return (
    <section
      id="experience"
      className="py-12 md:py-16 border-b border-slate-200/80 dark:border-slate-800/80"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 mb-2">
          <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {lang === 'es' ? 'Experiencia Laboral' : 'Work Experience'}
          </h2>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
          {lang === 'es'
            ? 'Trayectoria profesional en desarrollo de software y proyectos técnicos.'
            : 'Professional background in software engineering and technical projects.'}
        </p>

        <div className="space-y-8 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {experience.map((item) => {
            const endDateDisplay = item.isCurrent
              ? lang === 'es'
                ? 'Actualidad'
                : 'Present'
              : t(item.endDate);

            return (
              <div key={item.id} className="relative pl-9 sm:pl-10">
                {/* Timeline node */}
                <span className="absolute left-1.5 top-1.5 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-blue-600 bg-white dark:bg-slate-900"></span>

                <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-300 dark:hover:border-blue-800 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {t(item.role)}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {t(item.startDate)} — {endDateDisplay}
                      </span>
                    </div>
                  </div>

                  <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-3">
                    {item.company}
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                    {t(item.description)}
                  </p>

                  {/* Achievements */}
                  {item.achievements.length > 0 && (
                    <div className="mb-4 space-y-2">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        {lang === 'es' ? 'Responsabilidades y Logros:' : 'Key Achievements:'}
                      </h4>
                      <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
                        {item.achievements.map((ach, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{t(ach)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    {item.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
