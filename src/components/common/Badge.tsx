import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'warning';
  className?: string;
}

export function Badge({ children, variant = 'secondary', className = '' }: BadgeProps) {
  const variantStyles = {
    primary: 'bg-blue-600 text-white font-medium',
    secondary: 'bg-slate-800/90 text-slate-200 font-medium border border-slate-700/70',
    accent: 'bg-blue-950/70 text-blue-300 font-medium border border-blue-800/80',
    outline: 'border border-slate-700 text-slate-300',
    warning: 'bg-amber-950/70 text-amber-300 border border-amber-800/80',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs transition-colors ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
