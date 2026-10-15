import express from "express";
import { generateQuestions, analyzePerformance } from "../controllers/aiController.js";
import { protect, protectRoles } from "../middleware/authMiddleware.js";

const router = express.Router();
const aiUsage = new Map();
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 20;

const limitAiUsage = (req, res, next) => {
  const key = String(req.user._id);
  const now = Date.now();
  const usage = aiUsage.get(key);

  if (!usage || now - usage.windowStartedAt >= RATE_WINDOW_MS) {
    aiUsage.set(key, { windowStartedAt: now, count: 1 });
  } else if (usage.count >= RATE_LIMIT) {
    return res.status(429).json({ message: "AI request limit reached. Try again later." });
  } else {
    usage.count += 1;
  }

  if (aiUsage.size > 5000) {
    for (const [userId, userUsage] of aiUsage) {
      if (now - userUsage.windowStartedAt >= RATE_WINDOW_MS) {
        aiUsage.delete(userId);
      }
    }
  }
  next();
};

const authorizeAi = [protect, protectRoles(["teacher", "principal", "super_admin"]), limitAiUsage];

router.post("/generate-questions", ...authorizeAi, generateQuestions);
router.post("/analyze-performance", ...authorizeAi, analyzePerformance);

export default router;
