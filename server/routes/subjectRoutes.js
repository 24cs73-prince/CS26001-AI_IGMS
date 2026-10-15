import express from "express";
import {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
} from "../controllers/subjectController.js";
import { protect, protectRoles, requireSchool } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, requireSchool, getSubjects);
router.get("/:id", protect, requireSchool, getSubjectById);
router.post("/", protect, requireSchool, protectRoles(["super_admin", "principal", "admin"]), createSubject);
router.put("/:id", protect, requireSchool, protectRoles(["super_admin", "principal", "admin"]), updateSubject);
router.delete("/:id", protect, requireSchool, protectRoles(["super_admin", "principal", "admin"]), deleteSubject);

export default router;
