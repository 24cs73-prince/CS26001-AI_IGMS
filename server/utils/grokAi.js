/**
 * Grok AI (xAI API) Integration Service Module
 * Handles automated MCQ generation and student performance diagnosis using Grok AI.
 */

const GROK_API_URL = "https://api.x.ai/v1/chat/completions";

/**
 * Generate Curriculum-Aligned MCQ Questions using Grok AI API
 * @param {Object} params - { classVal, subject, syllabus, count }
 */
export async function generateMCQPaperWithGrok({ classVal = "5", subject = "Science", syllabus = "", count = 10 }) {
  const apiKey = process.env.GROK_API_KEY;
  const numQuestions = Math.max(1, parseInt(count, 10) || 10);

  const prompt = `You are an expert school examination creator for Indian Government Schools.
Generate ${numQuestions} multiple-choice questions (MCQs) for Class ${classVal} students in subject "${subject}".
Syllabus / Topics context: "${syllabus || 'General Curriculum'}".

IMPORTANT FORMAT REQUIREMENT:
Return ONLY a valid raw JSON array of objects without markdown formatting or commentary. Each object MUST have:
- "id": number (1 to ${numQuestions})
- "question": string
- "options": array of 4 strings
- "correctAnswer": number (0-indexed integer representing the correct option index: 0, 1, 2, or 3)
- "marks": 1
`;

  if (apiKey && apiKey !== "your_xai_grok_api_key_here") {
    try {
      const response = await fetch(GROK_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "grok-2-latest",
          messages: [
            { role: "system", content: "You are a JSON-only API assistant for educational exam creation." },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const rawContent = data.choices?.[0]?.message?.content || "";
        const cleanJson = rawContent.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          console.log(`🤖 Grok AI successfully generated ${parsed.length} MCQs for Class ${classVal} ${subject}`);
          return parsed;
        }
      } else {
        const errText = await response.text();
        console.warn("⚠️ Grok AI API returned error:", response.status, errText);
      }
    } catch (error) {
      console.warn("⚠️ Grok AI API Connection Exception:", error.message);
    }
  }

  console.log(`ℹ️ Using intelligent fallback MCQ generator for Class ${classVal} ${subject}`);
  return fallbackMCQGenerator({ classVal, subject, syllabus, count: numQuestions });
}

/**
 * Generate Student Performance Analysis & Feedback using Grok AI API
 * @param {Object} params - { studentName, score, totalMarks, percentage, correctCount, wrongCount, subject }
 */
export async function analyzePerformanceWithGrok({
  studentName = "Student",
  score = 0,
  totalMarks = 10,
  percentage = 0,
  correctCount = 0,
  wrongCount = 0,
  subject = "General",
}) {
  const apiKey = process.env.GROK_API_KEY;

  if (apiKey && apiKey !== "your_xai_grok_api_key_here") {
    try {
      const prompt = `Analyze exam performance for student '${studentName}' in ${subject}.
Score: ${score}/${totalMarks} (${percentage}%). Correct: ${correctCount}, Wrong: ${wrongCount}.

Return ONLY a raw JSON object with keys:
- "overallPerformance": string ("Excellent" | "Good" | "Satisfactory" | "Needs Improvement")
- "strengths": string
- "areasForImprovement": string
- "recommendation": string
`;

      const response = await fetch(GROK_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "grok-2-latest",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.5,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const rawContent = data.choices?.[0]?.message?.content || "";
        const cleanJson = rawContent.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanJson);
        if (parsed.overallPerformance) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("⚠️ Grok AI Performance Analysis skipped, using fallback analysis.");
    }
  }

  let badge = "Needs Improvement";
  if (percentage >= 85) badge = "Excellent";
  else if (percentage >= 70) badge = "Good";
  else if (percentage >= 50) badge = "Satisfactory";

  return {
    overallPerformance: badge,
    strengths: percentage >= 75
      ? "Demonstrated strong grasp of fundamental concepts."
      : "Good effort in attempting all questions.",
    areasForImprovement: percentage < 85
      ? "Focus on revising key syllabus topics and practicing mock MCQs."
      : "Maintain consistency with advanced practice.",
    recommendation: percentage >= 75
      ? "Encourage continued practice and periodic revision."
      : "Re-read chapter summaries and consult subject teachers.",
  };
}

/** Fallback MCQ Generator for offline/unconfigured environments */
function fallbackMCQGenerator({ classVal, subject, syllabus, count }) {
  const syllabusSnippet = (syllabus || "Syllabus").trim();
  const databank = [
    { q: `What is a primary concept covered in Class ${classVal} ${subject}?`, opt: ["Foundational Principles", "Advanced Dynamics", "Core Theories", "Standard Applications"], ans: 0 },
    { q: `[${syllabusSnippet}] Which of the following is correct?`, opt: ["Option A (Verified)", "Option B", "Option C", "Option D"], ans: 0 },
    { q: `Which tool or method is commonly used in ${subject}?`, opt: ["Analytical Observation", "Random Guessing", "Static Estimation", "Manual Calculation"], ans: 0 },
    { q: `What is the key objective of studying Class ${classVal} ${subject}?`, opt: ["Conceptual Mastery", "Memorization Only", "Selective Reading", "None of these"], ans: 0 },
  ];

  const generated = [];
  for (let i = 0; i < count; i++) {
    const item = databank[i % databank.length];
    generated.push({
      id: i + 1,
      question: `Q${i + 1}. ${item.q}`,
      options: item.opt,
      correctAnswer: item.ans,
      marks: 1,
    });
  }
  return generated;
}
