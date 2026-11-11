import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site';

// Genera las reglas de rastreo e indexación para buscadores
export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${siteUrl.origin}/sitemap.xml`,
  };
}
