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

const developmentOnly = (_req, res, next) => {
  if (process.env.NODE_ENV !== "development") {
    return res.status(404).json({ message: "Route not found." });
  }
  next();
};

// Public auth endpoints
router.post("/login", loginUser);
router.post("/seed", developmentOnly, seedAccounts);
router.post("/add-sample-teacher", developmentOnly, addSampleTeacher);

// Protected auth endpoints
router.get("/me", protect, getMe);
router.post("/change-password", protect, changePassword);

export default router;
