'use client';

import React, { useState } from 'react';
import { Profile } from '@/lib/schemas';
import { copyTextToClipboard } from '@/lib/clipboard';
import { useViewPreferences } from '@/context/ViewPreferencesContext';
import { Mail, Download, Copy, Check } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/common/Icons';
import { SectionPanel } from './SectionPanel';

interface ContactSectionProps {
  profile: Profile;
}

export function ContactSection({ profile }: ContactSectionProps) {
  const { lang } = useViewPreferences();
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');

  const copyEmail = async () => {
    const ok = await copyTextToClipboard(profile.links.email);
    setCopyState(ok ? 'copied' : 'error');
    setTimeout(() => setCopyState('idle'), 2400);
  };

  const cvHref = lang === 'es' ? profile.links.cvUrl.es : profile.links.cvUrl.en;

  return (
    <SectionPanel
      id="contact"
      variant="surface"
      panelClassName="bg-gradient-to-br from-slate-900/70 to-slate-800/50 sm:p-10 text-center"
    >
      <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
        {lang === 'es'
          ? '¿Conversamos sobre tu equipo o proyecto?'
          : 'Let’s talk about your team or project'}
      </h2>
      <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8">
        {lang === 'es'
          ? 'Estoy disponible para incorporarme como desarrollador full stack o backend (Python/Django, TypeScript, Node.js, React). ¡Escríbeme y coordinamos!'
          : 'I am available for full-stack or backend developer roles (Python/Django, TypeScript, Node.js, React). Feel free to reach out!'}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-8">
        <a
          href={`mailto:${profile.links.email}`}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          <Mail className="w-4 h-4" />
          <span>{lang === 'es' ? 'Enviar Correo' : 'Send Email'}</span>
        </a>

        <button
          type="button"
          onClick={copyEmail}
          className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 font-medium text-sm transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label={
            lang === 'es' ? 'Copiar correo electrónico al portapapeles' : 'Copy email to clipboard'
          }
        >
          {copyState === 'copied' ? (
            <Check className="w-4 h-4 text-emerald-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          <span>
            {copyState === 'copied'
              ? lang === 'es'
                ? '¡Copiado!'
                : 'Copied!'
              : copyState === 'error'
                ? lang === 'es'
                  ? 'No se pudo copiar'
                  : 'Copy unavailable'
                : profile.links.email}
          </span>
        </button>

        <a
          href={cvHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 font-medium text-sm transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <Download className="w-4 h-4" />
          <span>{lang === 'es' ? 'Descargar CV' : 'Download CV'}</span>
        </a>
      </div>

      <div className="flex items-center justify-center gap-4 pt-6 border-t border-slate-800 text-slate-400">
        <a
          href={profile.links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium hover:text-blue-400 transition-colors rounded-lg px-2.5 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <LinkedinIcon className="w-4 h-4" />
          <span>LinkedIn</span>
        </a>
        <a
          href={profile.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium hover:text-white transition-colors rounded-lg px-2.5 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <GithubIcon className="w-4 h-4" />
          <span>GitHub</span>
        </a>
      </div>
    </SectionPanel>
  );
}
