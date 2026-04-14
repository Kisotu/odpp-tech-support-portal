# ODPP Tech Support - Frontend 🎨

[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Build-Vite%208-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![Tailwind CSS 4](https://img.shields.io/badge/Styling-Tailwind%204-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![Zustand](https://img.shields.io/badge/State-Zustand-443E38?style=for-the-badge)](https://zustand-demo.pmnd.rs/)

The React-based client for the **ODPP Tech Support Portal**. This application provides a modern, responsive, and role-aware user interface for staff, ICT officers, and administrators.

---

## 🚀 Technical Highlights

- **⚛️ Modern React Stack**: Leverages React 19 and Vite for lightning-fast development and optimized production builds.
- **🎨 Tailwind 4 Styling**: Uses the latest Tailwind CSS for a utility-first, performant design system.
- **🐻 Lean State Management**: Zustand handles global state for authentication, theming, and notifications.
- **📡 Efficient Data Fetching**: TanStack Query (React Query) manages server state with intelligent caching and synchronization.
- **📊 Interactive Analytics**: Integrated Recharts for visualizing ticketing trends and SLA performance.
- **🛡️ Role-Aware Routing**: Dynamic navigation and view rendering based on user roles (`Staff`, `ICT Officer`, `Admin`).

---

## 🏗️ Project Structure

```text
frontend/
├── 📂 public/          # Static assets
├── 📂 src/
│   ├── 📂 assets/      # Styles and images
│   ├── 📂 components/  # Reusable UI components (Common, Tickets)
│   ├── 📂 hooks/       # Custom React hooks
│   ├── 📂 pages/       # View components (Dashboard, TicketView, KnowledgeBase, etc.)
│   ├── 📂 services/    # API communication (Axios)
│   ├── 📂 store/       # Zustand store definitions (Auth, Theme, Toast)
│   ├── 📂 utils/       # Helper functions and formatters
│   ├── 📄 App.jsx      # Main router and provider configuration
│   └── 📄 main.jsx     # Application entry point
├── 📄 vite.config.js   # Build and dev server configuration
└── 📄 tailwind.config.js # Styling customization
```

---

## 🛠️ Development Setup

### Installation

```bash
npm install
```

### Run Locally

```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

### Environment Configuration

Create a `.env` file in the `frontend/` directory (if not already managed by the root `setup.sh`):

```env
VITE_API_URL=http://localhost:8000/api
```

---

## 📖 Key Dependencies

- **Routing**: `react-router-dom` (v7)
- **API Client**: `axios`
- **Charts**: `recharts`
- **Data Hooks**: `@tanstack/react-query`
- **Form validation**: `prop-types`

---

## ✅ Best Practices Implemented

1.  **Component Modularity**: High degree of reusability across ticket management and data displays.
2.  **Clean State Logic**: Separation of UI state (Zustand) from server state (TanStack Query).
3.  **Responsive Design**: Built with a mobile-first approach to ensure accessibility for ODPP staff on the go.
4.  **Error Handling**: Global error boundaries and real-time toast notifications for improved user experience.

---
*Part of the ODPP Tech Support Portal project.*
