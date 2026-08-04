# AI-IGMS · AI-Enabled Integrated Government School Management System

A modern, production-quality **frontend** for a government school management
platform — built to feel like a premium SaaS admin dashboard (in the spirit of
Linear, Vercel, and Clerk) while remaining fully backend-ready.

> This is a **frontend-only** foundation. All data is realistic dummy data
> served through a mock service layer (`src/services`) that can be swapped for a
> real API without touching component code.

## ✨ Features

- **13 fully-built pages** — Login, Dashboard, Students, Teachers, Attendance,
  Examination, Results, Timetable, Notice Board, Reports & Analytics, two AI
  modules, and a 404 page.
- **Reusable design system** — Button, Input, Card, Modal, Table, Badge, Avatar,
  Dropdown, SearchBox, Loader, Pagination, EmptyState, Toast, StatCard,
  ChartCard, SectionHeader, Breadcrumb.
- **AI Suite (UI only)** — AI Question Paper Generator and AI Student Performance
  Analysis, powered by a mock AI service that returns dummy output.
- **Custom SVG charts** — area, bar, and donut charts with zero heavy chart deps.
- **Auth flow** — frontend-only login with a protected route guard.
- **Framer Motion** page transitions, toasts, modals, and micro-interactions.
- **Fully responsive** across desktop, tablet, and mobile.

## 🧱 Tech Stack

- **React 18** + **Vite**
- **React Router DOM 6**
- **Tailwind CSS 3**
- **Framer Motion**
- **React Icons**

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Then open the URL printed in the terminal (default `http://localhost:3000`).

### Demo credentials

The login form is pre-filled. Otherwise use:

```
Email:    admin@igms.gov.in
Password: admin@123
```

## 📁 Project Structure

```
src/
├── assets/            # Static assets
├── components/
│   ├── ui/            # Reusable primitives (Button, Modal, Table, …)
│   ├── common/        # Higher-level shared (StatCard, PageHeader, Breadcrumb…)
│   ├── charts/        # Custom SVG charts
│   └── dashboard/     # Dashboard-specific widgets
├── constants/         # Navigation, app config, theme tokens
├── context/           # AuthContext, ToastContext
├── data/              # Realistic dummy data
├── hooks/             # useFetch, useDebounce, usePagination, useMediaQuery
├── layouts/           # AuthLayout, DashboardLayout, Sidebar, Navbar, Footer
├── pages/             # One file per page (+ pages/ai, pages/auth)
├── routes/            # AppRoutes, ProtectedRoute, PageTransition
├── services/          # Mock API + AI service (backend-ready)
├── styles/            # Global Tailwind styles
└── utils/             # cn, formatting, filtering helpers
```

## 🎨 Design System

| Token       | Color     |
|-------------|-----------|
| Primary     | `#2563EB` |
| Secondary   | `#4F46E5` |
| Accent      | `#10B981` |
| Warning     | `#F59E0B` |
| Danger      | `#EF4444` |
| Background  | `#F8FAFC` |
| Sidebar     | `#1E293B` |

## 🔌 Connecting a Backend

Replace the function bodies in `src/services/api.js` and
`src/services/aiService.js` with real `fetch`/axios calls. The component layer
consumes these via the `useFetch` hook and won't need changes.

## 📜 Scripts

```bash
npm run dev       # start dev server
npm run build     # production build
npm run preview   # preview the production build
```
