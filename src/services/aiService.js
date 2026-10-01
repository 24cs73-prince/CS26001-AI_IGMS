import { buildApiUrl, getAuthHeaders } from "../utils/apiConfig";

/** Generate question paper using backend AI service or structured syllabus templates */
export async function generateQuestionPaper({ className, subject, difficulty, questionCount = 10 }) {
  try {
    const headers = getAuthHeaders();
    const url = buildApiUrl("/api/ai/generate-questions");
    let res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        classVal: className?.replace(/\D/g, "") || "6",
        subject: subject || "Mathematics",
        syllabus: `Term Syllabus for ${subject}`,
        count: questionCount,
      }),
    }).catch(() => null);

    if (!res || !res.ok) {
      if (typeof window !== "undefined" && window.location.hostname === "localhost" && !import.meta.env.VITE_API_URL) {
        res = await fetch("http://localhost:5000/api/ai/generate-questions", {
          method: "POST",
          headers,
          body: JSON.stringify({
            classVal: className?.replace(/\D/g, "") || "6",
            subject: subject || "Mathematics",
            syllabus: `Term Syllabus for ${subject}`,
            count: questionCount,
          }),
        }).catch(() => null);
      }
    }

    if (res && res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.questions) && data.questions.length > 0) {
        const sections = [
          { title: 'Section A — Objective (1 mark each)', count: Math.ceil(data.questions.length * 0.4) },
          { title: 'Section B — Short Answer (3 marks each)', count: Math.ceil(data.questions.length * 0.35) },
          { title: 'Section C — Long Answer (5 marks each)', count: Math.floor(data.questions.length * 0.25) },
        ];

        let cursor = 0;
        return {
          meta: {
            className,
            subject,
            difficulty,
            totalMarks: data.questions.length * 2,
            duration: '3 hours',
            generatedAt: new Date().toISOString(),
            source: data.source || "Grok-AI",
          },
          sections: sections.map((s, i) => {
            const qs = data.questions.slice(cursor, cursor + s.count);
            cursor += s.count;
            return {
              title: s.title,
              questions: qs.map((q, qIdx) => ({
                no: qIdx + 1,
                text: q.question || q.text || `Question ${qIdx + 1}`,
                marks: [1, 3, 5][i] || 1,
              })),
            };
          }),
        };
      }
    }
  } catch (err) {
    console.warn("Backend AI Question Generator unavailable:", err);
  }

  // Structured syllabus fallback templates (Clearly labeled template-based generation)
  const sections = [
    { title: 'Section A — Objective (1 mark each)', count: Math.ceil(questionCount * 0.4) },
    { title: 'Section B — Short Answer (3 marks each)', count: Math.ceil(questionCount * 0.35) },
    { title: 'Section C — Long Answer (5 marks each)', count: Math.floor(questionCount * 0.25) },
  ];

  const bank = {
    Mathematics: [
      'Solve the quadratic equation 2x² − 5x + 3 = 0.',
      'Prove that the sum of angles in a triangle is 180°.',
      'Find the area of a circle with radius 7 cm.',
      'If sin θ = 3/5, find cos θ and tan θ.',
      'Factorise: x² − 9x + 20.',
      'A ladder leans against a wall — find its height using trigonometry.',
    ],
    Science: [
      'State Newton’s three laws of motion with examples.',
      'Explain the process of photosynthesis.',
      'What is the difference between a mixture and a compound?',
      'Draw and label the human digestive system.',
      'Define acceleration and derive its SI unit.',
      'Describe the water cycle with a neat diagram.',
    ],
    default: [
      'Explain the key concept covered in this unit.',
      'Compare and contrast the two ideas discussed in class.',
      'Describe a real-world application of this topic.',
      'Summarise the main argument in your own words.',
      'List three important points and justify each.',
      'Analyse the given scenario and draw a conclusion.',
    ],
  };

  const pool = bank[subject] || bank.default;

  return {
    meta: {
      className,
      subject,
      difficulty,
      totalMarks: sections.reduce((sum, s, i) => sum + s.count * [1, 3, 5][i], 0),
      duration: '3 hours',
      generatedAt: new Date().toISOString(),
      source: 'Curriculum-Template',
    },
    sections: sections.map((s, i) => ({
      title: s.title,
      questions: Array.from({ length: s.count }, (_, q) => ({
        no: q + 1,
        text: pool[(q + i) % pool.length],
        marks: [1, 3, 5][i],
      })),
    })),
  };
}

/** Return AI performance analysis for a student or deterministic diagnosis */
export async function analyzePerformance(student) {
  const avg = Number(student?.average) || 74;
  const name = student?.name || "Student";

  try {
    const headers = getAuthHeaders();
    const url = buildApiUrl("/api/ai/analyze-performance");
    let res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        studentName: name,
        score: Math.round(avg * 0.8),
        totalMarks: 80,
        percentage: Math.round(avg),
        correctCount: Math.round((avg / 100) * 8),
        wrongCount: Math.round(((100 - avg) / 100) * 8),
        subject: "All Subjects Cumulative",
      }),
    }).catch(() => null);

    if (!res || !res.ok) {
      if (typeof window !== "undefined" && window.location.hostname === "localhost" && !import.meta.env.VITE_API_URL) {
        res = await fetch("http://localhost:5000/api/ai/analyze-performance", {
          method: "POST",
          headers,
          body: JSON.stringify({
            studentName: name,
            score: Math.round(avg * 0.8),
            totalMarks: 80,
            percentage: Math.round(avg),
            correctCount: Math.round((avg / 100) * 8),
            wrongCount: Math.round(((100 - avg) / 100) * 8),
            subject: "All Subjects Cumulative",
          }),
        }).catch(() => null);
      }
    }

    if (res && res.ok) {
      const data = await res.json();
      if (data && data.analysis) {
        const analysis = data.analysis;
        return {
          band: analysis.overallPerformance || (avg >= 85 ? "Excellent" : avg >= 70 ? "Good" : avg >= 50 ? "Average" : "Needs Attention"),
          strengths: [analysis.strengths || "Consistent performance across terms"],
          weaknesses: [analysis.areasForImprovement || "Focus on higher-order questions"],
          recommendations: [analysis.recommendation || "Maintain daily study schedule"],
          prediction: {
            nextTermScore: Math.min(100, Math.round(avg)),
            confidence: 85,
            riskLevel: avg < 50 ? "High" : avg < 70 ? "Moderate" : "Low",
          },
        };
      }
    }
  } catch (err) {
    console.warn("Backend AI Performance Analysis unavailable:", err);
  }

  // Deterministic curriculum-based assessment (no random numbers)
  const band =
    avg >= 85 ? "Excellent" : avg >= 70 ? "Good" : avg >= 50 ? "Average" : "Needs Attention";

  return {
    band,
    strengths: avg >= 75
      ? ["Strong foundation in primary concepts", "Consistent attendance records", "Active class participation"]
      : ["Good submission consistency", "Responsive in class discussions"],
    weaknesses: avg < 70
      ? ["Application-based problem solving", "Time management during term assessments"]
      : ["Advanced analytical synthesis"],
    recommendations: [
      "Allocate 30 minutes daily to practice application questions.",
      "Attempt timed mock quizzes before the term exam.",
      "Revise formula sheets weekly with peer study groups.",
    ],
    prediction: {
      nextTermScore: Math.min(100, Math.round(avg)),
      confidence: 80,
      riskLevel: avg < 50 ? "High" : avg < 70 ? "Moderate" : "Low",
    },
  };
}
