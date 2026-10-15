import express from "express";
import { getStudents, createStudent } from "../controllers/studentController.js";
import { protect, protectRoles, requireSchool } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(protect, requireSchool, protectRoles(["super_admin", "principal", "admin"]), getStudents)
  .post(protect, requireSchool, protectRoles(["super_admin", "principal", "admin"]), createStudent);

export default router;
