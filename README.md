# ODPP Tech Support Portal

A localized Help Desk system for the Office of the Director of Public Prosecutions (ODPP) Kenya.

## Project Status

- ✅ **Phase 1: Foundation** - Complete
- ✅ **Phase 2: Core Ticket System** - Complete
- ✅ **Phase 3: ICT Features** - Complete
- ✅ **Phase 4: Reporting & Knowledge Base** - Complete
- ⏳ **Phase 5: Polish & Deployment** - Planned

## Project Structure

```
.
├── backend/           # Laravel API
├── frontend/          # React + Vite frontend
├── docs/              # Documentation
└── PRD.md             # Product Requirements Document
```

## Quick Start

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8.0+

### Backend Setup (Laravel)

```bash
cd backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate app key
php artisan key:generate

# Create MySQL database
mysql -u root -e "CREATE DATABASE odpp_tech_support CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Run migrations
php artisan migrate

# Seed demo users
php artisan db:seed

# Start development server
php artisan serve
```

### Frontend Setup (React + Vite)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@odpp.go.ke | password |
| ICT Officer | ict1@odpp.go.ke | password |
| Staff | prosecutor@odpp.go.ke | password |

## Features

### Phase 1 (Complete)
- ✅ User authentication (login/logout)
- ✅ Role-based access (staff, ict_officer, admin)
- ✅ Token-based API authentication
- ✅ Protected routes
- ✅ Dashboard with statistics

### Phase 2 (Complete)
- ✅ Ticket CRUD operations
- ✅ Ticket creation form with validation
- ✅ Ticket list with filters (status, category, priority, search)
- ✅ Ticket detail view with comments
- ✅ File attachment upload
- ✅ Role-based ticket visibility
- ✅ Dashboard statistics API
- ✅ Reusable UI components

### Phase 3 (Complete)
- ✅ Ticket assignment system with modal UI
- ✅ ICT Dashboard with queue view
- ✅ Status workflow transitions with validation
- ✅ Ticket reopen functionality
- ✅ User management API
- ✅ Role-based navigation
- ✅ Role-based routing with guards

### Phase 4 (Complete)
- ✅ Reporting API with resolution times, SLA compliance, workload metrics
- ✅ Reports page with charts (Recharts) for data visualization
- ✅ Knowledge Base CRUD with article management
- ✅ Article search and category filtering
- ✅ CSV export for ticket data
- ✅ Role-based access for report and knowledge base features

## Tech Stack

**Backend:**
- Laravel 11
- Laravel Sanctum (API Authentication)
- MySQL 8.0

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- Zustand
- Recharts (Charts & Data Visualization)

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/user` - Get current user

### Tickets
- `GET /api/tickets` - List tickets (with filters)
- `POST /api/tickets` - Create ticket
- `GET /api/tickets/{id}` - Get single ticket
- `PUT /api/tickets/{id}` - Update ticket
- `DELETE /api/tickets/{id}` - Delete ticket
- `POST /api/tickets/{id}/assign` - Assign ticket
- `POST /api/tickets/{id}/status` - Update status
- `POST /api/tickets/{id}/reopen` - Reopen ticket
- `GET /api/tickets/{id}/comments` - Get comments
- `POST /api/tickets/{id}/comments` - Add comment
- `POST /api/tickets/{id}/attachments` - Upload file

### Users
- `GET /api/users` - List users (ict/admin only)
- `POST /api/users` - Create user (admin only)
- `GET /api/users/{id}` - Get user
- `PUT /api/users/{id}` - Update user (admin only)
- `DELETE /api/users/{id}` - Deactivate user (admin only)
- `GET /api/users/role/ict-officers` - List ICT officers

### Dashboard
- `GET /api/dashboard/stats` - Get statistics
- `GET /api/dashboard/trends` - Get trends
- `GET /api/dashboard/performance` - Get performance metrics

### Reports (ict/admin only)
- `GET /api/reports/resolution-times` - Resolution time by category
- `GET /api/reports/by-category` - Ticket counts by category/status
- `GET /api/reports/sla-compliance` - SLA compliance metrics
- `GET /api/reports/officer-workload` - ICT officer performance
- `GET /api/reports/export-csv` - Export tickets to CSV

### Knowledge Base
- `GET /api/knowledge-base` - List articles (with search/filter)
- `POST /api/knowledge-base` - Create article (ict/admin only)
- `GET /api/knowledge-base/categories` - Get categories
- `GET /api/knowledge-base/{id}` - Get article
- `PUT /api/knowledge-base/{id}` - Update article (ict/admin only)
- `DELETE /api/knowledge-base/{id}` - Delete article (admin only)

## License

MIT