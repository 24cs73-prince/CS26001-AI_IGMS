import express from "express";
import {
  getTimetable,
  createTimetableSlot,
  updateTimetableSlot,
  deleteTimetableSlot,
} from "../controllers/timetableController.js";
import { protect, protectRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getTimetable);
router.post("/", protect, protectRoles(["super_admin", "principal", "admin"]), createTimetableSlot);
router.put("/:id", protect, protectRoles(["super_admin", "principal", "admin"]), updateTimetableSlot);
router.delete("/:id", protect, protectRoles(["super_admin", "principal", "admin"]), deleteTimetableSlot);

export default router;
