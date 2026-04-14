# ODPP Tech Support Portal - API Documentation

**Version:** 1.0
**Date:** April 14, 2026
**Base URL:** `/api`

---

## Authentication

All API endpoints require authentication except for login. Use Bearer token authentication with Laravel Sanctum.

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@odpp.go.ke",
  "password": "password"
}
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@odpp.go.ke",
    "role": "admin",
    "department": "ICT",
    "phone": null
  },
  "token": "1|abc123..."
}
```

**Error Response (401):**
```json
{
  "message": "Invalid credentials"
}
```

---

### Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

### Get Current User
```http
GET /api/auth/user
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Admin User",
  "email": "admin@odpp.go.ke",
  "role": "admin",
  "department": "ICT",
  "phone": null
}
```

---

## Dashboard

### Get Dashboard Statistics
```http
GET /api/dashboard/stats
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "stats": {
    "total_tickets": 150,
    "new": 12,
    "in_progress": 25,
    "resolved": 95,
    "closed": 18,
    "my_tickets": 8,
    "unassigned": 5
  }
}
```

---

### Get Dashboard Trends
```http
GET /api/dashboard/trends?period=30
Authorization: Bearer {token}
```

**Query Parameters:**
- `period` (optional): Number of days to look back (default: 30)

**Response (200):**
```json
{
  "trends": {
    "dates": ["2026-03-15", "2026-03-16", ...],
    "created": [5, 8, 3, ...],
    "resolved": [3, 6, 4, ...]
  }
}
```

---

### Get Officer Performance
```http
GET /api/dashboard/performance
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "performance": [
    {
      "id": 2,
      "name": "ICT Officer 1",
      "avg_resolution_hours": 18.5,
      "resolved_count": 25,
      "open_tickets": 3
    }
  ]
}
```

---

## Tickets

### List Tickets
```http
GET /api/tickets?status=new&priority=high&category=software&search=issue&page=1&per_page=15
Authorization: Bearer {token}
```

**Query Parameters:**
- `status` (optional): Filter by status (`new`, `in_progress`, `resolved`, `closed`)
- `priority` (optional): Filter by priority (`low`, `medium`, `high`, `critical`)
- `category` (optional): Filter by category
- `search` (optional): Search in title and description
- `page` (optional): Page number (default: 1)
- `per_page` (optional): Items per page (default: 15)
- `assigned_to` (optional): Filter by assigned officer ID

**Response (200):**
```json
{
  "tickets": [
    {
      "id": 1,
      "ticket_number": "TKT-20260413-ABC123",
      "title": "Issue Title",
      "description": "Issue description...",
      "category": "software",
      "priority": "high",
      "status": "new",
      "location": "Room 101",
      "contact_phone": "+254700123456",
      "user_id": 5,
      "assigned_to": null,
      "created_at": "2026-04-13T10:00:00Z",
      "updated_at": "2026-04-13T10:00:00Z",
      "user": { "id": 5, "name": "Staff User", "email": "staff@odpp.go.ke" },
      "assigned_to_user": null
    }
  ],
  "pagination": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 15,
    "total": 75
  }
}
```

---

### Create Ticket
```http
POST /api/tickets
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Issue Title",
  "description": "Detailed description of the issue...",
  "category": "software",
  "priority": "high",
  "location": "Room 101",
  "contact_phone": "+254700123456"
}
```

**Request Body:**
- `title` (required): Ticket title (min 10 characters)
- `description` (required): Detailed description (min 20 characters)
- `category` (required): One of `hardware`, `software`, `network`, `printer`, `email`, `account`, `other`
- `priority` (optional): One of `low`, `medium`, `high`, `critical` (default: `medium`)
- `location` (optional): Physical location
- `contact_phone` (optional): Contact phone number

**Response (201):**
```json
{
  "ticket": {
    "id": 10,
    "ticket_number": "TKT-20260414-XYZ789",
    "title": "Issue Title",
    "status": "new",
    ...
  },
  "message": "Ticket created successfully"
}
```

---

### Get Ticket
```http
GET /api/tickets/{id}
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "ticket": {
    "id": 1,
    "ticket_number": "TKT-20260413-ABC123",
    "title": "Issue Title",
    "description": "Issue description...",
    "category": "software",
    "priority": "high",
    "status": "new",
    "user_id": 5,
    "assigned_to": 2,
    "created_at": "2026-04-13T10:00:00Z",
    "resolved_at": null,
    "closed_at": null,
    "user": { "id": 5, "name": "Staff User" },
    "assigned_to_user": { "id": 2, "name": "ICT Officer" },
    "comments": [
      {
        "id": 1,
        "comment": "This is a comment",
        "is_internal": false,
        "created_at": "2026-04-13T11:00:00Z",
        "user": { "id": 2, "name": "ICT Officer" }
      }
    ],
    "attachments": [
      {
        "id": 1,
        "file_name": "screenshot.png",
        "file_size": 1024
      }
    ]
  }
}
```

---

### Update Ticket
```http
PUT /api/tickets/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "priority": "critical"
}
```

**Request Body:** All fields optional
- `title`: Updated title
- `description`: Updated description
- `category`: Updated category
- `priority`: Updated priority
- `status`: Updated status
- `resolution_notes`: Resolution notes

**Response (200):**
```json
{
  "ticket": { ... },
  "message": "Ticket updated successfully"
}
```

---

### Delete Ticket
```http
DELETE /api/tickets/{id}
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "message": "Ticket deleted successfully"
}
```

---

### Assign Ticket
```http
POST /api/tickets/{id}/assign
Authorization: Bearer {token}
Content-Type: application/json

{
  "officer_id": 3
}
```

**Response (200):**
```json
{
  "message": "Ticket assigned successfully"
}
```

---

### Update Ticket Status
```http
POST /api/tickets/{id}/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "in_progress",
  "comment": "Working on this issue"
}
```

**Request Body:**
- `status` (required): One of `new`, `in_progress`, `resolved`, `closed`
- `comment` (optional): Add a comment with the status change

**Response (200):**
```json
{
  "message": "Status updated successfully"
}
```

---

### Reopen Ticket
```http
POST /api/tickets/{id}/reopen
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "message": "Ticket reopened successfully"
}
```

---

### Get Ticket Comments
```http
GET /api/tickets/{id}/comments
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "comments": [
    {
      "id": 1,
      "comment": "Comment text",
      "is_internal": false,
      "created_at": "2026-04-13T11:00:00Z",
      "user": { "id": 2, "name": "ICT Officer" }
    }
  ]
}
```

---

### Add Comment
```http
POST /api/tickets/{id}/comments
Authorization: Bearer {token}
Content-Type: application/json

{
  "comment": "This is a comment",
  "is_internal": false
}
```

**Request Body:**
- `comment` (required): Comment text
- `is_internal` (optional): If true, only ICT officers can see (default: false)

**Response (201):**
```json
{
  "comment": { ... }
}
```

---

### Upload Attachment
```http
POST /api/tickets/{id}/attachments
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [binary data]
```

**Response (201):**
```json
{
  "attachment": {
    "id": 5,
    "file_name": "screenshot.png",
    "file_size": 102400,
    "file_path": "/storage/attachments/..."
  }
}
```

---

### Delete Attachment
```http
DELETE /api/tickets/{ticketId}/attachments/{attachmentId}
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "message": "Attachment deleted successfully"
}
```

---

## Users

### List Users
```http
GET /api/users
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "users": [
    {
      "id": 1,
      "name": "Admin User",
      "email": "admin@odpp.go.ke",
      "role": "admin",
      "department": "ICT",
      "created_at": "2026-04-01T00:00:00Z"
    }
  ]
}
```

---

### Get ICT Officers
```http
GET /api/users/role/ict-officers
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "users": [
    {
      "id": 2,
      "name": "ICT Officer 1",
      "email": "ict1@odpp.go.ke",
      "department": "ICT"
    }
  ]
}
```

---

## Reports

### Resolution Times Report
```http
GET /api/reports/resolution-times?start_date=2026-03-01&end_date=2026-04-01
Authorization: Bearer {token}
```

**Query Parameters:**
- `start_date` (optional): Start date (default: 30 days ago)
- `end_date` (optional): End date (default: now)
- `category` (optional): Filter by category
- `priority` (optional): Filter by priority

**Response (200):**
```json
{
  "by_category": [
    {
      "category": "software",
      "avg_hours": 24.5,
      "min_hours": 2,
      "max_hours": 72,
      "ticket_count": 15
    }
  ],
  "overall_avg_hours": 22.3,
  "period": {
    "start": "2026-03-01T00:00:00Z",
    "end": "2026-04-01T00:00:00Z"
  }
}
```

---

### Tickets by Category Report
```http
GET /api/reports/by-category?start_date=2026-03-01&end_date=2026-04-01
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "by_category": [
    {
      "category": "software",
      "total": 25,
      "new_count": 3,
      "in_progress_count": 5,
      "resolved_count": 15,
      "closed_count": 2
    }
  ],
  "priority_breakdown": {
    "software": { "high": 5, "medium": 15, "low": 5 }
  },
  "period": { ... }
}
```

---

### SLA Compliance Report
```http
GET /api/reports/sla-compliance?start_date=2026-03-01&end_date=2026-04-01
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "compliance": {
    "critical": {
      "total": 5,
      "met": 4,
      "breached": 1,
      "compliance_rate": 80.0,
      "sla_target_hours": 4
    },
    "high": { ... },
    "medium": { ... },
    "low": { ... }
  },
  "overall_compliance_rate": 85.5,
  "period": { ... }
}
```

**SLA Targets:**
- Critical: 4 hours resolution
- High: 24 hours resolution
- Medium: 72 hours resolution
- Low: 7 days resolution

---

### Officer Workload Report
```http
GET /api/reports/officer-workload
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "workload": [
    {
      "id": 2,
      "name": "ICT Officer 1",
      "email": "ict1@odpp.go.ke",
      "department": "ICT",
      "total_assigned": 15,
      "total_resolved": 12,
      "in_progress": 2,
      "new_tickets": 1,
      "avg_resolution_time": 18.5
    }
  ]
}
```

---

### Export CSV
```http
GET /api/reports/export-csv?type=tickets
Authorization: Bearer {token}
```

**Response (200):**
Content-Type: text/csv
Content-Disposition: attachment; filename="tickets_export_2026-04-14.csv"

---

## Knowledge Base

### List Articles
```http
GET /api/knowledge-base?search=printer&category=hardware
Authorization: Bearer {token}
```

**Query Parameters:**
- `search` (optional): Search in title and content
- `category` (optional): Filter by category
- `page` (optional): Page number (default: 1)

**Response (200):**
```json
{
  "articles": [
    {
      "id": 1,
      "title": "How to Setup Printer",
      "content": "<p>HTML content...</p>",
      "category": "printer",
      "views": 45,
      "is_published": true,
      "author": { "id": 2, "name": "ICT Officer" },
      "created_at": "2026-04-01T00:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

---

### Create Article
```http
POST /api/knowledge-base
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "How to Setup Printer",
  "content": "<p>HTML content...</p>",
  "category": "printer",
  "is_published": true
}
```

**Request Body:**
- `title` (required): Article title
- `content` (required): Article content (HTML supported)
- `category` (required): One of `hardware`, `software`, `network`, `printer`, `email`, `account`, `other`
- `is_published` (optional): Whether to publish (default: true)

**Response (201):**
```json
{
  "article": { ... }
}
```

---

### Get Article
```http
GET /api/knowledge-base/{id}
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "article": {
    "id": 1,
    "title": "How to Setup Printer",
    "content": "<p>HTML content...</p>",
    "category": "printer",
    "views": 46,
    "is_published": true,
    "author": { "id": 2, "name": "ICT Officer" },
    "created_at": "2026-04-01T00:00:00Z",
    "updated_at": "2026-04-10T00:00:00Z"
  }
}
```

---

### Update Article
```http
PUT /api/knowledge-base/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "<p>Updated content...</p>",
  "is_published": false
}
```

**Response (200):**
```json
{
  "article": { ... }
}
```

---

### Delete Article
```http
DELETE /api/knowledge-base/{id}
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "message": "Article deleted successfully"
}
```

---

### Get Categories
```http
GET /api/knowledge-base/categories
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "categories": [
    { "value": "hardware", "label": "Hardware" },
    { "value": "software", "label": "Software" },
    { "value": "network", "label": "Network" },
    { "value": "printer", "label": "Printer" },
    { "value": "email", "label": "Email" },
    { "value": "account", "label": "Account" },
    { "value": "other", "label": "Other" }
  ]
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "message": "Unauthenticated."
}
```

### 403 Forbidden
```json
{
  "message": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 422 Validation Error
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "title": ["The title field is required."],
    "category": ["The selected category is invalid."]
  }
}
```

### 500 Server Error
```json
{
  "message": "Server error"
}
```

---

## Role Permissions

| Endpoint | Staff | ICT Officer | Admin |
|----------|-------|-------------|-------|
| Create ticket | Yes | Yes | Yes |
| View own tickets | Yes | Yes | Yes |
| View all tickets | No | Yes | Yes |
| Update ticket | Own only | Assigned | Yes |
| Delete ticket | No | No | Yes |
| Assign ticket | No | Yes | Yes |
| Add comments | Yes | Yes | Yes |
| Add internal comments | No | Yes | Yes |
| View reports | No | Yes | Yes |
| Manage users | No | No | Yes |
| Knowledge base (CRUD) | View | Create/Edit | Create/Edit |

---

## Status Values

- `new`: Newly created ticket
- `in_progress`: Being worked on
- `resolved`: Issue resolved, awaiting confirmation
- `closed`: Confirmed resolved or auto-closed

## Priority Values

- `low`: Non-urgent issue
- `medium`: Standard priority
- `high`: Urgent issue
- `critical`: Emergency, immediate attention needed

## Category Values

- `hardware`: Computer, laptop, monitor, peripherals
- `software`: Application issues, installations
- `network`: Internet, VPN, connectivity
- `printer`: Printer setup, issues
- `email`: Outlook, email delivery
- `account`: Password, access issues
- `other`: Miscellaneous