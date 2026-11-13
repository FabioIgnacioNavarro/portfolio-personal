'use client';

import React from 'react';
import Image from 'next/image';
import { Project } from '@/lib/schemas';
import { useViewPreferences } from '@/context/ViewPreferencesContext';

interface ProjectArchitecturePreviewProps {
  project: Project;
  compact?: boolean;
}

// Diagrama esquemático de arquitectura cuando el proyecto aún no cuenta con capturas finales
export function ProjectArchitecturePreview({
  project,
  compact = false,
}: ProjectArchitecturePreviewProps) {
  const { lang, t } = useViewPreferences();

  const label =
    lang === 'es' ? 'Diagrama de arquitectura del sistema' : 'System architecture diagram';

  if (project.screenshots.length > 0) {
    const firstShot = project.screenshots[0];
    return (
      <div
        className={`relative mb-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 ${
          compact ? 'h-36' : 'h-48 sm:h-56'
        }`}
      >
        <Image
          src={firstShot.src}
          alt={t(firstShot.alt)}
          fill
          sizes="(max-width: 768px) 100vw, 640px"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <figure
      aria-label={label}
      className={`overflow-hidden rounded-xl border border-slate-800/90 bg-slate-950/90 ${
        compact ? 'mb-4 p-3' : 'p-4'
      }`}
    >
      <div className="mb-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <span>{lang === 'es' ? 'Topología de arquitectura' : 'Architecture blueprint'}</span>
        <span className="text-sky-400">
          {project.id === 'realtime-travel-platform'
            ? 'Hexagonal · OTel'
            : project.id === 'comercial-management'
              ? 'Full Stack · Monorepo'
              : 'System Topology'}
        </span>
      </div>

      {project.id === 'realtime-travel-platform' ? (
        <svg viewBox="0 0 420 112" className="w-full h-auto" role="img" aria-label={label}>
          {/* Líneas de flujo */}
          <path
            d="M96 42h24M216 42h24M336 42h14v44H170v-8"
            stroke="#334155"
            strokeWidth="1.5"
            fill="none"
          />
          <path d="M116 39l6 3-6 3M236 39l6 3-6 3" fill="#38BDF8" />

          {/* Gateway + OIDC */}
          <rect
            x="6"
            y="18"
            width="90"
            height="48"
            rx="8"
            fill="#0F172A"
            stroke="#334155"
            strokeWidth="1.2"
          />
          <text x="51" y="38" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontWeight="600">
            Nginx Gateway
          </text>
          <text x="51" y="53" textAnchor="middle" fill="#60A5FA" fontSize="10">
            OIDC · RBAC
          </text>

          {/* Microservicios Hexagonales */}
          <rect
            x="122"
            y="12"
            width="96"
            height="60"
            rx="8"
            fill="#0F172A"
            stroke="#3B82F6"
            strokeOpacity="0.65"
            strokeWidth="1.2"
          />
          <text x="170" y="33" textAnchor="middle" fill="#F8FAFC" fontSize="11" fontWeight="700">
            Node.js 22 · TS
          </text>
          <text x="170" y="48" textAnchor="middle" fill="#94A3B8" fontSize="10">
            Hexagonal Core
          </text>
          <text x="170" y="62" textAnchor="middle" fill="#38BDF8" fontSize="9.5">
            Ports &amp; Adapters
          </text>

          {/* Base de datos */}
          <rect
            x="244"
            y="18"
            width="92"
            height="48"
            rx="8"
            fill="#0F172A"
            stroke="#334155"
            strokeWidth="1.2"
          />
          <text x="290" y="38" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontWeight="600">
            PostgreSQL
          </text>
          <text x="290" y="53" textAnchor="middle" fill="#94A3B8" fontSize="10">
            ACID · Docker
          </text>

          {/* Barra inferior de observabilidad */}
          <rect
            x="6"
            y="78"
            width="408"
            height="24"
            rx="6"
            fill="#091224"
            stroke="#1E293B"
            strokeWidth="1"
          />
          <circle cx="22" cy="90" r="3.5" fill="#10B981" />
          <text x="34" y="94" fill="#CBD5E1" fontSize="10.5" fontWeight="500">
            OpenTelemetry · W3C TraceContext → Jaeger UI
          </text>
        </svg>
      ) : project.id === 'comercial-management' ? (
        <svg viewBox="0 0 420 112" className="w-full h-auto" role="img" aria-label={label}>
          {/* Conectores clientes -> API -> DB */}
          <path
            d="M110 29h24v26h14M110 83h24V55h14M276 55h28"
            stroke="#334155"
            strokeWidth="1.5"
            fill="none"
          />
          <path d="M142 52l6 3-6 3M298 52l6 3-6 3" fill="#38BDF8" />

          {/* Web Admin */}
          <rect
            x="6"
            y="10"
            width="104"
            height="38"
            rx="8"
            fill="#0F172A"
            stroke="#334155"
            strokeWidth="1.2"
          />
          <text x="58" y="27" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontWeight="600">
            Web Admin
          </text>
          <text x="58" y="40" textAnchor="middle" fill="#38BDF8" fontSize="9.5">
            React · TypeScript
          </text>

          {/* App Móvil */}
          <rect
            x="6"
            y="64"
            width="104"
            height="38"
            rx="8"
            fill="#0F172A"
            stroke="#334155"
            strokeWidth="1.2"
          />
          <text x="58" y="81" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontWeight="600">
            App Preventa
          </text>
          <text x="58" y="94" textAnchor="middle" fill="#34D399" fontSize="9.5">
            React Native · Expo
          </text>

          {/* API Central */}
          <rect
            x="148"
            y="26"
            width="128"
            height="58"
            rx="8"
            fill="#0F172A"
            stroke="#3B82F6"
            strokeOpacity="0.65"
            strokeWidth="1.2"
          />
          <text x="212" y="47" textAnchor="middle" fill="#F8FAFC" fontSize="11" fontWeight="700">
            API Backend REST
          </text>
          <text x="212" y="62" textAnchor="middle" fill="#94A3B8" fontSize="10">
            Node.js · TypeScript
          </text>
          <text x="212" y="76" textAnchor="middle" fill="#60A5FA" fontSize="9.5">
            ADRs · Stock &amp; Pedidos
          </text>

          {/* PostgreSQL / Supabase */}
          <rect
            x="304"
            y="26"
            width="110"
            height="58"
            rx="8"
            fill="#0F172A"
            stroke="#334155"
            strokeWidth="1.2"
          />
          <text x="359" y="51" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontWeight="600">
            PostgreSQL
          </text>
          <text x="359" y="66" textAnchor="middle" fill="#34D399" fontSize="10">
            Supabase DB
          </text>
        </svg>
      ) : (
        <svg viewBox="0 0 420 96" className="w-full h-auto" role="img" aria-label={label}>
          <path d="M128 48h34M258 48h34" stroke="#334155" strokeWidth="1.5" fill="none" />
          <path d="M156 45l6 3-6 3M286 45l6 3-6 3" fill="#38BDF8" />
          <rect x="8" y="22" width="120" height="52" rx="8" fill="#0F172A" stroke="#334155" />
          <text x="68" y="52" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontWeight="600">
            Client Layer
          </text>
          <rect x="162" y="22" width="96" height="52" rx="8" fill="#0F172A" stroke="#3B82F6" />
          <text x="210" y="52" textAnchor="middle" fill="#F8FAFC" fontSize="11" fontWeight="700">
            Domain API
          </text>
          <rect x="292" y="22" width="120" height="52" rx="8" fill="#0F172A" stroke="#334155" />
          <text x="352" y="52" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontWeight="600">
            Data Store
          </text>
        </svg>
      )}
    </figure>
  );
}
