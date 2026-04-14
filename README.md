# ODPP Tech Support Portal

A full stack service desk platform tailored for the Office of the Director of Public Prosecutions (ODPP), Kenya.

This project is designed as a production minded portfolio application that demonstrates how to build internal government workflow systems with strong role based access control, operational reporting, and maintainable architecture.

## Why This Project Stands Out

- Solves a real operational problem: turns fragmented ICT issue handling into a structured, auditable support workflow.
- Built as a complete product, not a demo page: authentication, ticket lifecycle management, reporting analytics, knowledge base, and deployment documentation.
- Shows engineering maturity: clear separation of concerns, role aware UX and APIs, seeded realistic data, reusable frontend patterns, and defensive error handling.
- Demonstrates end to end ownership: product planning in PRD, implementation across backend and frontend, and delivery artifacts for deployment and API consumption.

## Product Overview

The ODPP Tech Support Portal enables staff to report IT issues and track progress, while ICT officers and admins manage triage, assignment, resolution, and service quality.

Core capabilities:
- Ticket submission with category, priority, location, contact, and attachments.
- Role based workflows for staff, ICT officers, and admins.
- Assignment and status transitions across new, in_progress, resolved, and closed states.
- Internal and public comments for collaboration and communication.
- ICT operations dashboard with queue visibility and workload context.
- Reporting suite with SLA compliance, resolution trends, and CSV export.
- Searchable knowledge base to reduce repeat tickets and improve self service.

## Implementation Status

- Phase 1: Foundation - Complete
- Phase 2: Core Ticketing - Complete
- Phase 3: ICT Workflow Features - Complete
- Phase 4: Reporting and Knowledge Base - Complete
- Phase 5: Polish and Deployment Preparation - Complete

## Architecture

High level flow:
- Frontend: React SPA (Vite) handles routing, role aware views, forms, data visualization, and user feedback.
- Backend: Laravel API exposes authenticated, role protected endpoints for all business operations.
- Auth: Laravel Sanctum issues and validates bearer tokens.
- Data: MySQL stores users, tickets, comments, attachments, audit history, and knowledge base articles.

Project layout:

.
|- backend/       Laravel 11 API, business logic, models, migrations, seeders
|- frontend/      React 18 client with Tailwind, TanStack Query, Zustand
|- docs/          API docs, deployment guide, implementation reports
|- PRD.md         Product requirements and delivery milestones
|- setup.sh       Local setup helper script

## Tech Stack

Backend:
- Laravel 11
- Laravel Sanctum
- MySQL 8+
- Eloquent ORM

Frontend:
- React 18
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- Zustand
- Recharts
- Axios

Dev and quality tooling:
- Composer
- npm
- ESLint
- PHPUnit

## Key Engineering Highlights

### 1) Role Driven Security Model
- Distinct role behavior for staff, ICT officers, and admins.
- Protected routes and role guards in frontend navigation.
- API level authorization to enforce access policies server side.

### 2) Realistic Service Desk Workflow
- Purpose built ticket status transitions with reopen support.
- Assignment flow for ICT queue ownership.
- Comments and attachments to keep ticket context centralized.

### 3) Operational Analytics
- Resolution time insights by category.
- SLA compliance tracking by priority bands.
- Officer workload and throughput visibility.
- Export endpoints for offline reporting and management review.

### 4) Production Readiness Practices
- Idempotent seeders for repeatable local setup.
- Rich seed datasets for tickets and knowledge base content.
- Global error boundary and toast notifications for resilient UX.
- Deployment and operations playbook with queue worker and backup strategy.

## Documentation

- Full API reference: [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)
- Deployment runbook: [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)
- Phase 1 and 2 issue resolution report: [docs/PHASE_1_2_ERROR_REPORT.md](docs/PHASE_1_2_ERROR_REPORT.md)
- Product requirements: [PRD.md](PRD.md)

## Quick Start

Prerequisites:
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8+

Option A: one command setup

Run from project root:

```bash
bash setup.sh
```

Option B: manual setup

Backend:

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate

mysql -u root -e "CREATE DATABASE odpp_tech_support CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

php artisan migrate
php artisan db:seed
php artisan serve
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Default local URLs:
- Backend API: http://localhost:8000
- Frontend app: http://localhost:5173

## Demo Accounts

All seeded users use the password value shown below:

| Role | Email | Password |
|---|---|---|
| Admin | admin@odpp.go.ke | password |
| ICT Officer | ict1@odpp.go.ke | password |
| ICT Officer | ict2@odpp.go.ke | password |
| Staff | prosecutor@odpp.go.ke | password |

## API Surface (Summary)

Authentication:
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/user

Tickets:
- CRUD for tickets
- Assignment endpoint
- Status transition endpoint
- Reopen endpoint
- Comments and attachment endpoints

Reports:
- Resolution times
- Category breakdown
- SLA compliance
- Officer workload
- CSV export

Knowledge Base:
- Article CRUD
- Search and category filters
- Category enumeration endpoint

For request and response examples, see [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md).

## Portfolio Value

This repository demonstrates that I can:
- Translate business requirements into a delivery roadmap.
- Build secure, role aware backend APIs and modern frontend clients.
- Design systems for both end users and operational stakeholders.
- Produce delivery quality documentation expected in professional teams.
- Ship features iteratively while preserving maintainability.

## Suggested Next Enhancements

- Add automated tests for core role based scenarios and ticket transitions.
- Add CI pipeline for lint, tests, and build validation.
- Add observability hooks (structured logs, metrics, health checks).
- Add email and in app notification workflows for assignment and status updates.

## License

MIT