import express from "express";
import {
  getParents,
  getParentById,
  getMyChildren,
  createParent,
  updateParent,
  deleteParent,
} from "../controllers/parentController.js";
import { protect, protectRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Parent can fetch their own linked children
router.get("/my-children", protect, getMyChildren);

// Admin & Principal routes
router.get("/", protect, getParents);
router.get("/:id", protect, getParentById);
router.post("/", protect, protectRoles(["super_admin", "principal", "admin"]), createParent);
router.put("/:id", protect, protectRoles(["super_admin", "principal", "admin"]), updateParent);
router.delete("/:id", protect, protectRoles(["super_admin", "principal", "admin"]), deleteParent);

export default router;
