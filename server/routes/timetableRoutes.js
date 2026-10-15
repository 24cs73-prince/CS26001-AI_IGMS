import express from "express";
import {
  getTimetable,
  createTimetableSlot,
  updateTimetableSlot,
  deleteTimetableSlot,
} from "../controllers/timetableController.js";
import { protect, protectRoles, requireSchool } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, requireSchool, getTimetable);
router.post("/", protect, requireSchool, protectRoles(["super_admin", "principal", "admin"]), createTimetableSlot);
router.put("/:id", protect, requireSchool, protectRoles(["super_admin", "principal", "admin"]), updateTimetableSlot);
router.delete("/:id", protect, requireSchool, protectRoles(["super_admin", "principal", "admin"]), deleteTimetableSlot);

export default router;
