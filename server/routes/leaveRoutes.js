import express from "express";
import { applyLeave, getLeaves, updateLeaveStatus } from "../controllers/leaveController.js";
import { protect, protectRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, getLeaves)
  .post(protect, protectRoles(["teacher"]), applyLeave);

router.patch("/:id/status", protect, protectRoles(["principal", "super_admin"]), updateLeaveStatus);

export default router;
