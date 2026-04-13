ow# Product Requirements Document (PRD)
## ODPP Tech Support Portal

**Version:** 1.0  
**Date:** April 12, 2026  
**Author:** Portfolio Project  
**Status:** Draft  

---

## 1. Executive Summary

The **ODPP Tech Support Portal** is a localized Help Desk system designed for the Office of the Director of Public Prosecutions (ODPP) Kenya. The application enables ODPP staff to report hardware or software issues efficiently while allowing ICT officers to track, manage, and resolve tickets with full visibility into resolution times and performance metrics.

This project directly demonstrates readiness for "Providing technical support to end users" and showcases full-stack development capabilities using modern technologies.

---

## 2. Objectives

### Primary Objectives
- Provide a centralized platform for IT issue reporting and resolution tracking
- Reduce response times through automated ticket routing and notifications
- Generate actionable reports on ICT support performance and resolution metrics
- Maintain a searchable knowledge base for common issues and solutions

### Success Metrics
- Average ticket resolution time (target: < 24 hours for critical issues)
- First-response time tracking
- Ticket volume trends by category
- User satisfaction scores (post-resolution survey)

---

## 3. User Personas

### 3.1 ODPP Staff (End Users)
- **Role:** Prosecutors, administrative staff, legal officers
- **Technical Level:** Basic to intermediate
- **Goals:** Quickly report IT issues, track resolution progress, find self-service solutions
- **Pain Points:** Unclear status of reported issues, no visibility into resolution timeline

### 3.2 ICT Support Officers
- **Role:** IT support staff, system administrators
- **Technical Level:** Advanced
- **Goals:** Efficiently manage assigned tickets, track resolution times, identify recurring issues
- **Pain Points:** Unprioritized ticket queue, lack of performance metrics, repetitive issues

### 3.3 ICT Manager (Admin)
- **Role:** Head of ICT department
- **Technical Level:** Advanced
- **Goals:** Monitor team performance, identify training needs, optimize resource allocation
- **Pain Points:** Limited visibility into support workload, no data-driven insights

---

## 4. Functional Requirements

### 4.1 Authentication & Authorization

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| AUTH-001 | Users can log in using email/password with Laravel Sanctum tokens | High | Planned |
| AUTH-002 | Role-based access control (Staff, ICT Officer, Admin) | High | Planned |
| AUTH-003 | Password reset functionality via email | Medium | Planned |
| AUTH-004 | Session timeout after 30 minutes of inactivity | Low | Planned |

### 4.2 Ticket Management

#### 4.2.1 Ticket Creation (Staff)
| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| TICK-001 | Create new ticket with title, description, category, priority | High | Planned |
| TICK-002 | Categories: Hardware, Software, Network, Printer, Email, Other | High | Planned |
| TICK-003 | Priority levels: Low, Medium, High, Critical | High | Planned |
| TICK-004 | Auto-capture user info: name, department, contact, timestamp | High | Planned |
| TICK-005 | Attach screenshots/files (max 5MB) | Medium | Planned |
| TICK-006 | Receive confirmation email with ticket number | Medium | Planned |

#### 4.2.2 Ticket Assignment (ICT Officer)
| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| TICK-007 | View unassigned tickets in queue | High | Planned |
| TICK-008 | Self-assign or manager-assign tickets | High | Planned |
| TICK-009 | View tickets assigned to me | High | Planned |
| TICK-010 | Reassign tickets to other ICT officers | Medium | Planned |

#### 4.2.3 Ticket Resolution Workflow
| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| TICK-011 | Status workflow: New → In Progress → Resolved → Closed | High | Planned |
| TICK-012 | Add comments/notes visible to staff | High | Planned |
| TICK-013 | Add internal notes (ICT only) | High | Planned |
| TICK-014 | Mark ticket as resolved with solution summary | High | Planned |
| TICK-015 | Staff can reopen resolved tickets within 7 days | Medium | Planned |
| TICK-016 | Auto-close resolved tickets after 7 days if not reopened | Low | Planned |

### 4.3 Dashboard & Views

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| DASH-001 | Staff dashboard: My Tickets, New Ticket, Knowledge Base | High | Planned |
| DASH-002 | ICT dashboard: Queue, My Tickets, Reports, Knowledge Base | High | Planned |
| DASH-003 | Ticket list with filters: status, category, priority, date range | High | Planned |
| DASH-004 | Search tickets by ID, title, or description | High | Planned |
| DASH-005 | Pagination (25 tickets per page) | Medium | Planned |

### 4.4 Notifications

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| NOTIF-001 | Email notification on ticket creation to staff | High | Planned |
| NOTIF-002 | Email notification on status change (assigned, resolved) | High | Planned |
| NOTIF-003 | Email notification on comment/reply | Medium | Planned |
| NOTIF-004 | In-app notification bell icon | Low | Planned |

### 4.5 Knowledge Base

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| KB-001 | Searchable articles with categories | Medium | Planned |
| KB-002 | ICT officers can create/edit articles | Medium | Planned |
| KB-003 | Link tickets to knowledge base solutions | Low | Planned |
| KB-004 | Article ratings (helpful/not helpful) | Low | Planned |

### 4.6 Reporting & Analytics (ICT/Admin)

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| RPT-001 | Average resolution time by category | High | Planned |
| RPT-002 | Tickets by status (open, in progress, resolved) | High | Planned |
| RPT-003 | Tickets by priority and SLA compliance | High | Planned |
| RPT-004 | ICT officer workload and performance | Medium | Planned |
| RPT-005 | Export reports to CSV/PDF | Medium | Planned |
| RPT-006 | Time-based charts (daily, weekly, monthly) | Medium | Planned |

---

## 5. Non-Functional Requirements

### 5.1 Performance
- Page load time < 2 seconds
- API response time < 500ms
- Support concurrent users: 100+

### 5.2 Security
- HTTPS-only communication
- Password hashing (bcrypt)
- SQL injection prevention (Eloquent ORM)
- XSS protection (React escaping)
- CSRF protection on forms
- Rate limiting on API endpoints

### 5.3 Usability
- Responsive design (mobile, tablet, desktop)
- Support for modern browsers (Chrome, Firefox, Safari, Edge)
- Accessible (WCAG 2.1 AA compliance)

### 5.4 Data Retention
- Ticket history retained for 2 years
- Soft delete for tickets (can be restored)
- Audit log for all status changes

---

## 6. Technical Architecture

### 6.1 Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React 18 + Vite | UI framework and build tool |
| State Management | React Query + Zustand | Server state and client state |
| Styling | Tailwind CSS | Utility-first CSS framework |
| UI Components | Headless UI / Radix | Accessible components |
| Charts | Recharts | Data visualization |
| Backend | Laravel 11 | API and business logic |
| Authentication | Laravel Sanctum | Token-based API auth |
| Database | MySQL 8.0 | Primary data store |
| Queue | Laravel Queues (database) | Background jobs |
| Mail | Laravel Mail (SMTP) | Email notifications |
| File Storage | Local disk (public) | Attachment storage |

### 6.2 Database Schema (Key Tables)

```
users
├── id, name, email, password, role, department, phone, created_at

tickets
├── id, user_id, assigned_to, title, description, category, priority
├── status, created_at, updated_at, resolved_at, closed_at

ticket_comments
├── id, ticket_id, user_id, comment, is_internal, created_at

ticket_attachments
├── id, ticket_id, file_path, file_name, file_size, created_at

knowledge_base_articles
├── id, title, content, category, author_id, views, created_at

audit_logs
├── id, ticket_id, user_id, action, old_value, new_value, created_at
```

### 6.3 API Endpoints

```
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/user

GET    /api/tickets
POST   /api/tickets
GET    /api/tickets/{id}
PUT    /api/tickets/{id}
DELETE /api/tickets/{id}
POST   /api/tickets/{id}/assign
POST   /api/tickets/{id}/comments
GET    /api/tickets/{id}/comments

GET    /api/dashboard/stats
GET    /api/reports/resolution-times
GET    /api/reports/by-category
GET    /api/reports/performance

GET    /api/knowledge-base
POST   /api/knowledge-base
GET    /api/knowledge-base/{id}
```

---

## 7. User Interface Design

### 7.1 Color Scheme
- **Primary:** #1E3A8A (Deep Blue - ODPP official)
- **Secondary:** #059669 (Green - success/resolution)
- **Accent:** #D97706 (Amber - warnings/pending)
- **Danger:** #DC2626 (Red - critical/errors)
- **Background:** #F9FAFB (Light gray)

### 7.2 Key Screens

1. **Login Page** - Simple, branded with ODPP colors
2. **Staff Dashboard** - My tickets summary, quick create button, status cards
3. **Ticket List** - Table with filters, search, pagination
4. **Ticket Detail** - Full conversation thread, status actions, attachments
5. **Create Ticket** - Form with category/priority selection
6. **ICT Dashboard** - Queue stats, performance charts, quick actions
7. **Reports Page** - Charts and data tables with export options
8. **Knowledge Base** - Searchable article list and detail view

### 7.3 Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

---

## 8. Project Structure

```
odpp-tech-support-portal/
├── backend/                    # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   └── Requests/
│   │   ├── Models/
│   │   ├── Services/
│   │   └── Notifications/
│   ├── config/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   │   └── api.php
│   └── tests/
│
├── frontend/                   # React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── tickets/
│   │   │   └── dashboard/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   └── utils/
│   ├── public/
│   └── tests/
│
├── docs/                       # Documentation
├── docker-compose.yml          # Development environment
└── README.md
```

---

## 9. Development Phases

### Phase 1: Foundation (Week 1)
- [x] Set up Laravel project with Sanctum
- [x] Create database migrations and seeders
- [x] Implement authentication API endpoints
- [x] Set up React + Vite project
- [x] Configure Tailwind CSS
- [x] Implement login page and auth context

### Phase 2: Core Ticket System (Week 2)
- [x] Create ticket API endpoints (CRUD)
- [x] Build ticket creation form
- [x] Build ticket list view with filters
- [x] Build ticket detail page with comments
- [x] Implement file upload for attachments
- [ ] Add basic email notifications
- [x] Create TicketController with full CRUD
- [x] Add ticket categories and priorities validation
- [x] Implement dashboard statistics API
- [x] Build reusable UI components (tables, forms, modals)

### Phase 3: ICT Features (Week 3)
- [ ] Implement ticket assignment system
- [ ] Build ICT dashboard with queue view
- [ ] Add status workflow transitions
- [ ] Create internal notes functionality
- [ ] Implement reopen/close logic
- [ ] Add ticket priority management

### Phase 4: Reporting & Knowledge Base (Week 4)
- [ ] Create reporting API endpoints
- [ ] Build charts and analytics dashboard
- [ ] Implement knowledge base CRUD
- [ ] Add article search functionality
- [ ] Create export functionality for reports

### Phase 5: Polish & Deployment Prep (Week 5)
- [ ] Add responsive mobile styles
- [ ] Implement loading states and error handling
- [ ] Add form validation and user feedback
- [ ] Write API documentation
- [ ] Create demo seed data
- [ ] Prepare deployment guides

---

## 10. Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Time constraints | High | Prioritize core ticket features; defer nice-to-haves |
| Email setup complexity | Medium | Use Mailtrap for development; document SMTP setup |
| File upload security | Medium | Validate file types, limit size, scan for malware |
| Concurrent ticket edits | Low | Implement optimistic locking or last-write-wins |

---

## 11. Future Enhancements

- SMS notifications for critical tickets
- Slack/Teams integration for ICT alerts
- AI-powered ticket categorization
- Asset management integration (link tickets to hardware)
- Multi-language support (Swahili)
- Mobile app (React Native)
- Single Sign-On (SSO) integration

---

## 12. Appendix

### 12.1 SLA Definitions

| Priority | Response Time | Resolution Time |
|----------|---------------|-----------------|
| Critical | 1 hour | 4 hours |
| High | 4 hours | 24 hours |
| Medium | 24 hours | 72 hours |
| Low | 48 hours | 7 days |

### 12.2 Ticket Categories

1. **Hardware** - Computer, laptop, monitor, keyboard, mouse issues
2. **Software** - Application errors, installation, configuration
3. **Network** - Internet connectivity, VPN, WiFi issues
4. **Printer** - Printer setup, paper jams, toner replacement
5. **Email** - Outlook configuration, email delivery issues
6. **Account** - Password reset, account lockout
7. **Other** - General inquiries and miscellaneous issues

---

**End of Document**
