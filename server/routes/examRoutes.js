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
import { protect, protectRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getExams)
  .post(protect, protectRoles(["teacher", "principal", "super_admin"]), validateCreateExam, createExam);

router.route("/:id")
  .get(getExamById)
  .put(protect, protectRoles(["teacher", "principal"]), updateExam)
  .delete(protect, protectRoles(["teacher", "principal", "super_admin"]), deleteExam);

router.patch("/:id/publish", protect, protectRoles(["teacher", "principal"]), publishExam);

export default router;
