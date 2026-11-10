### 1. Problema

Las plataformas de transporte urbano y viajes en tiempo real requieren procesar solicitudes concurrentes con alta confiabilidad, trazabilidad de punta a punta y cálculo tarifario dinámico sin inconsistencias. Los principales desafíos de ingeniería fueron:

- Evitar condiciones de carrera (race conditions) en la asignación de conductores y vehículos.
- Garantizar auditoría e inmutabilidad en el cálculo de precios dinámicos según demanda.
- Resolver la pérdida de visibilidad y depuración ante errores distribuidos a través de múltiples servicios.
- Proteger los endpoints con esquemas de autenticación modernos y control de acceso por roles (RBAC).

### 2. Relevamiento y Requerimientos

El proyecto, desarrollado como parte de la cátedra de Programación IV (UTN FRRe), exigió cumplir con estándares estrictos de la industria:

- **Separación de responsabilidades de dominio**: Modelar de forma desacoplada los subsistemas de Flota, Tarifación y Ciclo de Vida del Viaje.
- **Idempotencia transaccional**: Evitar la duplicación de solicitudes de viajes ante reintentos de red mediante cabeceras `Clave-Idempotencia`.
- **Trazabilidad distribuida estandarizada**: Propagación W3C `traceparent` en todas las comunicaciones HTTP inter-servicios.
- **Seguridad robusta**: Emisión asimétrica RS256 con verificación de claves públicas vía JWKS y autorización granular por rol (Pasajero, Chofer, Soporte, Administrador).

### 3. Solución Técnica

Se implementó una solución integral desacoplada y orientada al dominio:

- **Arquitectura Hexagonal (Ports & Adapters)**: El núcleo de negocio permanece 100% puro y testeable, completamente aislado de los frameworks web, bases de datos o clientes HTTP externos.
- **Ecosistema de Microservicios**: Desarrollados con **Node.js 22 LTS** y **TypeScript** en modo estricto:
  - `ms-flota`: Gestión de estados de vehículos y asignación concurrente.
  - `ms-tarifas`: Motor de precios dinámicos auditables con control de vigencia.
  - `ms-viajes`: Máquina de estados finitos que orquesta el ciclo de vida del viaje (`Solicitado` -> `Asignado` -> `En curso` -> `Finalizado`).
- **Base de Datos Relacional**: **PostgreSQL** con esquemas aislados por servicio, transacciones ACID y migraciones reproducibles.
- **Observabilidad con OpenTelemetry**: Instrumentación automática y manual con SDK OTLP hacia un servidor **Jaeger**, permitiendo correlacionar trazas distribuidas, medir latencias por servicio e inspeccionar spans en tiempo real.
- **Infraestructura con Docker**: Orquestación reproducible mediante **Docker Compose**, reverse proxy con **Nginx** y simulador de carga concurrente para mediciones de rendimiento.
- **Calidad y E2E**: Pruebas automatizadas de contratos y flujos completos con **Playwright** y **Vitest**.

### 4. Resultado

- Plataforma backend determinista, desplegable con un solo comando (`docker compose up --build`).
- Visualización gráfica de cada traza distribuida en Jaeger desde el ingreso de la solicitud hasta el commit en base de datos.
- Cobertura completa de pruebas de integración y carga, demostrando arquitectura limpia y confiabilidad bajo estrés.
