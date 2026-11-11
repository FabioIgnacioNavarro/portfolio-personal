import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site';

// Genera el sitemap XML para indexación en motores de búsqueda
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  return [
    {
      url: siteUrl.origin,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
