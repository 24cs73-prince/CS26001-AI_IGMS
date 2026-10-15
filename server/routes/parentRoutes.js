import express from "express";
import {
  getParents,
  getParentById,
  getMyChildren,
  createParent,
  updateParent,
  deleteParent,
} from "../controllers/parentController.js";
import { protect, protectRoles, requireSchool } from "../middleware/authMiddleware.js";

const router = express.Router();

// Parent can fetch their own linked children
router.get("/my-children", protect, requireSchool, protectRoles(["parent"]), getMyChildren);

// Admin & Principal routes
router.get("/", protect, requireSchool, protectRoles(["super_admin", "principal", "admin"]), getParents);
router.get("/:id", protect, requireSchool, protectRoles(["super_admin", "principal", "admin"]), getParentById);
router.post("/", protect, requireSchool, protectRoles(["super_admin", "principal", "admin"]), createParent);
router.put("/:id", protect, requireSchool, protectRoles(["super_admin", "principal", "admin"]), updateParent);
router.delete("/:id", protect, requireSchool, protectRoles(["super_admin", "principal", "admin"]), deleteParent);

export default router;
