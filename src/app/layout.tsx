import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ViewPreferencesProvider } from '@/context/ViewPreferencesContext';
import { loadPortfolioContent } from '@/lib/content';
import { resolveLocalizedText } from '@/lib/schemas/common';
import { getSiteUrl } from '@/lib/site';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

// Metadatos SEO y de compartición social construidos desde content/profile.json
export function generateMetadata(): Metadata {
  const { profile, skills } = loadPortfolioContent();
  const siteUrl = getSiteUrl();
  const title = `${profile.name} | Full Stack Developer (Django, TypeScript, React)`;
  const description = profile.summary.es;
  const highlightedSkills = skills
    .flatMap((cat) => cat.skills)
    .filter((skill) => skill.highlight)
    .flatMap((skill) =>
      typeof skill.name === 'string'
        ? [skill.name]
        : Array.from(
            new Set([
              resolveLocalizedText(skill.name, 'es'),
              resolveLocalizedText(skill.name, 'en'),
            ]),
          ),
    );

  return {
    metadataBase: siteUrl,
    title,
    description,
    keywords: [
      profile.name,
      profile.role.es,
      profile.role.en,
      'Portfolio',
      'Argentina',
      ...highlightedSkills,
    ],
    authors: [{ name: profile.name, url: profile.links.github }],
    creator: profile.name,
    alternates: {
      canonical: '/',
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${profile.name} | ${profile.role.en}`,
      description: `${profile.headline.es} — ${profile.location.es}`,
      url: '/',
      type: 'website',
      locale: 'es_AR',
      alternateLocale: ['en_US'],
      siteName: `${profile.name} Portfolio`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${profile.name} | ${profile.role.en}`,
      description: `${profile.headline.en} — ${profile.location.en}`,
    },
  };
}

// Configura esquema de color oscuro nativo para barra de navegador y controles
export const viewport: Viewport = {
  themeColor: '#090d16',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`dark scroll-smooth ${plusJakarta.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        <ViewPreferencesProvider>{children}</ViewPreferencesProvider>
      </body>
    </html>
  );
}
