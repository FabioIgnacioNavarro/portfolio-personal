import type { Metadata } from 'next';
import './globals.css';
import { ViewPreferencesProvider } from '@/context/ViewPreferencesContext';

export const metadata: Metadata = {
  title: 'Fabio Ignacio Navarro | Full Stack Developer (Django, TypeScript, React)',
  description:
    'Portfolio profesional de Fabio Ignacio Navarro, desarrollador full stack junior de Argentina. Especializado en Python/Django, TypeScript, React, Node.js, PostgreSQL y Docker.',
  keywords: [
    'Fabio Ignacio Navarro',
    'Full Stack Developer',
    'Django Developer',
    'Python',
    'React',
    'Node.js',
    'TypeScript',
    'PostgreSQL',
    'Docker',
    'Argentina',
  ],
  authors: [{ name: 'Fabio Ignacio Navarro' }],
  openGraph: {
    title: 'Fabio Ignacio Navarro | Full Stack Developer',
    description:
      'Portfolio profesional interactivo y navegable. Python/Django, TypeScript, React, Node.js, PostgreSQL y Docker.',
    type: 'website',
    locale: 'es_AR',
    siteName: 'Fabio Ignacio Navarro Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fabio Ignacio Navarro | Full Stack Developer',
    description:
      'Portfolio profesional interactivo. Python/Django, TypeScript, React, Node.js, PostgreSQL y Docker.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className="scroll-smooth">
      <body className="antialiased selection:bg-blue-600 selection:text-white">
        <ViewPreferencesProvider>{children}</ViewPreferencesProvider>
      </body>
    </html>
  );
}
