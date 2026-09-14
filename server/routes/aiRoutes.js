import express from "express";
import { generateQuestions, analyzePerformance } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate-questions", protect, generateQuestions);
router.post("/analyze-performance", protect, analyzePerformance);

export default router;
