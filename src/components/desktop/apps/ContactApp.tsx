'use client';

import React, { useState } from 'react';
import { Profile } from '@/lib/schemas';
import { useViewPreferences } from '@/context/ViewPreferencesContext';
import { Mail, Copy, Check, Download, ArrowUpRight } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/common/Icons';
import { copyTextToClipboard } from '@/lib/clipboard';
import { WindowPathBar } from './WindowPathBar';

export function ContactApp({ profile }: { profile: Profile }) {
  const { lang } = useViewPreferences();
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  const copyEmail = async () => {
    const ok = await copyTextToClipboard(profile.links.email);
    setCopyStatus(ok ? 'copied' : 'error');
    setTimeout(() => setCopyStatus('idle'), 2200);
  };

  const cvHref = lang === 'es' ? profile.links.cvUrl.es : profile.links.cvUrl.en;

  return (
    <div className="space-y-4">
      <WindowPathBar
        path="~/portfolio/contact.vcf"
        icon={<Mail className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
        meta="vCard"
      />
      <div className="space-y-6 max-w-lg mx-auto text-center py-4">
        <div className="w-12 h-12 rounded-full bg-blue-950/60 text-blue-400 flex items-center justify-center mx-auto mb-2">
          <Mail className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-white mb-1">
            {lang === 'es' ? 'Contacto Profesional' : 'Professional Contact'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            {lang === 'es'
              ? 'Disponible para nuevos desafíos como desarrollador full stack o backend.'
              : 'Available for full-stack or backend engineering positions.'}
          </p>
        </div>

        {/* Acción para copiar correo electrónico */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-mono text-xs font-semibold text-slate-200 truncate">
            {profile.links.email}
          </span>
          <button
            type="button"
            onClick={copyEmail}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors shrink-0 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            {copyStatus === 'copied' ? (
              <Check className="w-3.5 h-3.5 text-emerald-200" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>
              {copyStatus === 'copied'
                ? lang === 'es'
                  ? '¡Copiado!'
                  : 'Copied!'
                : copyStatus === 'error'
                  ? lang === 'es'
                    ? 'No se pudo copiar'
                    : 'Copy unavailable'
                  : lang === 'es'
                    ? 'Copiar email'
                    : 'Copy email'}
            </span>
          </button>
        </div>

        {/* Botones de redes y descarga de CV */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <LinkedinIcon className="w-4 h-4 text-blue-500" />
            <span>LinkedIn</span>
            <ArrowUpRight className="w-3 h-3 text-slate-400" />
          </a>

          <a
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <GithubIcon className="w-4 h-4" />
            <span>GitHub</span>
            <ArrowUpRight className="w-3 h-3 text-slate-400" />
          </a>

          <a
            href={cvHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <Download className="w-4 h-4 text-blue-500" />
            <span>{lang === 'es' ? 'Descargar CV' : 'Download CV'}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
