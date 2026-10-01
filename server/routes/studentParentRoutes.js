import express from "express";
import {
  getStudentParents,
  linkStudentParent,
  unlinkStudentParent,
} from "../controllers/studentParentController.js";
import { protect, protectRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getStudentParents);
router.post("/", protect, protectRoles(["super_admin", "principal", "admin"]), linkStudentParent);
router.delete("/:id", protect, protectRoles(["super_admin", "principal", "admin"]), unlinkStudentParent);

export default router;
