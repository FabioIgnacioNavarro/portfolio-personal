'use client';

import React, { useEffect } from 'react';
import { WindowState, useWindowManager } from '@/context/WindowManagerContext';
import { useViewPreferences } from '@/context/ViewPreferencesContext';
import { useDraggable } from '@/hooks/useDraggable';
import { useResizable, ResizeDirection } from '@/hooks/useResizable';
import { Minus, Square, Copy, X } from 'lucide-react';

interface WindowProps {
  windowState: WindowState;
  iconNode?: React.ReactNode;
  children: React.ReactNode;
}

export function Window({ windowState, iconNode, children }: WindowProps) {
  const {
    id,
    title,
    isMaximized,
    isMinimized,
    isMinimizing,
    isOpen,
    zIndex,
    position,
    size,
    minSize,
  } = windowState;
  const {
    focusWindow,
    closeWindow,
    minimizeWindow,
    toggleMaximize,
    updatePosition,
    updateSize,
    activeWindowId,
  } = useWindowManager();
  const { t, lang } = useViewPreferences();

  const isActive = activeWindowId === id;

  // Permite cerrar la ventana activa con Escape aunque el foco esté en barra de título o contenido
  useEffect(() => {
    if (!isOpen || isMinimized || !isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeWindow(id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [id, isOpen, isMinimized, isActive, closeWindow]);

  // Hook para arrastrar la ventana
  const {
    handlePointerDown,
    handlePointerMove: onDragMove,
    handlePointerUp: onDragUp,
    handleDoubleClick,
  } = useDraggable({
    position,
    isMaximized,
    onPositionChange: (newPos) => updatePosition(id, newPos),
    onMaximizeToggle: () => toggleMaximize(id),
  });

  // Hook para redimensionar la ventana
  const {
    startResize,
    handlePointerMove: onResizeMove,
    handlePointerUp: onResizeUp,
  } = useResizable({
    position,
    size,
    minSize,
    isMaximized,
    onResize: (newSize, newPos) => updateSize(id, newSize, newPos),
  });

  if (!isOpen || (isMinimized && !isMinimizing)) return null;

  const resizeHandles: ResizeDirection[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];

  const getResizeCursor = (dir: ResizeDirection) => {
    switch (dir) {
      case 'n':
      case 's':
        return 'cursor-ns-resize';
      case 'e':
      case 'w':
        return 'cursor-ew-resize';
      case 'ne':
      case 'sw':
        return 'cursor-nesw-resize';
      case 'nw':
      case 'se':
        return 'cursor-nwse-resize';
    }
  };

  const getHandleStyle = (dir: ResizeDirection): string => {
    switch (dir) {
      case 'n':
        return 'top-0 left-2 right-2 h-1.5 -translate-y-1/2';
      case 's':
        return 'bottom-0 left-2 right-2 h-1.5 translate-y-1/2';
      case 'w':
        return 'left-0 top-2 bottom-2 w-1.5 -translate-x-1/2';
      case 'e':
        return 'right-0 top-2 bottom-2 w-1.5 translate-x-1/2';
      case 'nw':
        return 'top-0 left-0 w-3 h-3 -translate-x-1/2 -translate-y-1/2';
      case 'ne':
        return 'top-0 right-0 w-3 h-3 translate-x-1/2 -translate-y-1/2';
      case 'sw':
        return 'bottom-0 left-0 w-3 h-3 -translate-x-1/2 translate-y-1/2';
      case 'se':
        return 'bottom-0 right-0 w-3 h-3 translate-x-1/2 translate-y-1/2';
    }
  };

  return (
    <div
      role="dialog"
      aria-label={t(title)}
      tabIndex={-1}
      onPointerDown={() => focusWindow(id)}
      style={
        isMaximized
          ? {
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 48, // Espacio reservado para la barra de tareas
              zIndex,
            }
          : {
              position: 'absolute',
              transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
              width: size.width,
              height: size.height,
              zIndex,
            }
      }
      className="select-none outline-none"
    >
      {/* Marco interior animado de la ventana */}
      <div
        className={`w-full h-full flex flex-col bg-white dark:bg-slate-900 border ${
          isMaximized ? 'rounded-none border-0' : 'rounded-xl shadow-2xl'
        } ${
          isActive
            ? 'border-blue-500/70 dark:border-blue-400/60 shadow-blue-900/20 ring-1 ring-blue-500/40'
            : 'border-slate-300 dark:border-slate-800 opacity-95'
        } ${
          isMinimizing
            ? 'animate-window-minimize pointer-events-none'
            : 'animate-window-open'
        }`}
      >
        {/* Barra de título */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={onDragMove}
          onPointerUp={onDragUp}
          onDoubleClick={handleDoubleClick}
          className={`h-10 px-3 flex items-center justify-between border-b cursor-grab active:cursor-grabbing transition-colors shrink-0 ${
            isMaximized ? 'rounded-none' : 'rounded-t-xl'
          } ${
            isActive
              ? 'bg-slate-100 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700'
              : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
          }`}
        >
          {/* Izquierda: Ícono y título */}
          <div className="flex items-center gap-2 overflow-hidden">
            {iconNode && (
              <span className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400">{iconNode}</span>
            )}
            <span className="text-xs sm:text-sm font-semibold truncate text-slate-800 dark:text-slate-100">
              {t(title)}
            </span>
          </div>

          {/* Derecha: Controles de ventana */}
          <div className="flex items-center gap-1 shrink-0 ml-2">
            {/* Minimizar */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                minimizeWindow(id);
              }}
              aria-label={lang === 'es' ? 'Minimizar ventana' : 'Minimize window'}
              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-700 text-slate-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            {/* Maximizar / Restaurar */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleMaximize(id);
              }}
              aria-label={
                isMaximized
                  ? lang === 'es'
                    ? 'Restaurar ventana'
                    : 'Restore window'
                  : lang === 'es'
                    ? 'Maximizar ventana'
                    : 'Maximize window'
              }
              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-700 text-slate-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              {isMaximized ? <Copy className="w-3 h-3" /> : <Square className="w-3 h-3" />}
            </button>

            {/* Cerrar */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                closeWindow(id);
              }}
              aria-label={lang === 'es' ? 'Cerrar ventana' : 'Close window'}
              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-rose-500 hover:text-white text-slate-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Cuerpo de la ventana */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 select-text overscroll-contain">
          {children}
        </div>
      </div>

      {/* Controladores de redimensionamiento (8 direcciones) */}
      {!isMaximized &&
        !isMinimizing &&
        resizeHandles.map((dir) => (
          <div
            key={dir}
            onPointerDown={startResize(dir)}
            onPointerMove={onResizeMove}
            onPointerUp={onResizeUp}
            className={`absolute z-20 ${getHandleStyle(dir)} ${getResizeCursor(dir)}`}
            aria-hidden="true"
          />
        ))}
    </div>
  );
}
