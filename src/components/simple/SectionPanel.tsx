'use client';

import React, { useEffect, useRef, useState } from 'react';

interface SectionPanelProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  panelClassName?: string;
}

// Contenedor unificado con opacidad reducida y aparición progresiva al hacer scroll en Modo Simple
export function SectionPanel({
  id,
  children,
  className = '',
  panelClassName = '',
}: SectionPanelProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // La cabecera principal (#about) se mantiene siempre visible desde el primer frame
    if (id === 'about') return;

    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) return;

    let observer: IntersectionObserver | null = null;
    const rafId = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      // Solo ocultar para animar entrada si la sección inicia claramente debajo del área visible
      if (rect.top <= window.innerHeight * 0.94) return;

      setIsVisible(false);

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting || entry.boundingClientRect.top <= window.innerHeight * 0.94) {
              setIsVisible(true);
              observer?.disconnect();
            }
          }
        },
        {
          threshold: 0.04,
          rootMargin: '0px 0px -36px 0px',
        },
      );

      observer.observe(el);
    });

    const handleMotionChange = () => {
      if (motionQuery.matches) {
        setIsVisible(true);
        observer?.disconnect();
      }
    };

    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      cancelAnimationFrame(rafId);
      observer?.disconnect();
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, [id]);

  return (
    <section ref={sectionRef} id={id} className={`scroll-mt-20 py-3 sm:py-4 ${className}`.trim()}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div
          className={`rounded-2xl border border-slate-800/80 bg-slate-900/55 p-5 sm:p-8 shadow-lg transition-[opacity,translate,scale] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-none motion-reduce:scale-none ${
            isVisible ? 'opacity-100' : 'opacity-[0.03] translate-y-7 scale-[0.985]'
          } ${panelClassName}`.trim()}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
