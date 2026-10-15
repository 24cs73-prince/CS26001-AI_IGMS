import express from "express";
import {
  createExam,
  getExams,
  getExamById,
  publishExam,
  updateExam,
  deleteExam,
} from "../controllers/examController.js";
import { validateCreateExam } from "../middleware/validateMiddleware.js";
import { protect, protectRoles, requireSchool } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, requireSchool, protectRoles(["super_admin", "principal", "admin", "teacher", "student"]), getExams)
  .post(protect, requireSchool, protectRoles(["teacher", "principal", "super_admin"]), validateCreateExam, createExam);

router.route("/:id")
  .get(protect, requireSchool, protectRoles(["super_admin", "principal", "admin", "teacher", "student"]), getExamById)
  .put(protect, requireSchool, protectRoles(["teacher", "principal"]), updateExam)
  .delete(protect, requireSchool, protectRoles(["teacher", "principal", "super_admin"]), deleteExam);

router.patch("/:id/publish", protect, requireSchool, protectRoles(["teacher", "principal"]), publishExam);

export default router;
