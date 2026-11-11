import { ImageResponse } from 'next/og';
import { loadPortfolioContent } from '@/lib/content';
import { getSiteUrl } from '@/lib/site';

// Metadatos estáticos de la tarjeta Open Graph para LinkedIn y redes sociales
export const alt = 'Portfolio profesional — Full Stack Developer';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Genera la imagen Open Graph (1200x630) leyendo directamente desde content/profile.json
export default function OpenGraphImage() {
  const { profile } = loadPortfolioContent();
  const siteHost = getSiteUrl().host;
  const displayDomain = siteHost.startsWith('localhost')
    ? `${new URL(profile.links.github).host}${new URL(profile.links.github).pathname}`
    : siteHost;
  const techItems = profile.headline.en
    .split('·')
    .map((item) => item.trim())
    .filter(Boolean);

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '64px 72px',
        background: 'linear-gradient(135deg, #060913 0%, #0b1222 55%, #10192e 100%)',
        color: '#f8fafc',
        fontFamily: 'system-ui, sans-serif',
        position: 'relative',
      }}
    >
      {/* Encabezado con monograma y ubicación */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: '#111827',
              border: '2px solid rgba(59, 130, 246, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 800,
              color: '#f8fafc',
            }}
          >
            FN
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 16px',
              borderRadius: '9999px',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#6ee7b7',
              fontSize: '18px',
              fontWeight: 600,
            }}
          >
            Disponible · Open to work
          </div>
        </div>

        <div
          style={{
            fontSize: '20px',
            color: '#94a3b8',
            fontWeight: 500,
          }}
        >
          {profile.location.es}
        </div>
      </div>

      {/* Bloque central de identidad profesional */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        <div
          style={{
            fontSize: '64px',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.08,
            color: '#ffffff',
          }}
        >
          {profile.name}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: '32px',
            fontWeight: 700,
            color: '#60a5fa',
          }}
        >
          {`${profile.role.es} · ${profile.role.en}`}
        </div>
      </div>

      {/* Pie con etiquetas del stack y dominio */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          paddingTop: '24px',
          borderTop: '1px solid rgba(51, 65, 85, 0.7)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          {techItems.map((tech) => (
            <div
              key={tech}
              style={{
                display: 'flex',
                padding: '8px 14px',
                borderRadius: '10px',
                background: 'rgba(30, 41, 59, 0.85)',
                border: '1px solid rgba(71, 85, 105, 0.65)',
                color: '#e2e8f0',
                fontSize: '18px',
                fontWeight: 600,
              }}
            >
              {tech}
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: '16px',
            color: '#94a3b8',
            fontWeight: 600,
            marginLeft: '16px',
            flexShrink: 0,
          }}
        >
          {displayDomain}
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
