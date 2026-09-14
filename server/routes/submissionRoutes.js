import express from "express";
import {
  submitQuiz,
  getSubmissions,
  evaluateAllSubmissions,
  publishResults,
  exportResultsCSV,
} from "../controllers/submissionController.js";
import { validateSubmitExam } from "../middleware/validateMiddleware.js";
import { protect, protectRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Student Quiz Submit
router.post("/:id/submit", validateSubmitExam, submitQuiz);

// Teacher Submissions Log
router.get("/:id/submissions", getSubmissions);

// Teacher Auto-Grade All Submissions
router.post("/:id/evaluate", protect, protectRoles(["teacher", "principal"]), evaluateAllSubmissions);

// Teacher Publish Results Toggle
router.patch("/:id/publish-results", protect, protectRoles(["teacher", "principal"]), publishResults);

// Export CSV Endpoint
router.get("/:id/export-csv", exportResultsCSV);

export default router;
