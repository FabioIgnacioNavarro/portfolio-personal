# Portfolio Personal - Fabio Ignacio Navarro

Portfolio interactivo y profesional para reclutadores y líderes técnicos, diseñado para cargar en milisegundos y ser completamente guiado por datos (`content-driven`).

## Stack Tecnológico

- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript (Strict mode)
- **Estilos**: Tailwind CSS (con modo oscuro y claro)
- **Validación de Datos**: Zod (falla en build-time ante inconsistencias)
- **Testing**: Vitest (unit tests) + Playwright (end-to-end)
- **Calidad de Código**: ESLint + Prettier
- **Gestor de Paquetes**: `pnpm`
- **CI/CD**: GitHub Actions

## Guías y Arquitectura

- Consulta [`AGENTS.md`](./AGENTS.md) para conocer las convenciones del repositorio, flujo de trabajo y cómo agregar nuevo contenido sin tocar la UI.
- Consulta [`docs/adr/`](./docs/adr/) para los registros de decisiones de arquitectura (ADRs).

## Cómo ejecutar localmente

```bash
# 1. Instalar dependencias
pnpm install

# 2. Correr servidor de desarrollo
pnpm dev

# 3. Correr pruebas unitarias (Vitest)
pnpm test

# 4. Correr pruebas end-to-end (Playwright)
pnpm test:e2e

# 5. Compilar para producción
pnpm build
```
