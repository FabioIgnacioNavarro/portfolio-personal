# Guía para Agentes y Desarrolladores (AGENTS.md)

Este documento contiene las reglas, arquitectura, convenciones y flujos de trabajo para cualquier agente de IA o desarrollador que trabaje en este repositorio.

---

## 1. Perfil del Proyecto

- **Autor**: Fabio Ignacio Navarro (Desarrollador Full Stack Junior, Argentina).
- **Audiencia objetivo**: Reclutadores y líderes técnicos (nacionales e internacionales). Debe cargar en milisegundos, verse profesional y poder recorrerse en pocos segundos.
- **Despliegue**: Vercel (linkeado en CV y LinkedIn).
- **Idioma del código**: Todo el código, nombres de variables, funciones, tipos y comentarios deben estar en **inglés**.
- **Idioma del contenido visible**: Estricto soporte bilingüe en **español e inglés** (`{ es: string, en: string }`).

---

## 2. Stack Tecnológico

- **Framework**: Next.js (App Router)
- **Lenguaje**: TypeScript en modo estricto (`strict: true`)
- **Estilos**: Tailwind CSS
- **Validación de contenido**: Zod (falla en tiempo de build con mensaje descriptivo de archivo y campo)
- **Testing**: Vitest (pruebas unitarias de esquemas y contenido) + Playwright (pruebas E2E de flujos)
- **Linter y Formateo**: ESLint + Prettier
- **Gestor de paquetes**: `pnpm`
- **CI/CD**: GitHub Actions

---

## 3. Arquitectura y Reglas Críticas

### 3.1. Separación Estricta entre Datos e Interfaz

- Toda la información vive en la carpeta `content/`. La carpeta `src/` no debe tener datos personales hardcodeados.
- **Una sola fuente de verdad**: Tanto el Modo Simple (Fase 1) como el Modo Escritorio (Fase 2) leen exactamente los mismos datos provistos por `src/lib/content.ts`.

### 3.2. Formato del Contenido

- `content/profile.json`: Perfil, biografía, enlaces sociales y CVs.
- `content/experience.json`: Lista de empleos y roles.
- `content/education.json`: Títulos y trayectorias académicas.
- `content/certifications.json`: Certificaciones profesionales.
- `content/skills.json`: Tecnologías agrupadas por categorías.
- `content/languages.json`: Idiomas y niveles.
- `content/projects/<slug>/`:
  - `project.json`: Metadatos, tecnologías, rol, estado (`'in-progress' | 'completed'`), links y capturas.
  - `case-study.es.md`: Caso de estudio detallado en español (Problema, Relevamiento, Solución, Resultado).
  - `case-study.en.md`: Case study en inglés.

### 3.3. Cómo Agregar una Nueva Entrada de Contenido

1. **Para agregar una experiencia**:
   Añadir un nuevo objeto al array en `content/experience.json` respetando el esquema:
   ```json
   {
     "id": "nueva-experiencia",
     "company": "Nombre de Empresa",
     "role": { "es": "Rol en español", "en": "Role in English" },
     "startDate": "2024",
     "endDate": null,
     "isCurrent": true,
     "description": { "es": "...", "en": "..." },
     "achievements": [{ "es": "...", "en": "..." }],
     "technologies": ["Tecnología 1", "Tecnología 2"]
   }
   ```
2. **Para agregar un proyecto**:
   Crear una carpeta en `content/projects/<nombre-proyecto>/` con:
   - `project.json`
   - `case-study.es.md`
   - `case-study.en.md`
3. Ejecutar `pnpm test` para validar que los datos cumplan con los esquemas de Zod antes de hacer commit.

---

## 4. Convenciones de Desarrollo y Git

- **Ramas**: Trabajar siempre en ramas temáticas (`feat/...`, `fix/...`, `docs/...`).
- **Commits**: Seguir [Conventional Commits](https://www.conventionalcommits.org/):
  - `feat(...)`: Nueva característica.
  - `fix(...)`: Corrección de bug.
  - `test(...)`: Incorporación o mejora de pruebas.
  - `docs(...)`: Cambios en documentación o ADRs.
  - `chore(...)`: Tareas de mantenimiento o configuración.
- **Dependencias**: No agregar dependencias pesadas sin justificación técnica y confirmación previa del usuario.

---

## 5. Comandos Útiles

```bash
# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev

# Correr pruebas unitarias (Vitest)
pnpm test

# Correr pruebas E2E (Playwright)
pnpm test:e2e

# Verificar tipos TypeScript
pnpm typecheck

# Formatear y verificar linter
pnpm format
pnpm lint

# Compilar para producción
pnpm build
```

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
