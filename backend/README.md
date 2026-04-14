# ODPP Tech Support - Backend 🚀

[![Laravel 11](https://img.shields.io/badge/Laravel-11-FF2D20?style=for-the-badge&logo=laravel)](https://laravel.com)
[![PHP 8.2+](https://img.shields.io/badge/PHP-8.2%2B-777BB4?style=for-the-badge&logo=php)](https://www.php.net)
[![MySQL 8](https://img.shields.io/badge/Database-MySQL%208-4479A1?style=for-the-badge&logo=mysql)](https://www.mysql.com)
[![Sanctum](https://img.shields.io/badge/Auth-Sanctum-EB4432?style=for-the-badge)](https://laravel.com/docs/sanctum)

The Laravel 11-powered REST API for the **ODPP Tech Support Portal**. This backend handles all business logic, authentication, ticket lifecycle management, and reporting for the service desk platform.

---

## 🛠️ Core Capabilities

- **🔐 Robust Auth**: Token-based authentication using Laravel Sanctum with specific role-based access levels (`staff`, `ict`, `admin`).
- **🎫 Ticket Engine**: Complex ticket lifecycle state machine supporting file attachments and internal/public comments.
- **📚 Knowledge Management**: API for creating, managing, and searching support articles.
- **📈 Analytics API**: Aggregated data endpoints for SLA compliance, resolution times, and team throughput.
- **📜 Audit Logging**: Transparent tracking of all sensitive actions within the ticket lifecycle.
- **📦 Data Seeding**: Rich, idempotent seeders that populate the system with realistic historical ticket data for testing.

---

## 🏗️ Project Structure

```text
backend/
├── 📂 app/
│   ├── 📂 Http/Controllers/Api/ # Resource controllers (Ticket, Auth, Reports)
│   ├── 📂 Models/               # Eloquent Models (Ticket, User, Comment, AuditLog)
│   └── 📂 Providers/            # Application service providers
├── 📂 database/
│   ├── 📂 migrations/           # Ticket, KB, and Audit log table definitions
│   └── 📂 seeders/              # Realistic dataset generators
├── 📂 routes/
│   └── 📄 api.php               # Protected & public API definitions
├── 📂 tests/
│   └── 📂 Feature/              # Integration tests for key workflows
└── 📄 artisan                   # Laravel CLI tool
```

---

## 🚀 Setup & Installation

### Prerequisites
- PHP 8.2+
- Composer
- MySQL 8.0+

### Installation

1.  **Install Dependencies**:
    ```bash
    composer install
    ```

2.  **Environment Setup**:
    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

3.  **Database Configuration**:
    Update `.env` with your DB credentials:
    ```env
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=odpp_support
    DB_USERNAME=root
    DB_PASSWORD=
    ```

4.  **Run Migrations & Seeders**:
    ```bash
    php artisan migrate --seed
    ```

5.  **Start Server**:
    ```bash
    php artisan serve
    ```

---

## 📖 API Documentation

The API endpoints are documented with their expected payloads and responses.
- 📑 [View Full API Docs](../docs/API_DOCUMENTATION.md)

### Key Endpoints
- `POST /api/login` - Authenticate and receive Sanctum token.
- `GET /api/tickets` - List tickets (filtered by role).
- `POST /api/tickets` - Submit a new support request.
- `GET /api/reports/sla` - Retrieve SLA compliance statistics.

---

## ✅ Best Practices Implemented

1.  **Form Request Validation**: Centralized validation rules for all incoming requests.
2.  **API Resources**: Consistent JSON response formatting and data transformation.
3.  **Eloquent Relationships**: Optimized queries using eager loading for comments, users, and attachments.
4.  **Transaction Management**: Ensuring data integrity during multi-step ticket updates.

---
*Part of the ODPP Tech Support Portal project.*
