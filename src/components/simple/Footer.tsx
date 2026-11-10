'use client';

import React from 'react';
import { useViewPreferences } from '@/context/ViewPreferencesContext';

export function Footer() {
  const { lang } = useViewPreferences();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 py-8 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div>
          © {year} Fabio Ignacio Navarro.{' '}
          {lang === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
        </div>
        <div className="flex items-center gap-4">
          <span>Next.js 15 · TypeScript · Tailwind CSS · Zod</span>
        </div>
      </div>
    </footer>
  );
}
