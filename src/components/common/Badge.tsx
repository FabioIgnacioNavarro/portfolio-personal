import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'warning';
  className?: string;
}

export function Badge({ children, variant = 'secondary', className = '' }: BadgeProps) {
  const variantStyles = {
    primary: 'bg-blue-600 text-white font-medium',
    secondary: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium',
    accent:
      'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 font-medium border border-blue-200 dark:border-blue-900',
    outline: 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300',
    warning:
      'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs transition-colors ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
