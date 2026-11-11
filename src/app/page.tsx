import { loadPortfolioContent } from '@/lib/content';
import { getSiteUrl } from '@/lib/site';
import { PortfolioContainer } from '@/components/PortfolioContainer';

// Ruta principal generada estáticamente en producción usando el contenido validado con Zod
export default function HomePage() {
  const content = loadPortfolioContent();
  const siteUrl = getSiteUrl();

  // Datos estructurados Schema.org para mejorar la indexación en buscadores
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: content.profile.name,
    jobTitle: content.profile.role.en,
    description: content.profile.summary.es,
    url: siteUrl.origin,
    email: `mailto:${content.profile.links.email}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: content.profile.location.es,
      addressCountry: 'AR',
    },
    sameAs: [content.profile.links.github, content.profile.links.linkedin],
    knowsAbout: content.skills.flatMap((category) => category.skills.map((skill) => skill.name)),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <PortfolioContainer content={content} />
    </>
  );
}
