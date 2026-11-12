'use client';

import React from 'react';
import { Education, Certification } from '@/lib/schemas';
import { useViewPreferences } from '@/context/ViewPreferencesContext';
import { Calendar, Award, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/common/Badge';

export function EducationApp({
  education,
  certifications,
}: {
  education: Education[];
  certifications: Certification[];
}) {
  const { lang, t } = useViewPreferences();

  const getStatusBadge = (status: 'in-progress' | 'paused' | 'completed') => {
    switch (status) {
      case 'in-progress':
        return (
          <Badge variant="warning" className="text-[10px]">
            {lang === 'es' ? 'En curso / Etapa final' : 'In Progress / Final Stage'}
          </Badge>
        );
      case 'paused':
        return (
          <Badge variant="outline" className="text-[10px]">
            {lang === 'es' ? 'En pausa' : 'Paused'}
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="primary" className="text-[10px]">
            {lang === 'es' ? 'Completado' : 'Completed'}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Educación */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          {lang === 'es' ? 'Formación Académica' : 'Academic Background'}
        </h4>

        <div className="space-y-3">
          {education.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                  {t(item.degree)}
                </h5>
                <div className="flex items-center gap-2">
                  {getStatusBadge(item.status)}
                  <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {t(item.startDate)} {item.endDate ? `— ${t(item.endDate)}` : ''}
                    </span>
                  </span>
                </div>
              </div>

              <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
                {item.institution}
              </div>

              {item.description && (
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t(item.description)}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Certificaciones */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-500" />
          <span>{lang === 'es' ? 'Certificaciones Profesionales' : 'Certifications'}</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {certifications.map((c) => (
            <div
              key={c.id}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">{t(c.name)}</h5>
                  {c.status === 'in-progress' && (
                    <Badge variant="warning" className="text-[10px] shrink-0">
                      {lang === 'es' ? 'En progreso' : 'In progress'}
                    </Badge>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                  {c.issuer} · {t(c.issueDate)}
                </p>
              </div>

              {c.credentialUrl && c.credentialUrl.trim() !== '' && (
                <a
                  href={c.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <span>{lang === 'es' ? 'Ver credencial' : 'Verify'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
