# 4. Gestor de Ventanas Propio con Pointer Events y Terminal Simulada

- **Fecha**: 2026-11-10
- **Estado**: Aceptado

## Contexto

El Modo Escritorio (Fase 2) requiere emular un sistema operativo en el navegador: ventanas flotantes arrastrables, redimensionables, con minimizar, maximizar y cerrar, orden de apilado (_z-index_), barra de tareas, explorador de archivos para proyectos y terminal interactiva.
Se evaluó incorporar librerías pesadas de gestión de ventanas (ej. `react-rnd`, `golden-layout`) versus una implementación propia con la API moderna de puntero de la web.

## Decisión

Implementar un **Gestor de Ventanas propio y sin dependencias externas pesadas**:

1. **Eventos de Puntero (`Pointer Events`)**:
   - `useDraggable`: Arrastre fluido mediante `onPointerDown`, `setPointerCapture` y `onPointerMove`. El puntero no se pierde aunque el cursor salga de la barra de título a alta velocidad.
   - `useResizable`: Redimensionamiento en 8 direcciones (`n`, `s`, `e`, `w`, `ne`, `nw`, `se`, `sw`) con límites mínimos de tamaño para evitar colapsos visuales.
2. **Contexto de Estado Centralizado (`WindowManagerContext`)**:
   - Administra el apilado dinámico (_z-index_), minimizado, maximizado, restauración y foco de cada ventana.
3. **Explorador de Archivos de Proyectos**:
   - Muestra los proyectos como archivos `.case-study.md` dentro de una ventana de carpeta, permitiendo abrir ventanas individuales con el análisis arquitectónico completo.
4. **Terminal Simulada (`TerminalApp`)**:
   - Intérprete desacoplado (`executeTerminalCommand`) con soporte de comandos interactivos (`help`, `about`, `projects`, `skills`, `experience`, `contact`, `theme`, `lang`, `mode`, `neofetch`, `clear`).

## Consecuencias

- Cero sobrecarga de bundle por librerías de terceros.
- Control total sobre el renderizado, accesibilidad y soporte táctil en dispositivos móviles.
