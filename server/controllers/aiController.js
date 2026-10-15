import {
  generateMCQPaperWithGrok,
  analyzePerformanceWithGrok,
  isAiProviderConfigured,
} from "../utils/grokAi.js";

/**
 * @desc    Generate AI MCQ Questions using Grok AI
 * @route   POST /api/ai/generate-questions
 */
export const generateQuestions = async (req, res) => {
  try {
    if (!isAiProviderConfigured()) {
      return res.status(503).json({ message: "AI question generation is not configured." });
    }

    const { classVal, standard, subject, syllabus, topic, difficulty, diff, totalQuestions, count, language, lang } = req.body;
    const numQuestions = Number(count ?? totalQuestions ?? 5);
    if (!Number.isInteger(numQuestions) || numQuestions < 1 || numQuestions > 50) {
      return res.status(400).json({ message: "Question count must be an integer between 1 and 50." });
    }
    const textFields = [
      [classVal ?? standard, 20],
      [subject, 100],
      [syllabus ?? topic, 2000],
      [difficulty ?? diff, 40],
      [language ?? lang, 40],
    ];
    if (textFields.some(([value, maxLength]) =>
      value !== undefined && (typeof value !== "string" || value.length > maxLength)
    )) {
      return res.status(400).json({ message: "One or more AI generation fields are invalid or too long." });
    }

    const questions = await generateMCQPaperWithGrok({
      classVal: String(classVal || standard || "5"),
      subject: subject || "Science",
      syllabus: syllabus || topic || "",
      difficulty: difficulty || diff || "Medium",
      count: numQuestions,
      language: language || lang || "English",
    });

    res.json({
      status: "success",
      source: "AI provider",
      totalQuestions: questions.length,
      language: language || lang || "English",
      questions,
    });
  } catch (error) {
    console.error("AI Question Generation Error:", error);
    res.status(500).json({ message: "Server error generating AI questions." });
  }
};

/**
 * @desc    Analyze Student Performance using Grok AI
 * @route   POST /api/ai/analyze-performance
 */
export const analyzePerformance = async (req, res) => {
  try {
    if (!isAiProviderConfigured()) {
      return res.status(503).json({ message: "AI performance analysis is not configured." });
    }

    const { score, totalMarks, correctCount, wrongCount, subject } = req.body;
    const numericValues = [score, totalMarks, correctCount, wrongCount].map(Number);
    if (
      numericValues.some((value) => !Number.isFinite(value) || value < 0) ||
      numericValues[1] <= 0 ||
      numericValues[0] > numericValues[1] ||
      (subject !== undefined && (typeof subject !== "string" || subject.length > 100))
    ) {
      return res.status(400).json({ message: "Performance values are invalid." });
    }
    const [validatedScore, validatedTotal, validatedCorrect, validatedWrong] = numericValues;

    const analysis = await analyzePerformanceWithGrok({
      score: validatedScore,
      totalMarks: validatedTotal,
      percentage: (validatedScore / validatedTotal) * 100,
      correctCount: validatedCorrect,
      wrongCount: validatedWrong,
      subject,
    });

    res.json({
      status: "success",
      analysis,
    });
  } catch (error) {
    console.error("AI Performance Analysis Error:", error);
    res.status(500).json({ message: "Server error analyzing AI performance." });
  }
};
