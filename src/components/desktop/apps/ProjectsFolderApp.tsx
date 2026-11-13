'use client';

import React, { useState } from 'react';
import { Project } from '@/lib/schemas';
import { useWindowManager } from '@/context/WindowManagerContext';
import { useViewPreferences } from '@/context/ViewPreferencesContext';
import { FileCode, FolderOpen, ArrowRight } from 'lucide-react';
import { GithubIcon } from '@/components/common/Icons';
import { Badge } from '@/components/common/Badge';
import { WindowPathBar } from './WindowPathBar';

export function ProjectsFolderApp({ projects }: { projects: Project[] }) {
  const { openWindow } = useWindowManager();
  const { lang, t } = useViewPreferences();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleOpenFile = (slug: string) => {
    openWindow('project-detail', { projectSlug: slug });
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <WindowPathBar
        path="~/portfolio/projects/"
        icon={<FolderOpen className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
        meta={`${projects.length} ${lang === 'es' ? 'archivos' : 'files'}`}
      />

      {/* Grilla de archivos del explorador */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
        {projects.map((p) => {
          const isSelected = selectedId === p.id;
          const fileName = `${p.id}.case-study.md`;

          return (
            <article
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              onDoubleClick={() => handleOpenFile(p.id)}
              className={`p-4 rounded-xl border select-none transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-blue-950/40 border-blue-400 ring-1 ring-blue-400'
                  : 'bg-slate-900 border-slate-800 hover:border-blue-700 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileCode className="w-4 h-4 text-blue-500 shrink-0" />
                    <span className="font-mono text-xs font-bold text-slate-200 truncate">
                      {fileName}
                    </span>
                  </div>
                  <Badge
                    variant={p.status === 'completed' ? 'primary' : 'warning'}
                    className="text-[10px] shrink-0"
                  >
                    {p.status === 'completed'
                      ? lang === 'es'
                        ? 'Completado'
                        : 'Done'
                      : lang === 'es'
                        ? 'En progreso'
                        : 'WIP'}
                  </Badge>
                </div>

                <h3 className="text-sm font-semibold text-white mb-1.5 leading-snug">
                  {t(p.title)}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 mb-3">{t(p.summary)}</p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {p.technologies.slice(0, 4).map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-[10px] py-0 px-1.5">
                      {tech}
                    </Badge>
                  ))}
                  {p.technologies.length > 4 && (
                    <span className="text-[10px] text-slate-400">+{p.technologies.length - 4}</span>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                {p.links.repo ? (
                  <a
                    href={p.links.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>{lang === 'es' ? 'Repositorio' : 'Repository'}</span>
                  </a>
                ) : (
                  <span className="text-[11px] text-slate-400 font-mono">Markdown</span>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenFile(p.id);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded"
                >
                  <span>{lang === 'es' ? 'Abrir caso' : 'Open'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
