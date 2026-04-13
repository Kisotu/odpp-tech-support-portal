# ODPP Tech Support Portal

A localized Help Desk system for the Office of the Director of Public Prosecutions (ODPP) Kenya.

## Project Status

- ✅ **Phase 1: Foundation** - Complete
- 🚧 **Phase 2: Core Ticket System** - In Progress
- ⏳ **Phase 3: ICT Features** - Planned
- ⏳ **Phase 4: Reporting & Knowledge Base** - Planned
- ⏳ **Phase 5: Polish & Deployment** - Planned

## Project Structure

```
.
├── backend/     # Laravel API
├── frontend/    # React + Vite frontend
├── docs/        # Documentation
└── PRD.md       # Product Requirements Document
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



## License

MIT
