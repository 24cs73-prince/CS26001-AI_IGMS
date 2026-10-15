import express from "express";
import { getTeachers, createTeacher } from "../controllers/teacherController.js";
import { protect, protectRoles, requireSchool } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(protect, requireSchool, protectRoles(["super_admin", "principal", "admin"]), getTeachers)
  .post(protect, requireSchool, protectRoles(["super_admin", "principal", "admin"]), createTeacher);

export default router;
