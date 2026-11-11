'use client';

import React from 'react';
import { PortfolioContent } from '@/lib/content';
import { WindowManagerProvider } from '@/context/WindowManagerContext';
import { DesktopView } from '@/components/desktop/DesktopView';

interface DesktopWorkspaceProps {
  content: PortfolioContent;
}

// Agrupa el gestor de ventanas y el escritorio para habilitar code splitting bajo demanda
export function DesktopWorkspace({ content }: DesktopWorkspaceProps) {
  return (
    <WindowManagerProvider>
      <DesktopView content={content} />
    </WindowManagerProvider>
  );
}
