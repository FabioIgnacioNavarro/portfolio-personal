import { describe, it, expect, afterEach } from 'vitest';
import { getSiteUrl } from '@/lib/site';

describe('Site URL Resolution Helper', () => {
  const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const originalProdUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const originalVercelUrl = process.env.VERCEL_URL;

  afterEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl;
    process.env.VERCEL_PROJECT_PRODUCTION_URL = originalProdUrl;
    process.env.VERCEL_URL = originalVercelUrl;
  });

  it('defaults to localhost when no environment domain is configured', () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
    delete process.env.VERCEL_URL;

    expect(getSiteUrl().origin).toBe('http://localhost:3000');
  });

  it('normalizes Vercel hostnames without scheme into https URLs', () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    process.env.VERCEL_PROJECT_PRODUCTION_URL = 'fabionavarro.vercel.app';

    expect(getSiteUrl().origin).toBe('https://fabionavarro.vercel.app');
  });

  it('prioritizes explicit NEXT_PUBLIC_SITE_URL when present', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://fabionavarro.dev';
    process.env.VERCEL_PROJECT_PRODUCTION_URL = 'fabionavarro.vercel.app';

    expect(getSiteUrl().origin).toBe('https://fabionavarro.dev');
  });
});
