'use client';

import React from 'react';
import { Experience } from '@/lib/schemas';
import { useViewPreferences } from '@/context/ViewPreferencesContext';
import { Calendar, CheckCircle2, Briefcase } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { WindowPathBar } from './WindowPathBar';

export function ExperienceApp({ experience }: { experience: Experience[] }) {
  const { lang, t } = useViewPreferences();

  return (
    <div className="space-y-4">
      <WindowPathBar
        path="~/portfolio/experience/"
        icon={<Briefcase className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
        meta={`${experience.length} ${lang === 'es' ? 'registros' : 'entries'}`}
      />
      <div className="space-y-6">
        {experience.map((item) => {
          const endDateDisplay = item.isCurrent
            ? lang === 'es'
              ? 'Actualidad'
              : 'Present'
            : t(item.endDate);

          return (
            <div
              key={item.id}
              className="p-5 rounded-xl border border-slate-800 bg-slate-900 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <h3 className="text-base font-bold text-white">{t(item.role)}</h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {t(item.startDate)} — {endDateDisplay}
                  </span>
                </div>
              </div>

              <div className="text-sm font-semibold text-blue-400 mb-3">{t(item.company)}</div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                {t(item.description)}
              </p>

              {item.achievements.length > 0 && (
                <div className="mb-4 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {lang === 'es' ? 'Responsabilidades:' : 'Responsibilities:'}
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {item.achievements.map((ach, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{t(ach)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800">
                {item.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
