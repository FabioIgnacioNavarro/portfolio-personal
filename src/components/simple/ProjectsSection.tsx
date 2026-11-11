'use client';

import React, { useState } from 'react';
import { Project } from '@/lib/schemas';
import { useViewPreferences } from '@/context/ViewPreferencesContext';
import { FolderGit2, BookOpen, ExternalLink } from 'lucide-react';
import { GithubIcon } from '@/components/common/Icons';
import { Badge } from '@/components/common/Badge';
import { ProjectCaseStudyModal } from './ProjectCaseStudyModal';

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const { lang, t } = useViewPreferences();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section
      id="projects"
      className="py-12 md:py-16 border-b border-slate-200/80 dark:border-slate-800/80"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 mb-2">
          <FolderGit2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {lang === 'es' ? 'Proyectos Destacados' : 'Featured Projects'}
          </h2>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
          {lang === 'es'
            ? 'Sistemas diseñados con foco en arquitectura, experiencia de usuario y mantenibilidad.'
            : 'Systems designed with a focus on architecture, UX, and long-term maintainability.'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Estado y rol en encabezado */}
                <div className="flex items-center justify-between gap-2 mb-3">
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

                {/* Título */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                  {t(project.title)}
                </h3>

                {/* Resumen */}
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {t(project.summary)}
                </p>

                {/* Etiquetas de tecnologías */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Acciones inferiores */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedProject(project)}
                  className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{lang === 'es' ? 'Ver caso de estudio' : 'Read case study'}</span>
                </button>

                <div className="flex items-center gap-2">
                  {project.links.repo && (
                    <a
                      href={project.links.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
                      aria-label={lang === 'es' ? 'Repositorio de código' : 'Code repository'}
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>{lang === 'es' ? 'Repositorio' : 'Repository'}</span>
                    </a>
                  )}
                  {project.links.demo && (
                    <a
                      href={project.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      aria-label={lang === 'es' ? 'Demo en vivo' : 'Live demo'}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de caso de estudio */}
      <ProjectCaseStudyModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  );
}
