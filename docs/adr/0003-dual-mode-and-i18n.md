# 3. Intercambio de Modos (Simple / Escritorio) y Soporte Bilingüe Instantáneo

- **Fecha**: 2026-11-10
- **Estado**: Aceptado

## Contexto

El portfolio ofrece dos experiencias: "Escritorio tipo SO" (lúdica y técnica) y "Modo Simple" (lectura lineal rápida y accesible). Además, los usuarios provienen tanto de países de habla hispana como de habla inglesa. Se evaluaron rutas independientes (`/es`, `/en`, `/simple`) versus una URL canónica única.

## Decisión

1. **URL Canónica Única**: Se utiliza un solo enlace para compartir en CV y LinkedIn.
2. **Detección Automática**:
   - Dispositivos móviles (`< 768px`) o usuarios con `prefers-reduced-motion` inician por defecto en **Modo Simple**.
   - El idioma inicial se detecta a partir del encabezado o configuración del navegador (`navigator.language`).
3. **Persistencia y Cambio en el Acto**:
   - Los cambios de idioma (ES/EN), modo de visualización (Simple/Escritorio) y tema (Claro/Oscuro) se ejecutan instantáneamente en el cliente con React Context y se guardan en `localStorage`.
   - Se admite opcionalmente el parámetro `?lang=en` o `?mode=simple` para forzar la configuración si se comparte un enlace específico.

## Consecuencias

- Cero saltos de red o parpadeos al cambiar de idioma.
- Enlace único y universal para reclutadores.
