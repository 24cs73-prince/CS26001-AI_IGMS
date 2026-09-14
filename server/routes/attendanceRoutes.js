import express from "express";
import { recordAttendance, getAttendance } from "../controllers/attendanceController.js";
import { protect, protectRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, getAttendance)
  .post(protect, protectRoles(["teacher", "principal"]), recordAttendance);

export default router;
