import express from "express";
import { recordAttendance, getAttendance } from "../controllers/attendanceController.js";
import { protect, protectRoles, requireSchool } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, requireSchool, getAttendance)
  .post(protect, requireSchool, protectRoles(["teacher", "principal"]), recordAttendance);

export default router;
