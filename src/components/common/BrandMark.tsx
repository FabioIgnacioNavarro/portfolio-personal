import React from 'react';

interface BrandMarkProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Emblema geométrico personal de Fabio Navarro para reemplazar avatares genéricos o indicadores pulsantes
export function BrandMark({ size = 'md', className = '' }: BrandMarkProps) {
  const dimensions =
    size === 'sm'
      ? 'w-7 h-7 rounded-lg'
      : size === 'lg'
        ? 'w-14 h-14 rounded-2xl'
        : 'w-10 h-10 rounded-xl';

  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center border border-blue-500/40 bg-slate-900 text-sky-400 ${dimensions} ${className}`.trim()}
    >
      <svg viewBox="0 0 32 32" className="w-[72%] h-[72%]" fill="none">
        <path
          d="M7 9.5 3.5 16 7 22.5M25 9.5 28.5 16 25 22.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.55"
        />
        <path
          d="M11 21V11h6M11 16h4.5"
          stroke="#F8FAFC"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.5 21V11l4.5 10V11"
          stroke="#38BDF8"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
