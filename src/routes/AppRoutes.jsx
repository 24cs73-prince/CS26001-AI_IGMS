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

// Teacher portal
import MarkAttendance from "../pages/teacher/MarkAttendance";
import UploadMarks from "../pages/teacher/UploadMarks";
import ApplyLeave from "../pages/teacher/ApplyLeave";

// Student portal (placeholder)
import StudentHome from "../pages/student/StudentHome";

/**
 * Central route configuration.
 * - /login             → AuthLayout (public)
 * - principal routes   → DashboardLayout, role "principal"
 * - teacher routes     → DashboardLayout, role "teacher"
 * - student route      → DashboardLayout, role "student" (placeholder)
 */
export default function AppRoutes() {
  const location = useLocation();

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

        {/* Principal (admin) routes */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["principal"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={page(Dashboard)} />
          <Route path="/students" element={page(Students)} />
          <Route path="/teachers" element={page(Teachers)} />
        </Route>

        {/* Teacher routes */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/teacher/attendance" element={page(MarkAttendance)} />
          <Route path="/teacher/marks" element={page(UploadMarks)} />
          <Route path="/teacher/leave" element={page(ApplyLeave)} />
        </Route>

        {/* Student route (placeholder) */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/student" element={page(StudentHome)} />
        </Route>

        {/* Redirects & fallback */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}
