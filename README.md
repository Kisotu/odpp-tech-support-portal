# ODPP Tech Support Portal 🇰🇪

[![Laravel 11](https://img.shields.io/badge/Backend-Laravel%2011-FF2D20?style=for-the-badge&logo=laravel)](https://laravel.com)
[![React 18](https://img.shields.io/badge/Frontend-React%2018-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)

A comprehensive, production-grade service desk platform tailored for the **Office of the Director of Public Prosecutions (ODPP), Kenya**. This portal streamlines IT support workflows, transitioning from fragmented issue handling to a structured, auditable, and data-driven ecosystem.

---

## 🎯 Project Overview

The ODPP Tech Support Portal is designed to demonstrate high-level engineering maturity in building internal government workflow systems. It features a robust role-based access control (RBAC) system, real-time ticket lifecycle management, and advanced operational reporting.

### 🚀 Key Features

- **🎫 Smart Ticketing System**: Staff can submit tickets with categories, priority levels, and attachments.
- **🔄 Lifecycle Management**: Full workflow from `New` → `In Progress` → `Resolved` → `Closed`.
- **📊 Operational Dashboards**: Tailored views for Staff (their tickets) and ICT Officers (queue management).
- **📈 Analytics & Reporting**: SLA compliance tracking, resolution trends, and CSV exports for management.
- **📚 Knowledge Base**: Self-service repository of articles to reduce common support volume.
- **🔐 Enterprise Security**: Laravel Sanctum-powered authentication and strict server-side authorization.

---

## 🏗️ Technical Architecture

The project follows a clean separation of concerns with a modern decoupled architecture.

### Directory Structure

```text
.
├── 📂 backend/         # Laravel 11 REST API
│   ├── 📂 app/         # Models, Controllers (Ticket, Auth, Reports)
│   ├── 📂 database/    # Migrations & Idempotent Seeders
│   └── 📂 routes/      # Sanctum-protected API endpoints
├── 📂 frontend/        # React 18 SPA (Vite)
│   ├── 📂 src/pages/   # Dashboard, TicketView, KnowledgeBase, Reports
│   ├── 📂 src/store/   # Zustand State Management
│   └── 📂 src/services/# Axios-based API consumption
├── 📂 docs/            # API documentation & Deployment guides
└── 📄 PRD.md           # Product Requirements Document
```

### Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend** | Laravel 11, Sanctum, MySQL, PHPUnit |
| **Frontend** | React 18, Vite, Tailwind CSS, TanStack Query, Zustand |
| **Data Viz** | Recharts (SLA Trends & Category Distribution) |
| **DevOps** | Bash setup scripts, detailed deployment guides |

---

## 🛠️ Getting Started

### Prerequisites
- PHP 8.2+ & Composer
- Node.js 18+ & npm
- MySQL 8.0+

### One-Step Setup
A helper script is provided to initialize both backend and frontend environments:
```bash
./setup.sh
```

### Manual Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

---

## 📖 Documentation

Detailed documentation is available in the `docs/` directory:
- 📑 [API Documentation](docs/API_DOCUMENTATION.md) - Endpoint schema and authentication.
- 🚀 [Deployment Guide](docs/DEPLOYMENT_GUIDE.md) - Production server configuration and optimization.
- 📋 [Product Requirements](PRD.md) - Functional and technical specifications.

---

## ✅ Engineering Highlights

1.  **Role-Driven Security**: Strict RBAC ensuring users only access data relevant to their department or role.
2.  **Auditability**: Every ticket transition and comment is logged for accountability.
3.  **Production Ready**: Includes error boundaries, toast notifications, lean state management, and optimized asset delivery.
4.  **Realistic Data**: Seeders generate a rich history of tickets and knowledge base articles for immediate evaluation.

---
*Created as a production-minded portfolio application demonstrating end-to-end full-stack ownership.*
