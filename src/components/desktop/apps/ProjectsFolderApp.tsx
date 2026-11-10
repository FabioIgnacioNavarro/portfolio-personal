'use client';

import React, { useState } from 'react';
import { Project } from '@/lib/schemas';
import { useWindowManager } from '@/context/WindowManagerContext';
import { useViewPreferences } from '@/context/ViewPreferencesContext';
import { FileCode, FolderOpen, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/common/Badge';

export function ProjectsFolderApp({ projects }: { projects: Project[] }) {
  const { openWindow } = useWindowManager();
  const { lang, t } = useViewPreferences();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleOpenFile = (slug: string) => {
    openWindow('project-detail', { projectSlug: slug });
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Explorer Breadcrumb Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5 font-mono bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-200/60 dark:border-slate-700/60">
          <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
          <span>~/portfolio/projects/</span>
        </div>
        <span>
          {projects.length} {lang === 'es' ? 'archivos' : 'files'}
        </span>
      </div>

      {/* Explorer Files Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
        {projects.map((p) => {
          const isSelected = selectedId === p.id;
          const fileName = `${p.id}.case-study.md`;

          return (
            <div
              key={p.id}
              tabIndex={0}
              onClick={() => setSelectedId(p.id)}
              onDoubleClick={() => handleOpenFile(p.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleOpenFile(p.id);
              }}
              className={`p-4 rounded-xl border cursor-pointer select-none transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-400 ring-1 ring-blue-400'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-blue-500" />
                    <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                      {fileName}
                    </span>
                  </div>
                  <Badge
                    variant={p.status === 'completed' ? 'primary' : 'warning'}
                    className="text-[10px]"
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

                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1.5 leading-snug">
                  {t(p.title)}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                  {t(p.summary)}
                </p>

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

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">
                  {lang === 'es' ? 'Doble clic para abrir' : 'Double click to read'}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenFile(p.id);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <span>{lang === 'es' ? 'Abrir caso' : 'Open'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
