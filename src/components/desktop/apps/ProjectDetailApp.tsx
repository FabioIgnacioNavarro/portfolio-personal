'use client';

import React from 'react';
import { Project } from '@/lib/schemas';
import { useViewPreferences } from '@/context/ViewPreferencesContext';
import { renderMarkdown } from '@/lib/markdown';
import { ExternalLink, CheckCircle, ArrowLeft } from 'lucide-react';
import { GithubIcon } from '@/components/common/Icons';
import { Badge } from '@/components/common/Badge';

interface ProjectDetailAppProps {
  projects: Project[];
  activeSlug?: string | null;
  onBackToFolder?: () => void;
}

export function ProjectDetailApp({ projects, activeSlug, onBackToFolder }: ProjectDetailAppProps) {
  const { lang, t } = useViewPreferences();

  const project = projects.find((p) => p.id === activeSlug) || projects[0];

  if (!project) return null;

  const caseStudyMd = lang === 'es' ? project.caseStudy.es : project.caseStudy.en;
  const renderedHtml = renderMarkdown(caseStudyMd);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Top action bar */}
      {onBackToFolder && (
        <button
          onClick={onBackToFolder}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{lang === 'es' ? 'Volver al explorador' : 'Back to projects folder'}</span>
        </button>
      )}

      {/* Header Info */}
      <div className="space-y-2 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Badge variant={project.status === 'completed' ? 'primary' : 'warning'}>
            {project.status === 'completed'
              ? lang === 'es'
                ? 'Completado'
                : 'Completed'
              : lang === 'es'
                ? 'En Desarrollo'
                : 'In Progress'}
          </Badge>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t(project.role)}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
          {t(project.title)}
        </h2>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {t(project.summary)}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {project.technologies.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>

        {/* Links */}
        {(project.links.repo || project.links.demo) && (
          <div className="flex items-center gap-3 pt-3">
            {project.links.repo && (
              <a
                href={project.links.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors shadow-xs"
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
                className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{lang === 'es' ? 'Demo en Vivo' : 'Live Demo'}</span>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Case Study Section */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>
            {lang === 'es' ? 'Caso de Estudio Arquitectónico' : 'Architectural Case Study'}
          </span>
        </h3>

        <div
          className="prose dark:prose-invert max-w-none text-sm leading-relaxed text-slate-700 dark:text-slate-300 space-y-4 [&>h3]:text-base [&>h3]:font-bold [&>h3]:text-slate-900 dark:[&>h3]:text-white [&>h3]:mt-6 [&>h3]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1.5"
          dangerouslySetInnerHTML={{ __html: renderedHtml }}
        />
      </div>
    </div>
  );
}
