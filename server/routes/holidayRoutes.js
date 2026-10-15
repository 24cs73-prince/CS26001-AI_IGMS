import express from "express";
import {
  getHolidays,
  createHoliday,
  updateHoliday,
  deleteHoliday,
} from "../controllers/holidayController.js";
import { protect, protectRoles, requireSchool } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getHolidays);
router.post("/", protect, requireSchool, protectRoles(["super_admin", "principal", "admin"]), createHoliday);
router.put("/:id", protect, requireSchool, protectRoles(["super_admin", "principal", "admin"]), updateHoliday);
router.delete("/:id", protect, requireSchool, protectRoles(["super_admin", "principal", "admin"]), deleteHoliday);

export default router;
