import express from "express";
import {
  submitQuiz,
  getSubmissions,
  evaluateAllSubmissions,
  publishResults,
  exportResultsCSV,
} from "../controllers/submissionController.js";
import { validateSubmitExam } from "../middleware/validateMiddleware.js";
import { protect, protectRoles, requireSchool } from "../middleware/authMiddleware.js";

const router = express.Router();

// Student Quiz Submit
router.post("/:id/submit", protect, requireSchool, protectRoles(["student"]), validateSubmitExam, submitQuiz);

// Teacher Submissions Log
router.get(
  "/:id/submissions",
  protect,
  requireSchool,
  protectRoles(["teacher", "principal", "super_admin", "admin", "student"]),
  getSubmissions
);

// Teacher Auto-Grade All Submissions
router.post("/:id/evaluate", protect, requireSchool, protectRoles(["teacher", "principal", "super_admin"]), evaluateAllSubmissions);

// Teacher Publish Results Toggle
router.patch("/:id/publish-results", protect, requireSchool, protectRoles(["teacher", "principal", "super_admin"]), publishResults);

// Export CSV Endpoint
router.get(
  "/:id/export-csv",
  protect,
  requireSchool,
  protectRoles(["teacher", "principal", "super_admin", "admin"]),
  exportResultsCSV
);

export default router;
