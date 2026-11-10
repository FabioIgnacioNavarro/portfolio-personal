# 2. Validación de Contenido en Build-Time con Zod

- **Fecha**: 2026-11-10
- **Estado**: Aceptado

## Contexto

El usuario necesita agregar o actualizar información (experiencia laboral, proyectos, estudios, certificados) simplemente editando archivos JSON o Markdown en la carpeta `content/` y haciendo push al repositorio, sin tocar código en `src/`. Un error tipográfico o un campo faltante podría romper la interfaz en producción si no se valida anticipadamente.

## Decisión

Implementar validación estricta con **Zod** en tiempo de compilación y en las pruebas unitarias:

- Toda entidad de contenido posee un esquema Zod asociado.
- Todo texto visible debe incluir traducción obligatoria `{ es: string, en: string }`.
- Si un archivo contiene un campo faltante, tipo inválido o error de formato, el build falla inmediatamente con un mensaje explícito que indica el nombre del archivo y la ruta de la propiedad fallida.

## Consecuencias

- Cero fallos silenciosos en producción por inconsistencias de datos.
- Mensajes de error amigables para el autor del contenido.
