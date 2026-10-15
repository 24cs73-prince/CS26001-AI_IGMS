import express from "express";
import {
  getClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
} from "../controllers/classController.js";
import { protect, protectRoles, requireSchool } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, requireSchool, getClasses);
router.get("/:id", protect, requireSchool, getClassById);
router.post("/", protect, requireSchool, protectRoles(["super_admin", "principal", "admin"]), createClass);
router.put("/:id", protect, requireSchool, protectRoles(["super_admin", "principal", "admin"]), updateClass);
router.delete("/:id", protect, requireSchool, protectRoles(["super_admin", "principal", "admin"]), deleteClass);

export default router;
