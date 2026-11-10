### 1. Problem

Real-time urban travel and mobility platforms need to handle concurrent trip requests with high resilience, end-to-end trace correlation, and accurate dynamic fare calculations. Key engineering challenges included:

- Preventing race conditions in vehicle and driver dispatch.
- Ensuring immutable auditing for demand-based dynamic pricing.
- Overcoming blind spots when debugging errors across distributed microservices.
- Enforcing modern identity security with granular Role-Based Access Control (RBAC).

### 2. Requirements & Discovery

Developed as part of the advanced Software Architecture coursework at UTN FRRe, the system was required to adhere to strict enterprise software standards:

- **Domain Decoupling**: Isolate Fleet management, Dynamic Pricing, and Trip Lifecycle into bounded contexts.
- **Transactional Idempotency**: Prevent duplicate bookings during network retries using `Clave-Idempotencia` (Idempotency-Key) headers.
- **Standardized Distributed Tracing**: Propagate W3C `traceparent` headers across all inter-service HTTP calls.
- **Robust Security**: Asymmetric RS256 token issuance with public key verification via JWKS and granular RBAC enforcement (Passenger, Driver, Support, Admin).

### 3. Technical Solution

A modular, domain-driven distributed backend was designed:

- **Hexagonal Architecture (Ports & Adapters)**: Pure domain models completely decoupled from web frameworks, database engines, or external HTTP clients.
- **Microservices Ecosystem**: Built using **Node.js 22 LTS** and strict **TypeScript**:
  - `ms-flota`: Manages vehicle states and concurrent dispatch.
  - `ms-tarifas`: Dynamic pricing engine with strict audit logs and quote expiration.
  - `ms-viajes`: Finite state machine governing trip lifecycles (`Requested` -> `Assigned` -> `In-Progress` -> `Completed`).
- **Relational Storage**: **PostgreSQL** with dedicated database schemas per service, ACID transactions, and deterministic migrations.
- **OpenTelemetry Distributed Observability**: Automated and manual instrumentation exporting via OTLP to a self-hosted **Jaeger** instance, enabling real-time trace inspection and latency bottleneck analysis.
- **Docker Infrastructure**: Fully reproducible multi-container orchestration via **Docker Compose**, **Nginx** reverse proxy, and custom load simulation scripts.
- **Automated Testing**: Contract verification and end-to-end integration flows using **Playwright** and **Vitest**.

### 4. Results

- Deterministic, production-ready distributed backend launched with a single command (`docker compose up --build`).
- Instant distributed trace visualization in Jaeger from incoming client request down to database persistence.
- High test coverage and stress resilience validated through concurrent load testing and automated E2E suites.
