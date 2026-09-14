import { generateMCQPaperWithGrok, analyzePerformanceWithGrok } from "../utils/grokAi.js";

/**
 * @desc    Generate AI MCQ Questions using Grok AI
 * @route   POST /api/ai/generate-questions
 */
export const generateQuestions = async (req, res) => {
  try {
    const { classVal, subject, syllabus, totalQuestions } = req.body;

    const questions = await generateMCQPaperWithGrok({
      classVal: String(classVal || "5"),
      subject: subject || "Science",
      syllabus: syllabus || "",
      count: Number(totalQuestions) || 10,
    });

    res.json({
      status: "success",
      source: process.env.GROK_API_KEY && process.env.GROK_API_KEY !== "your_xai_grok_api_key_here" ? "Grok-AI" : "Smart-Fallback-AI",
      totalQuestions: questions.length,
      questions,
    });
  } catch (error) {
    console.error("AI Question Generation Error:", error);
    res.status(500).json({ message: "Server error generating AI questions.", details: error.message });
  }
};

/**
 * @desc    Analyze Student Performance using Grok AI
 * @route   POST /api/ai/analyze-performance
 */
export const analyzePerformance = async (req, res) => {
  try {
    const { studentName, score, totalMarks, percentage, correctCount, wrongCount, subject } = req.body;

    const analysis = await analyzePerformanceWithGrok({
      studentName,
      score,
      totalMarks,
      percentage,
      correctCount,
      wrongCount,
      subject,
    });

    res.json({
      status: "success",
      analysis,
    });
  } catch (error) {
    console.error("AI Performance Analysis Error:", error);
    res.status(500).json({ message: "Server error analyzing AI performance.", details: error.message });
  }
};
