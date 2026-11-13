'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Project } from '@/lib/schemas';
import { useViewPreferences } from '@/context/ViewPreferencesContext';
import { renderMarkdown } from '@/lib/markdown';
import { X, ExternalLink, CheckCircle } from 'lucide-react';
import { GithubIcon } from '@/components/common/Icons';
import { Badge } from '@/components/common/Badge';
import { ProjectArchitecturePreview } from '@/components/common/ProjectArchitecturePreview';

interface ProjectCaseStudyModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectCaseStudyModal({ project, onClose }: ProjectCaseStudyModalProps) {
  const { lang, t } = useViewPreferences();
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (
            document.activeElement === first ||
            !modalRef.current.contains(document.activeElement)
          ) {
            e.preventDefault();
            last.focus();
          }
        } else if (
          document.activeElement === last ||
          !modalRef.current.contains(document.activeElement)
        ) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    if (project) {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      requestAnimationFrame(() => closeButtonRef.current?.focus());
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project]);

  const caseStudyMd = project ? (lang === 'es' ? project.caseStudy.es : project.caseStudy.en) : '';
  const renderedHtml = useMemo(() => renderMarkdown(caseStudyMd), [caseStudyMd]);

  if (!project || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
    >
      {/* Fondo oscurecido de alto rendimiento: renderizado por portal directo en body para no verse afectado por transforms ancestros */}
      <div
        className="fixed inset-0 bg-slate-950/80 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 bg-slate-900 w-full max-w-3xl max-h-[min(84dvh,760px)] rounded-2xl shadow-2xl border border-slate-800 flex flex-col overflow-hidden animate-modal-open"
      >
        {/* Encabezado fijo del modal */}
        <div className="shrink-0 p-4 sm:p-5 border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge
                variant={project.status === 'completed' ? 'primary' : 'warning'}
                className="whitespace-nowrap shrink-0"
              >
                {project.status === 'completed'
                  ? lang === 'es'
                    ? 'Completado'
                    : 'Completed'
                  : lang === 'es'
                    ? 'En Desarrollo'
                    : 'In Progress'}
              </Badge>
              <span className="text-xs text-slate-400 font-medium">{t(project.role)}</span>
            </div>
            <h2 id="modal-project-title" className="text-lg sm:text-2xl font-bold text-white">
              {t(project.title)}
            </h2>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={lang === 'es' ? 'Cerrar modal' : 'Close modal'}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo desplazable del modal acotado al alto de pantalla */}
        <div className="flex-1 min-h-0 p-4 sm:p-6 overflow-y-auto space-y-6 overscroll-contain">
          {/* Resumen */}
          <ProjectArchitecturePreview project={project} />

          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-800 text-sm sm:text-base text-slate-300">
            {t(project.summary)}
          </div>

          {/* Stack tecnológico */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              {lang === 'es' ? 'Tecnologías utilizadas:' : 'Technologies used:'}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Enlaces si están disponibles */}
          {(project.links.repo || project.links.demo) && (
            <div className="flex items-center gap-3">
              {project.links.repo && (
                <a
                  href={project.links.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg border border-slate-700 text-slate-200 hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
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
                  className="inline-flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{lang === 'es' ? 'Ver Demo' : 'Live Demo'}</span>
                </a>
              )}
            </div>
          )}

          {/* Caso de estudio renderizado desde Markdown */}
          <div className="border-t border-slate-800 pt-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400 mb-4 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>
                {lang === 'es' ? 'Caso de Estudio de Arquitectura' : 'Architectural Case Study'}
              </span>
            </h3>
            <div
              className="prose prose-invert max-w-none text-sm sm:text-base space-y-4 text-slate-300 [&>h3]:text-base [&>h3]:font-bold [&>h3]:text-white [&>h3]:mt-6 [&>h3]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1.5 [&>p]:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
          </div>
        </div>

        {/* Pie fijo del modal */}
        <div className="shrink-0 p-4 border-t border-slate-800 bg-slate-900/80 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {lang === 'es' ? 'Cerrar' : 'Close'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
