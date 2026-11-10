'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { Project } from '@/lib/schemas';
import { useViewPreferences } from '@/context/ViewPreferencesContext';
import { renderMarkdown } from '@/lib/markdown';
import { X, ExternalLink, CheckCircle } from 'lucide-react';
import { GithubIcon } from '@/components/common/Icons';
import { Badge } from '@/components/common/Badge';

interface ProjectCaseStudyModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectCaseStudyModal({ project, onClose }: ProjectCaseStudyModalProps) {
  const { lang, t } = useViewPreferences();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  const caseStudyMd = project ? (lang === 'es' ? project.caseStudy.es : project.caseStudy.en) : '';
  const renderedHtml = useMemo(() => renderMarkdown(caseStudyMd), [caseStudyMd]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
    >
      {/* High-performance darkened backdrop - separated from dialog to prevent scroll repaints */}
      <div
        className="fixed inset-0 bg-slate-950/75 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 bg-white dark:bg-slate-900 w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-modal-open"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={project.status === 'completed' ? 'primary' : 'warning'}>
                {project.status === 'completed'
                  ? lang === 'es'
                    ? 'Completado'
                    : 'Completed'
                  : lang === 'es'
                    ? 'En Desarrollo'
                    : 'In Progress'}
              </Badge>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {t(project.role)}
              </span>
            </div>
            <h3
              id="modal-project-title"
              className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white"
            >
              {t(project.title)}
            </h3>
          </div>

          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 overscroll-contain">
          {/* Summary */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 text-sm sm:text-base text-slate-700 dark:text-slate-300">
            {t(project.summary)}
          </div>

          {/* Tech stack */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              {lang === 'es' ? 'Tecnologías utilizadas:' : 'Technologies used:'}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Links if available */}
          {(project.links.repo || project.links.demo) && (
            <div className="flex items-center gap-3">
              {project.links.repo && (
                <a
                  href={project.links.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>{lang === 'es' ? 'Repositorio' : 'Repository'}</span>
                </a>
              )}
              {project.links.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{lang === 'es' ? 'Ver Demo' : 'Live Demo'}</span>
                </a>
              )}
            </div>
          )}

          {/* Rendered Case Study Markdown */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
            <h4 className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>
                {lang === 'es' ? 'Caso de Estudio de Arquitectura' : 'Architectural Case Study'}
              </span>
            </h4>
            <div
              className="prose dark:prose-invert max-w-none text-sm sm:text-base space-y-4 text-slate-700 dark:text-slate-300 [&>h3]:text-base [&>h3]:font-bold [&>h3]:text-slate-900 dark:[&>h3]:text-white [&>h3]:mt-6 [&>h3]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1.5 [&>p]:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-sm transition-colors"
          >
            {lang === 'es' ? 'Cerrar' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
