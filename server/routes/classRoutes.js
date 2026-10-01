import express from "express";
import {
  getClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
} from "../controllers/classController.js";
import { protect, protectRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getClasses);
router.get("/:id", protect, getClassById);
router.post("/", protect, protectRoles(["super_admin", "principal", "admin"]), createClass);
router.put("/:id", protect, protectRoles(["super_admin", "principal", "admin"]), updateClass);
router.delete("/:id", protect, protectRoles(["super_admin", "principal", "admin"]), deleteClass);

export default router;
