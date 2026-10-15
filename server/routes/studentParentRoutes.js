import express from "express";
import {
  getStudentParents,
  linkStudentParent,
  unlinkStudentParent,
} from "../controllers/studentParentController.js";
import { protect, protectRoles, requireSchool } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, requireSchool, getStudentParents);
router.post("/", protect, requireSchool, protectRoles(["super_admin", "principal", "admin"]), linkStudentParent);
router.delete("/:id", protect, requireSchool, protectRoles(["super_admin", "principal", "admin"]), unlinkStudentParent);

export default router;
