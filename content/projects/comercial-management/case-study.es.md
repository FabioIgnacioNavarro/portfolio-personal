### 1. Problema

La empresa familiar de distribución gestionaba sus operaciones diarias (pedidos de clientes, control de inventario, cuentas corrientes y rutas de entrega) mediante registros manuales en papel y planillas de cálculo dispersas. Esto generaba:

- Descoordinación de stock en tiempo real entre los vendedores en la calle y el depósito central.
- Demoras en la toma de pedidos y facturación.
- Dificultad para auditar saldos pendientes de cobro y desempeño comercial.

### 2. Relevamiento

Se llevaron a cabo entrevistas con los actores clave del negocio (dueños, preventistas en calle y encargados de depósito) para mapear el flujo de trabajo real:

- **Preventistas en ruta**: Necesitaban una interfaz móvil rápida, ligera y con capacidad offline o de baja conectividad para registrar pedidos frente al cliente.
- **Administración**: Requería un panel web centralizado para autorizar pedidos, gestionar listas de precios dinámicas, cuentas corrientes y reportes de facturación.
- **Depósito**: Necesitaba un módulo de armado de pedidos (picking) y actualización inmediata de existencias.

### 3. Solución Técnica

Se diseñó una arquitectura desacoplada y moderna:

- **Backend**: API modular con **Node.js** y **TypeScript**, implementando validación estricta de esquemas, patrones de dominio limpios y trazabilidad de eventos.
- **Base de Datos**: **PostgreSQL** orquestado sobre **Supabase**, aprovechando políticas de seguridad a nivel de fila (Row Level Security - RLS) y suscripciones en tiempo real para cambios críticos de stock.
- **Panel Administrativo**: SPA responsiva con **React**, **TypeScript** y diseño modular orientado a componentes.
- **Aplicación Móvil**: Desarrollada con **React Native** y **Expo** para garantizar compatibilidad multiplataforma y una experiencia ágil para los vendedores en campo.
- **Ingeniería de Software**: Adopción de **ADRs (Architecture Decision Records)** en el repositorio y documentación técnica estructurada pensada para acelerar el desarrollo asistido por agentes de inteligencia artificial.

### 4. Resultado (En Desarrollo)

- Centralización unificada de catálogo, clientes y listas de precios.
- Reducción drástica del error humano en la toma y transmisión de pedidos.
- Base arquitectónica escalable, tipada de extremo a extremo y con documentación técnica viva que facilita el mantenimiento y la incorporación de nuevas funcionalidades.
