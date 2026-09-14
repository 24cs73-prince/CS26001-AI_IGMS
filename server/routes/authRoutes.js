import express from "express";
import {
  loginUser,
  getMe,
  changePassword,
  seedAccounts,
  addSampleTeacher,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public auth endpoints
router.post("/login", loginUser);
router.post("/seed", seedAccounts);
router.post("/add-sample-teacher", addSampleTeacher);

// Protected auth endpoints
router.get("/me", protect, getMe);
router.post("/change-password", protect, changePassword);

export default router;
