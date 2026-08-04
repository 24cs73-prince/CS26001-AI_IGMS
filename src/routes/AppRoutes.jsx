import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import PageTransition from "./PageTransition";

// Pages
import Login from "../pages/auth/Login";
import Dashboard from "../pages/Dashboard";
import Students from "../pages/Students";
import Teachers from "../pages/Teachers";
import NotFound from "../pages/NotFound";

/**
 * Central route configuration.
 * - /login          → AuthLayout (public)
 * - all app routes  → DashboardLayout (protected)
 * AnimatePresence enables page transitions between routes.
 */
export default function AppRoutes() {
  const location = useLocation();

  // Helper to wrap each protected page with a transition
  const page = (Component) => (
    <PageTransition>
      <Component />
    </PageTransition>
  );

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected app routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={page(Dashboard)} />
          <Route path="/students" element={page(Students)} />
          <Route path="/teachers" element={page(Teachers)} />
        </Route>

        {/* Redirects & fallback */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}
