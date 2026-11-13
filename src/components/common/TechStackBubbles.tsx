'use client';

import React from 'react';
import { Code2 } from 'lucide-react';

interface TechStackBubblesProps {
  headline: string;
  variant?: 'hero' | 'desktop';
  className?: string;
}

// Separa la línea del stack principal en tecnologías individuales sin duplicar metadatos
export function parseStackTechnologies(headline: string): string[] {
  return headline
    .split(/[·/]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

// Renderiza el logotipo vectorial acorde a cada tecnología del stack principal
function TechLogo({ tech }: { tech: string }) {
  const key = tech.toLowerCase();

  switch (key) {
    case 'python':
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" aria-hidden="true">
          <path
            fill="#38BDF8"
            d="M11.9 2C7.6 2 8 3.9 8 3.9v2h4v.7H5.7S2.5 6.2 2.5 11.4c0 5.1 2.8 4.9 2.8 4.9H7v-2.4s-.1-2.8 2.8-2.8h4.7s2.7.1 2.7-2.6V4.7S17.6 2 11.9 2Zm-2 1.6a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Z"
          />
          <path
            fill="#FACC15"
            d="M12.1 22c4.3 0 3.9-1.9 3.9-1.9v-2h-4v-.7h6.3s3.2.4 3.2-4.8c0-5.1-2.8-4.9-2.8-4.9H17v2.4s.1 2.8-2.8 2.8H9.5s-2.7-.1-2.7 2.6v3.8S6.4 22 12.1 22Zm2-1.6a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8Z"
          />
        </svg>
      );

    case 'django':
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="5" fill="#10B981" fillOpacity="0.18" />
          <path
            fill="#34D399"
            d="M11.2 5.5h2.2v10.2c-1.1.2-2 .3-2.9.3-2.7 0-4.1-1.2-4.1-3.6 0-2.3 1.5-3.8 3.9-3.8.4 0 .7.1 1 .2V5.5Zm0 5.1c-.3-.1-.5-.1-.8-.1-1.2 0-1.9.7-1.9 2 0 1.3.7 1.9 1.9 1.9.3 0 .5 0 .8-.1v-3.7Zm4.4-5.1h2.2v2.3h-2.2V5.5Zm0 3.5h2.2v6.6c0 2.3-.5 3.3-2 4l-1.9-.9c1.2-.5 1.7-1.2 1.7-2.9V9Z"
          />
        </svg>
      );

    case 'typescript':
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="4" fill="#3178C6" />
          <path
            fill="#FFFFFF"
            d="M6.4 10.7h5.4v1.5h-1.8v6h-1.8v-6H6.4v-1.5Zm10.7 1.6c-.4-.2-.9-.3-1.4-.3-.7 0-1.1.3-1.1.7 0 .5.4.7 1.4 1.1 1.4.5 2.1 1.2 2.1 2.4 0 1.4-1.1 2.3-2.9 2.3-.8 0-1.7-.2-2.3-.6l.4-1.4c.5.3 1.2.5 1.8.5.7 0 1.2-.3 1.2-.8s-.4-.8-1.4-1.1c-1.3-.5-2-1.2-2-2.3 0-1.3 1-2.2 2.7-2.2.7 0 1.4.1 1.9.4l-.4 1.3Z"
          />
        </svg>
      );

    case 'react':
      return (
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4 shrink-0 text-sky-400"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="2.1" fill="currentColor" />
          <ellipse cx="12" cy="12" rx="9.5" ry="3.8" stroke="currentColor" strokeWidth="1.5" />
          <ellipse
            cx="12"
            cy="12"
            rx="9.5"
            ry="3.8"
            stroke="currentColor"
            strokeWidth="1.5"
            transform="rotate(60 12 12)"
          />
          <ellipse
            cx="12"
            cy="12"
            rx="9.5"
            ry="3.8"
            stroke="currentColor"
            strokeWidth="1.5"
            transform="rotate(120 12 12)"
          />
        </svg>
      );

    case 'node.js':
    case 'nodejs':
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" aria-hidden="true">
          <path
            fill="#4ADE80"
            fillOpacity="0.2"
            stroke="#4ADE80"
            strokeWidth="1.6"
            strokeLinejoin="round"
            d="M12 2.5 20.2 7.2v9.6L12 21.5l-8.2-4.7V7.2L12 2.5Z"
          />
          <path fill="#4ADE80" d="M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Z" />
        </svg>
      );

    case 'postgresql':
    case 'postgres':
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" aria-hidden="true">
          <path
            fill="none"
            stroke="#60A5FA"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.2 8.5c0-2.9-2.3-5-5.2-5-2.9 0-5.2 2.1-5.2 5 0 2.6 1 5.1 2.2 6.8.5.7.9 1.6 1 2.7l.2 2.1c.1.7.7 1.2 1.4 1.2.8 0 1.4-.6 1.4-1.4v-3.2c1.4-.4 2.7-1.6 3.4-3.2.5-1.1.8-3 .8-5Z"
          />
          <circle cx="10.2" cy="8.2" r="0.9" fill="#60A5FA" />
          <circle cx="13.8" cy="8.2" r="0.9" fill="#60A5FA" />
          <path
            fill="none"
            stroke="#60A5FA"
            strokeWidth="1.6"
            strokeLinecap="round"
            d="M17.2 9.4c1.3.1 2.3 1.1 2.3 2.5 0 1.4-1 2.5-2.3 2.7"
          />
        </svg>
      );

    case 'docker':
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" aria-hidden="true">
          <g fill="#38BDF8">
            <rect x="6" y="8" width="2.4" height="2.2" rx="0.4" />
            <rect x="9" y="8" width="2.4" height="2.2" rx="0.4" />
            <rect x="12" y="8" width="2.4" height="2.2" rx="0.4" />
            <rect x="9" y="5.2" width="2.4" height="2.2" rx="0.4" />
            <rect x="12" y="5.2" width="2.4" height="2.2" rx="0.4" />
            <path d="M21.4 11.7c-.5-.4-1.6-.6-2.4-.3-.2-.9-.9-1.6-1.5-2-.4.5-.7 1.3-.6 2 .1.6.4 1 .7 1.3H3.4c-.3 0-.5.2-.5.5 0 3.7 2.5 6.8 6.8 6.8 4.8 0 8.5-2.2 10.1-6.2.8 0 1.9-.2 2.4-1.1.2-.3-.3-.7-.8-1Z" />
          </g>
        </svg>
      );

    default:
      return <Code2 className="w-4 h-4 shrink-0 text-blue-400" aria-hidden="true" />;
  }
}

// Renderiza cada tecnología del stack principal en su propia burbuja con su logotipo
export function TechStackBubbles({
  headline,
  variant = 'hero',
  className = '',
}: TechStackBubblesProps) {
  const technologies = parseStackTechnologies(headline);

  const chipClass =
    variant === 'hero'
      ? 'inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/90 px-3.5 py-1.5 text-xs sm:text-[13px] font-medium text-slate-100 transition-colors hover:border-blue-500/50 hover:bg-slate-800/90'
      : 'inline-flex items-center gap-1.5 rounded-full border border-slate-700/80 bg-slate-800/85 px-3 py-1 text-xs font-medium text-slate-100 transition-colors hover:border-blue-500/50';

  return (
    <ul className={`flex flex-wrap items-center gap-2 ${className}`.trim()}>
      {technologies.map((tech) => (
        <li key={tech} className={chipClass}>
          <TechLogo tech={tech} />
          <span>{tech}</span>
        </li>
      ))}
    </ul>
  );
}
