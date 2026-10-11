import express from "express";
import { generateQuestions, analyzePerformance } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Allow AI generation for both authenticated sessions and demo logins
const optionalAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    return protect(req, res, next);
  }
  next();
};

router.post("/generate-questions", optionalAuth, generateQuestions);
router.post("/analyze-performance", optionalAuth, analyzePerformance);

export default router;
