'use client';

import React, { useState } from 'react';
import { useViewPreferences } from '@/context/ViewPreferencesContext';
import { ArrowLeft, FileText, FolderOpen, Trash2 } from 'lucide-react';
import { WindowPathBar } from './WindowPathBar';

const EASTER_EGG_FILENAME = 'easter_egg.txt';
const EASTER_EGG_CONTENT = {
  es: '¡Gracias por explorar hasta acá! Este escritorio interactivo nació para demostrar que incluso un portfolio estático puede sentirse como un sistema vivo, rápido y cuidado en cada detalle.',
  en: 'Thanks for exploring this far! This interactive desktop was built to show that even a static portfolio can feel like a fast, living system crafted down to the smallest detail.',
} as const;

// Explorador de archivos de la Papelera con un único documento de texto oculto
export function TrashApp() {
  const { lang } = useViewPreferences();
  const [isSelected, setIsSelected] = useState(false);
  const [isFileOpen, setIsFileOpen] = useState(false);

  const folderName = lang === 'es' ? 'Papelera' : 'Trash';
  const easterEggText = EASTER_EGG_CONTENT[lang];
  const fileSizeBytes = new TextEncoder().encode(easterEggText).length;

  const handleOpenFile = () => {
    setIsSelected(true);
    setIsFileOpen(true);
  };

  return (
    <div className="flex flex-col h-full gap-3">
      <WindowPathBar
        leadingAction={
          isFileOpen && (
            <button
              type="button"
              onClick={() => setIsFileOpen(false)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-slate-700/80 bg-slate-800/80 text-slate-200 hover:bg-slate-700 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              aria-label={lang === 'es' ? 'Volver a la Papelera' : 'Back to Trash'}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{lang === 'es' ? 'Volver' : 'Back'}</span>
            </button>
          )
        }
        path={isFileOpen ? `~/${folderName}/${EASTER_EGG_FILENAME}` : `~/${folderName}/`}
        icon={
          isFileOpen ? (
            <FileText className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          ) : (
            <Trash2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          )
        }
        meta={isFileOpen ? `${fileSizeBytes} B` : lang === 'es' ? '1 elemento' : '1 item'}
      />

      {isFileOpen ? (
        /* Visor de texto plano para el archivo easter_egg.txt */
        <div className="flex-1 flex flex-col rounded-xl border border-slate-800 bg-slate-950/90 overflow-hidden">
          <div className="flex-1 p-4 sm:p-5 font-mono text-sm leading-relaxed text-slate-200 select-text whitespace-pre-wrap">
            {easterEggText}
          </div>
          <div className="px-4 py-2 border-t border-slate-800/90 bg-slate-900/70 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>{EASTER_EGG_FILENAME}</span>
            <span>UTF-8 · {fileSizeBytes} B</span>
          </div>
        </div>
      ) : (
        /* Vista de listado común de explorador de archivos */
        <div
          className="flex-1 flex flex-col rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden"
          onClick={() => setIsSelected(false)}
        >
          {/* Encabezado de columnas */}
          <div className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_10rem_5rem] gap-3 px-4 py-2 border-b border-slate-800 bg-slate-900/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <span>{lang === 'es' ? 'Nombre' : 'Name'}</span>
            <span className="hidden sm:block">{lang === 'es' ? 'Tipo' : 'Type'}</span>
            <span className="text-right">{lang === 'es' ? 'Tamaño' : 'Size'}</span>
          </div>

          {/* Fila única: easter_egg.txt */}
          <div className="p-2 flex-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenFile();
              }}
              aria-label={EASTER_EGG_FILENAME}
              className={`w-full text-left grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_10rem_5rem] items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer select-none transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                isSelected
                  ? 'bg-blue-950/60 border border-blue-500/70 text-white'
                  : 'border border-transparent hover:bg-slate-800/70 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="font-mono text-xs sm:text-sm font-medium truncate">
                  {EASTER_EGG_FILENAME}
                </span>
              </div>
              <span className="hidden sm:block text-xs text-slate-400">
                {lang === 'es' ? 'Documento de texto' : 'Text Document'}
              </span>
              <span className="text-xs font-mono text-slate-400 text-right">{fileSizeBytes} B</span>
            </button>
          </div>

          {/* Barra inferior del explorador con acceso directo de apertura */}
          <div className="px-3.5 py-2 border-t border-slate-800/90 bg-slate-900/70 flex items-center justify-between gap-2 text-xs text-slate-400">
            <span className="truncate flex items-center gap-1.5">
              <FolderOpen className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              {lang === 'es' ? 'Haz clic para abrir el archivo' : 'Click to open file'}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenFile();
              }}
              className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium border border-slate-700 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              {lang === 'es' ? 'Abrir' : 'Open'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
