import express from "express";
import {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
} from "../controllers/subjectController.js";
import { protect, protectRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getSubjects);
router.get("/:id", protect, getSubjectById);
router.post("/", protect, protectRoles(["super_admin", "principal", "admin"]), createSubject);
router.put("/:id", protect, protectRoles(["super_admin", "principal", "admin"]), updateSubject);
router.delete("/:id", protect, protectRoles(["super_admin", "principal", "admin"]), deleteSubject);

export default router;
