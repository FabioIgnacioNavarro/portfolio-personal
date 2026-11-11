'use client';

import React from 'react';
import { Education, Certification } from '@/lib/schemas';
import { useViewPreferences } from '@/context/ViewPreferencesContext';
import { GraduationCap, Award, Calendar } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { SectionPanel } from './SectionPanel';

interface EducationSectionProps {
  education: Education[];
  certifications: Certification[];
}

// Única fuente de verdad: lee directamente desde content/education.json mediante props
export function EducationSection({ education, certifications }: EducationSectionProps) {
  const { lang, t } = useViewPreferences();

  const getStatusBadge = (status: 'in-progress' | 'paused' | 'completed') => {
    switch (status) {
      case 'in-progress':
        return (
          <Badge variant="warning">
            {lang === 'es' ? 'En curso / Etapa final' : 'In Progress / Final Stage'}
          </Badge>
        );
      case 'paused':
        return <Badge variant="outline">{lang === 'es' ? 'En pausa' : 'Paused'}</Badge>;
      case 'completed':
        return <Badge variant="primary">{lang === 'es' ? 'Completado' : 'Completed'}</Badge>;
    }
  };

  return (
    <SectionPanel id="education">
      {/* Subsección de Educación */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-2">
          <GraduationCap className="w-5 h-5 text-blue-400" />
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {lang === 'es' ? 'Educación y Formación' : 'Education'}
          </h2>
        </div>
        <p className="text-sm text-slate-400 mb-6">
          {lang === 'es'
            ? 'Formación académica en ciencias de la computación y lenguas.'
            : 'Academic training in computer science and language proficiency.'}
        </p>

        <div className="space-y-4">
          {education.map((item) => (
            <div
              key={item.id}
              className="bg-slate-950/75 p-5 rounded-xl border border-slate-800/90 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {t(item.degree)}
                </h3>
                <div className="flex items-center gap-2">
                  {getStatusBadge(item.status)}
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {t(item.startDate)} {item.endDate ? `— ${t(item.endDate)}` : ''}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
                {item.institution}
              </div>

              {item.description && (
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t(item.description)}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Subsección de Certificaciones */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Award className="w-5 h-5 text-amber-500" />
          <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {lang === 'es' ? 'Certificaciones' : 'Certifications'}
          </h3>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          {lang === 'es'
            ? 'Cursos de especialización y certificaciones de competencia.'
            : 'Specialization courses and certified credentials.'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="bg-slate-950/75 p-5 rounded-xl border border-slate-800/90 shadow-sm flex flex-col justify-between"
            >
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  {t(cert.name)}
                </h4>
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  {cert.issuer} · {cert.issueDate}
                </div>
              </div>

              {cert.credentialUrl && cert.credentialUrl.trim() !== '' && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  <span>{lang === 'es' ? 'Verificar credencial' : 'Verify credential'}</span>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </SectionPanel>
  );
}
