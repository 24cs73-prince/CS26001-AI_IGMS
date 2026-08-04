import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import PageTransition from "./PageTransition";
import { useAuth } from "../context/AuthContext";

// Pages
import Login from "../pages/auth/Login";
import Dashboard from "../pages/Dashboard";
import Students from "../pages/Students";
import Teachers from "../pages/Teachers";
import MarkAttendance from "../pages/teacher/MarkAttendance";
import UploadMarks from "../pages/teacher/UploadMarks";
import ApplyLeave from "../pages/teacher/ApplyLeave";
import NotFound from "../pages/NotFound";
import StudentHome from "../pages/student/StudentHome";

/** Sends "/" to the logged-in user's home portal (or login if signed out). */
function RoleHome() {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={user?.home || "/dashboard"} replace />;
}

/**
 * Central route configuration.
 * - /login          → AuthLayout (public)
 * - all app routes  → DashboardLayout (protected)
 * Each page is additionally guarded by role via `allowedRoles`, so teacher
 * pages live only in the teacher portal and management pages only in the
 * principal portal.
 */
export default function AppRoutes() {
  const location = useLocation();

  // Wrap a page with its transition + a role guard
  const page = (Component, allowedRoles) => (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <PageTransition>
        <Component />
      </PageTransition>
    </ProtectedRoute>
  );

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected app shell (requires auth) */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Principal portal */}
          <Route path="/dashboard" element={page(Dashboard, ["principal"])} />
          <Route path="/students" element={page(Students, ["principal"])} />
          <Route path="/teachers" element={page(Teachers, ["principal"])} />

          {/* Teacher portal */}
          <Route path="/teacher/attendance" element={page(MarkAttendance, ["teacher"])} />
          <Route path="/teacher/marks" element={page(UploadMarks, ["teacher"])} />
          <Route path="/teacher/leave" element={page(ApplyLeave, ["teacher"])} />

          {/* Student portal */}
          <Route path="/student/home" element={page(StudentHome, ["student"])} />
        </Route>

        {/* Redirects & fallback */}
        <Route path="/" element={<RoleHome />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}
