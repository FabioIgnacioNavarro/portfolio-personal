# 1. Elección de Stack y Arquitectura Base

- **Fecha**: 2026-11-10
- **Estado**: Aceptado

## Contexto

El portfolio debe servir como carta de presentación para reclutadores y líderes técnicos de Argentina y del exterior. Necesita una puntuación óptima en Lighthouse, carga casi instantánea, tipado estricto para evitar bugs en producción y facilidad de despliegue en Vercel.

## Decisión

1. **Next.js (App Router)**: Proporciona renderizado estático eficiente (SSG), optimización automática de imágenes y fuentes, y arquitectura moderna.
2. **TypeScript (Modo Estricto)**: Garantiza contratos de tipos sólidos para todos los componentes y estructuras de datos.
3. **Tailwind CSS**: Permite estilos consistentes, rápidos y sin sobrecarga de runtime, facilitando modo oscuro y diseño responsive sin archivos CSS dispersos.
4. **pnpm**: Gestor de paquetes ultrarrápido y eficiente en espacio de disco.

## Consecuencias

- Despliegue directo y sin fricción en Vercel.
- Cero dependencias pesadas de UI.
