import express from "express";
import { applyLeave, getLeaves, updateLeaveStatus } from "../controllers/leaveController.js";
import { protect, protectRoles, requireSchool } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, requireSchool, getLeaves)
  .post(protect, requireSchool, protectRoles(["teacher"]), applyLeave);

router.patch("/:id/status", protect, requireSchool, protectRoles(["principal", "super_admin"]), updateLeaveStatus);

export default router;
