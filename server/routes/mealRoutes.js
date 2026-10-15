import express from "express";
import {
  getWeeklyMenu,
  getTodayMeal,
  createMealSlot,
  updateMealSlot,
  deleteMealSlot,
} from "../controllers/mealController.js";
import { protect, protectRoles, requireSchool } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public / Protected meal views
router.get("/weekly", getWeeklyMenu);
router.get("/today", getTodayMeal);
router.get("/", getWeeklyMenu);

// Admin operations
router.post("/", protect, requireSchool, protectRoles(["super_admin", "principal", "admin"]), createMealSlot);
router.put("/:id", protect, requireSchool, protectRoles(["super_admin", "principal", "admin"]), updateMealSlot);
router.delete("/:id", protect, requireSchool, protectRoles(["super_admin", "principal", "admin"]), deleteMealSlot);

export default router;
