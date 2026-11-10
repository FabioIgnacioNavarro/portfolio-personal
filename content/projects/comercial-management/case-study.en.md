### 1. Problem

The family distribution business handled its daily operations (customer orders, inventory tracking, accounts receivable, and delivery routes) through manual paper records and scattered spreadsheets. This led to:

- Real-time stock mismatches between on-field sales reps and the central warehouse.
- Significant delays in order fulfillment and billing.
- Inability to accurately audit outstanding debts, cash flows, and overall commercial performance.

### 2. Requirements Gathering

Interviews and operational observation sessions were conducted with key business stakeholders (owners, field sales reps, and warehouse managers) to map the actual end-to-end workflow:

- **Field Sales Reps**: Required a lightweight, responsive mobile interface with offline/low-connectivity resilience to quickly enter orders in front of clients.
- **Back-office / Administration**: Needed a centralized web dashboard to approve orders, manage dynamic price tiers, track customer credit lines, and generate billing reports.
- **Warehouse**: Needed an order-picking view with immediate stock updates upon shipment dispatch.

### 3. Technical Solution

A modern, decoupled architecture was architected:

- **Backend**: Modular API built with **Node.js** and **TypeScript**, applying domain-driven patterns, strict payload validation, and event traceability.
- **Database**: **PostgreSQL** hosted via **Supabase**, leveraging Row Level Security (RLS) policies and real-time subscriptions for critical inventory updates.
- **Admin Dashboard**: Responsive SPA developed in **React** and **TypeScript**, with clean component composition and optimized data fetching.
- **Mobile Application**: Cross-platform app built using **React Native** and **Expo**, delivering a native, smooth experience for sales representatives on the go.
- **Engineering Practices**: Adoption of **ADRs (Architecture Decision Records)** and rigorous documentation structured specifically for AI-assisted pair programming and long-term maintainability.

### 4. Results (In Progress)

- Unified source of truth for products, clients, and pricing structures.
- Drastic reduction in human error during order capture and transmission.
- Highly scalable, end-to-end type-safe codebase with living documentation that makes continuous iteration seamless.
