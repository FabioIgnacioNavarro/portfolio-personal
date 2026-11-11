// Resuelve la URL base pública del sitio sin acoplar un dominio definitivo en el código fuente
export function getSiteUrl(): URL {
  const rawUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    'http://localhost:3000';

  const trimmed = rawUrl.trim();
  const normalizedUrl =
    trimmed.startsWith('http://') || trimmed.startsWith('https://')
      ? trimmed
      : `https://${trimmed}`;

  try {
    return new URL(normalizedUrl);
  } catch {
    return new URL('http://localhost:3000');
  }
}
