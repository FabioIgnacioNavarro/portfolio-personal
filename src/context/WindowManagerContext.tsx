'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import { LocalizedText } from '@/lib/schemas';

export type WindowId =
  | 'about'
  | 'experience'
  | 'projects'
  | 'project-detail'
  | 'skills'
  | 'education'
  | 'contact'
  | 'terminal';

export type WindowIconType =
  'user' | 'briefcase' | 'folder' | 'file-code' | 'cpu' | 'graduation-cap' | 'mail' | 'terminal';

export interface WindowState {
  id: WindowId;
  title: LocalizedText;
  icon: WindowIconType;
  isOpen: boolean;
  isMinimized: boolean;
  isMinimizing?: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  minSize: { width: number; height: number };
  activeProjectSlug?: string | null;
}

interface WindowManagerContextType {
  windows: Record<WindowId, WindowState>;
  activeWindowId: WindowId | null;
  openWindow: (id: WindowId, options?: { projectSlug?: string }) => void;
  closeWindow: (id: WindowId) => void;
  minimizeWindow: (id: WindowId) => void;
  maximizeWindow: (id: WindowId) => void;
  restoreWindow: (id: WindowId) => void;
  toggleMaximize: (id: WindowId) => void;
  focusWindow: (id: WindowId) => void;
  updatePosition: (id: WindowId, pos: { x: number; y: number }) => void;
  updateSize: (
    id: WindowId,
    size: { width: number; height: number },
    pos?: { x: number; y: number },
  ) => void;
}

const DEFAULT_WINDOWS: Record<WindowId, WindowState> = {
  about: {
    id: 'about',
    title: { es: 'Sobre mí — Fabio Ignacio Navarro', en: 'About Me — Fabio Ignacio Navarro' },
    icon: 'user',
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    zIndex: 10,
    position: { x: 230, y: 30 },
    size: { width: 580, height: 460 },
    minSize: { width: 360, height: 320 },
  },
  projects: {
    id: 'projects',
    title: { es: 'Explorador: Proyectos', en: 'Explorer: Projects' },
    icon: 'folder',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 9,
    position: { x: 120, y: 70 },
    size: { width: 640, height: 420 },
    minSize: { width: 380, height: 280 },
  },
  'project-detail': {
    id: 'project-detail',
    title: { es: 'Detalle de Proyecto', en: 'Project Detail' },
    icon: 'file-code',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 11,
    position: { x: 160, y: 90 },
    size: { width: 700, height: 500 },
    minSize: { width: 400, height: 320 },
    activeProjectSlug: null,
  },
  experience: {
    id: 'experience',
    title: { es: 'Experiencia Laboral', en: 'Work Experience' },
    icon: 'briefcase',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 8,
    position: { x: 90, y: 60 },
    size: { width: 620, height: 480 },
    minSize: { width: 360, height: 300 },
  },
  skills: {
    id: 'skills',
    title: { es: 'Habilidades & Tecnologías', en: 'Skills & Technologies' },
    icon: 'cpu',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 7,
    position: { x: 140, y: 80 },
    size: { width: 600, height: 440 },
    minSize: { width: 360, height: 280 },
  },
  education: {
    id: 'education',
    title: { es: 'Educación & Certificaciones', en: 'Education & Certifications' },
    icon: 'graduation-cap',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 6,
    position: { x: 110, y: 70 },
    size: { width: 600, height: 450 },
    minSize: { width: 360, height: 280 },
  },
  contact: {
    id: 'contact',
    title: { es: 'Contacto Directo', en: 'Direct Contact' },
    icon: 'mail',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 5,
    position: { x: 180, y: 100 },
    size: { width: 520, height: 400 },
    minSize: { width: 340, height: 280 },
  },
  terminal: {
    id: 'terminal',
    title: { es: 'Terminal — fabio@portfolio', en: 'Terminal — fabio@portfolio' },
    icon: 'terminal',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 12,
    position: { x: 200, y: 120 },
    size: { width: 640, height: 400 },
    minSize: { width: 380, height: 260 },
  },
};

const WindowManagerContext = createContext<WindowManagerContextType | undefined>(undefined);

export function WindowManagerProvider({ children }: { children: React.ReactNode }) {
  const [windows, setWindows] = useState<Record<WindowId, WindowState>>(DEFAULT_WINDOWS);
  const [activeWindowId, setActiveWindowId] = useState<WindowId | null>('about');
  const highestZIndexRef = useRef(15);

  // Ajustes responsivos al montar en el cliente
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setWindows((prev) => ({
        ...prev,
        about: {
          ...prev.about,
          isOpen: false,
          position: { x: 10, y: 10 },
          size: { width: window.innerWidth - 20, height: window.innerHeight - 80 },
        },
      }));
      setActiveWindowId(null);
    }
  }, []);

  const focusWindow = useCallback((id: WindowId) => {
    setActiveWindowId((prevActive) => {
      if (prevActive === id) return prevActive;
      highestZIndexRef.current += 1;
      const nextZ = highestZIndexRef.current;
      setWindows((prevWindows) => {
        if (!prevWindows[id]) return prevWindows;
        return {
          ...prevWindows,
          [id]: {
            ...prevWindows[id],
            zIndex: nextZ,
            isMinimized: false,
            isMinimizing: false,
          },
        };
      });
      return id;
    });
  }, []);

  const openWindow = useCallback((id: WindowId, options?: { projectSlug?: string }) => {
    highestZIndexRef.current += 1;
    const nextZ = highestZIndexRef.current;
    setWindows((prevWindows) => {
      const current = prevWindows[id];
      if (!current) return prevWindows;

      return {
        ...prevWindows,
        [id]: {
          ...current,
          isOpen: true,
          isMinimized: false,
          isMinimizing: false,
          zIndex: nextZ,
          activeProjectSlug: options?.projectSlug ?? current.activeProjectSlug,
        },
      };
    });
    setActiveWindowId(id);
  }, []);

  const closeWindow = useCallback(
    (id: WindowId) => {
      setWindows((prev) => {
        const current = prev[id];
        if (!current) return prev;
        return {
          ...prev,
          [id]: {
            ...current,
            isOpen: false,
            isMinimized: false,
            isMinimizing: false,
            isMaximized: false,
          },
        };
      });
      if (activeWindowId === id) {
        // Limpiar el foco activo al cerrar la ventana actual
        setActiveWindowId(null);
      }
    },
    [activeWindowId],
  );

  const minimizeWindow = useCallback(
    (id: WindowId) => {
      setWindows((prev) => {
        const current = prev[id];
        if (!current || current.isMinimized || current.isMinimizing) return prev;
        return {
          ...prev,
          [id]: {
            ...current,
            isMinimizing: true,
          },
        };
      });

      if (activeWindowId === id) {
        setActiveWindowId(null);
      }

      setTimeout(() => {
        setWindows((prev) => {
          const current = prev[id];
          if (!current || !current.isMinimizing) return prev;
          return {
            ...prev,
            [id]: {
              ...current,
              isMinimized: true,
              isMinimizing: false,
            },
          };
        });
      }, 180);
    },
    [activeWindowId],
  );

  const maximizeWindow = useCallback((id: WindowId) => {
    setWindows((prev) => {
      const current = prev[id];
      if (!current) return prev;
      return {
        ...prev,
        [id]: {
          ...current,
          isMaximized: true,
        },
      };
    });
  }, []);

  const restoreWindow = useCallback((id: WindowId) => {
    setWindows((prev) => {
      const current = prev[id];
      if (!current) return prev;
      return {
        ...prev,
        [id]: {
          ...current,
          isMaximized: false,
          isMinimized: false,
          isMinimizing: false,
        },
      };
    });
  }, []);

  const toggleMaximize = useCallback((id: WindowId) => {
    setWindows((prev) => {
      const current = prev[id];
      if (!current) return prev;
      return {
        ...prev,
        [id]: {
          ...current,
          isMaximized: !current.isMaximized,
        },
      };
    });
  }, []);

  const updatePosition = useCallback((id: WindowId, pos: { x: number; y: number }) => {
    setWindows((prev) => {
      const current = prev[id];
      if (!current) return prev;
      return {
        ...prev,
        [id]: {
          ...current,
          position: pos,
        },
      };
    });
  }, []);

  const updateSize = useCallback(
    (id: WindowId, size: { width: number; height: number }, pos?: { x: number; y: number }) => {
      setWindows((prev) => {
        const current = prev[id];
        if (!current) return prev;
        return {
          ...prev,
          [id]: {
            ...current,
            size,
            position: pos ? pos : current.position,
          },
        };
      });
    },
    [],
  );

  const value = useMemo(
    () => ({
      windows,
      activeWindowId,
      openWindow,
      closeWindow,
      minimizeWindow,
      maximizeWindow,
      restoreWindow,
      toggleMaximize,
      focusWindow,
      updatePosition,
      updateSize,
    }),
    [
      windows,
      activeWindowId,
      openWindow,
      closeWindow,
      minimizeWindow,
      maximizeWindow,
      restoreWindow,
      toggleMaximize,
      focusWindow,
      updatePosition,
      updateSize,
    ],
  );

  return <WindowManagerContext.Provider value={value}>{children}</WindowManagerContext.Provider>;
}

export function useWindowManager() {
  const context = useContext(WindowManagerContext);
  if (!context) {
    throw new Error('useWindowManager must be used within a WindowManagerProvider');
  }
  return context;
}
