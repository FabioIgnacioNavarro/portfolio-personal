'use client';

import React, { useRef } from 'react';
import { Profile } from '@/lib/schemas';
import { useViewPreferences } from '@/context/ViewPreferencesContext';
import { Mail, Download, MapPin, ArrowRight } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/common/Icons';
import { Badge } from '@/components/common/Badge';
import { TechStackBubbles } from '@/components/common/TechStackBubbles';
import { SectionPanel } from './SectionPanel';

interface HeroSectionProps {
  profile: Profile;
}

interface HeroActionButtonProps {
  href: string;
  variant?: 'primary' | 'secondary';
  external?: boolean;
  children: React.ReactNode;
}

// Botón con borde luminoso reactivo al puntero inspirado en Modo IA y adaptado a la paleta nocturna
function HeroActionButton({
  href,
  variant = 'secondary',
  external = false,
  children,
}: HeroActionButtonProps) {
  const linkRef = useRef<HTMLAnchorElement | null>(null);

  const updateSpotlightPosition = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const el = linkRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  const baseBorderClass = variant === 'primary' ? 'bg-blue-400/40' : 'bg-slate-700/90';
  const innerClassName =
    variant === 'primary'
      ? 'bg-gradient-to-b from-blue-600 to-blue-700 text-white group-hover:from-blue-500 group-hover:to-blue-600'
      : 'bg-slate-950/95 text-slate-100 group-hover:bg-slate-900';

  return (
    <a
      ref={linkRef}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      onPointerEnter={updateSpotlightPosition}
      onPointerMove={updateSpotlightPosition}
      className={`group relative inline-flex items-center justify-center overflow-hidden rounded-[10px] p-[2px] shadow-sm transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-[0_0_20px_-6px_rgba(56,189,248,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${baseBorderClass}`}
    >
      <span
        aria-hidden="true"
        className="ai-spotlight-layer pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
      />
      <span
        className={`relative z-10 inline-flex items-center gap-2 rounded-[8px] px-5 py-2.5 text-sm font-medium transition-colors ${innerClassName}`}
      >
        {children}
      </span>
    </a>
  );
}

export function HeroSection({ profile }: HeroSectionProps) {
  const { lang, t } = useViewPreferences();

  const cvHref = lang === 'es' ? profile.links.cvUrl.es : profile.links.cvUrl.en;

  return (
    <SectionPanel id="about" variant="surface" panelClassName="sm:p-10">
      {/* Etiqueta de disponibilidad */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
        <Badge variant="accent" className="py-1 px-3 text-xs whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block mr-1"></span>
          {lang === 'es'
            ? 'Disponible para nuevas oportunidades'
            : 'Available for new opportunities'}
        </Badge>
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <MapPin className="w-3.5 h-3.5" />
          <span>{t(profile.location)}</span>
        </div>
      </div>

      {/* Nombre y rol */}
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
        {profile.name}
      </h1>
      <p className="text-xl sm:text-2xl font-semibold text-blue-400 mb-4">{t(profile.role)}</p>

      {/* Stack tecnológico principal */}
      <TechStackBubbles headline={t(profile.headline)} variant="hero" className="mb-6" />

      {/* Resumen biográfico */}
      <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-3xl">
        {t(profile.summary)}
      </p>

      {/* Botones de acción principales */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8">
        <HeroActionButton href="#projects" variant="primary">
          <span>{lang === 'es' ? 'Ver proyectos' : 'View projects'}</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5" />
        </HeroActionButton>

        <HeroActionButton href={cvHref} external>
          <Download className="w-4 h-4" />
          <span>{lang === 'es' ? 'Descargar CV' : 'Download CV'}</span>
        </HeroActionButton>

        <HeroActionButton href={`mailto:${profile.links.email}`}>
          <Mail className="w-4 h-4" />
          <span>{lang === 'es' ? 'Contactar' : 'Contact me'}</span>
        </HeroActionButton>
      </div>

      {/* Redes sociales y enlaces de contacto (objetivos táctiles mínimos de 44×44px) */}
      <div className="flex items-center gap-2 text-slate-400">
        <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 mr-1">
          {lang === 'es' ? 'Redes & Enlaces:' : 'Links:'}
        </span>
        <a
          href={profile.links.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={lang === 'es' ? 'Perfil de GitHub' : 'GitHub profile'}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg hover:text-white hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <GithubIcon className="w-5 h-5" />
        </a>
        <a
          href={profile.links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={lang === 'es' ? 'Perfil de LinkedIn' : 'LinkedIn profile'}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg hover:text-blue-400 hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <LinkedinIcon className="w-5 h-5" />
        </a>
        <a
          href={`mailto:${profile.links.email}`}
          aria-label={lang === 'es' ? 'Enviar correo electrónico' : 'Send email'}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg hover:text-white hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <Mail className="w-5 h-5" />
        </a>
      </div>
    </SectionPanel>
  );
}
