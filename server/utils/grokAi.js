/**
 * Grok / Groq AI Integration Service Module
 * Handles automated MCQ generation and student performance diagnosis using AI.
 */

const GROK_API_URL = "https://api.x.ai/v1/chat/completions";

/**
 * Generate Curriculum-Aligned MCQ Questions using AI Engine (Groq / Grok)
 * @param {Object} params - { classVal, subject, syllabus, difficulty, count }
 */
export async function generateMCQPaperWithGrok({
  classVal = "5",
  subject = "Science",
  syllabus = "",
  difficulty = "Medium",
  count = 10,
}) {
  const apiKey = process.env.GROK_API_KEY || process.env.GROQ_API_KEY;
  const numQuestions = Math.max(1, parseInt(count, 10) || 10);
  const diff = (difficulty || "Medium").trim();
  const std = (classVal || "5").trim();
  const sub = (subject || "General").trim();
  const topicText = (syllabus || "").trim();

  const prompt = `You are a master educational examination question creator for Indian Government Schools (NCERT & Gujarat State Board Curriculum).

Task: Generate ${numQuestions} multiple-choice questions (MCQs) for Class ${std} (Standard ${std}) students in subject "${sub}".

EXAM SPECIFICATIONS:
- Grade Level / Standard: Class ${std} (Std ${std})
- Subject: ${sub}
- Target Difficulty Level: ${diff}
- Syllabus Topics / Chapter Content: "${topicText || `Class ${std} ${sub} Standard NCERT Curriculum`}"

STRICT QUALITY RULES:
1. Every question MUST be strictly tailored to Class ${std} difficulty level in ${sub}.
2. If specific syllabus topics or user text is provided above ("${topicText}"), ALL questions MUST directly test concepts, formulas, definitions, processes, or examples from THAT specific topic!
3. DIFFICULTY CALIBRATION (${diff}):
   - "Easy": Fundamental definitions, direct facts, basic identification suitable for Std ${std}.
   - "Medium": Conceptual application, multi-step problem solving or reasoning suitable for Std ${std}.
   - "Hard": Critical thinking, multi-concept analysis, advanced problem solving appropriate for Std ${std}.
   - "Mixed": 30% Easy, 50% Medium, and 20% Hard questions.
4. Provide EXACTLY 4 distinct, plausible options for each question.
5. Do NOT write meta-phrases like "According to the text provided..." inside the question statement. Formulate clean exam questions!
6. Return ONLY a valid raw JSON array of objects without markdown backticks or extra commentary.

Each object MUST match this schema:
- "id": number (1 to ${numQuestions})
- "question": string (clean, professional question statement)
- "options": array of 4 string choices
- "correctAnswer": number (0-indexed integer: 0 for 1st option, 1 for 2nd option, 2 for 3rd option, 3 for 4th option)
- "marks": 1
- "difficulty": "${diff}"
`;

  if (apiKey && apiKey !== "your_xai_grok_api_key_here") {
    try {
      const isGroq = apiKey.startsWith("gsk_");
      const apiUrl = isGroq ? "https://api.groq.com/openai/v1/chat/completions" : GROK_API_URL;
      const model = isGroq ? "openai/gpt-oss-120b" : "grok-2-latest";

      console.log(`🤖 Requesting AI MCQ generation via ${isGroq ? "Groq Cloud (openai/gpt-oss-120b)" : "xAI Grok"} for Std ${std} ${sub} (${diff})...`);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: "You are a JSON-only API assistant for educational exam creation." },
            { role: "user", content: prompt },
          ],
          temperature: 0.3,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const rawContent = data.choices?.[0]?.message?.content || "";
        const cleanJson = rawContent.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          console.log(`✅ AI Engine successfully generated ${parsed.length} MCQs for Class ${std} ${sub} (${diff})`);
          return parsed.map((item, idx) => ({
            id: idx + 1,
            question: item.question || item.questionText || item.q || `Question ${idx + 1}`,
            options: Array.isArray(item.options) && item.options.length === 4 ? item.options : (item.options || ["Option A", "Option B", "Option C", "Option D"]),
            correctAnswer: Number(item.correctAnswer) >= 0 && Number(item.correctAnswer) <= 3 ? Number(item.correctAnswer) : 0,
            marks: Number(item.marks) || 1,
            difficulty: item.difficulty || diff,
          }));
        }
      } else {
        const errText = await response.text();
        console.warn("⚠️ AI API returned error status:", response.status, errText);

        // Fallback to secondary Groq model if gpt-oss-120b returned error
        if (isGroq) {
          try {
            console.log("ℹ️ Retrying with Groq secondary model (openai/gpt-oss-20b)...");
            const retryRes = await fetch(apiUrl, {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "openai/gpt-oss-20b",
                messages: [
                  { role: "system", content: "You are a JSON-only API assistant for educational exam creation." },
                  { role: "user", content: prompt },
                ],
                temperature: 0.3,
              }),
            });

            if (retryRes.ok) {
              const retryData = await retryRes.json();
              const rawContent = retryData.choices?.[0]?.message?.content || "";
              const cleanJson = rawContent.replace(/```json/g, "").replace(/```/g, "").trim();
              const parsed = JSON.parse(cleanJson);
              if (Array.isArray(parsed) && parsed.length > 0) {
                console.log(`✅ AI Secondary Engine generated ${parsed.length} MCQs`);
                return parsed.map((item, idx) => ({
                  id: idx + 1,
                  question: item.question || item.questionText || item.q || `Question ${idx + 1}`,
                  options: Array.isArray(item.options) && item.options.length === 4 ? item.options : (item.options || ["Option A", "Option B", "Option C", "Option D"]),
                  correctAnswer: Number(item.correctAnswer) >= 0 && Number(item.correctAnswer) <= 3 ? Number(item.correctAnswer) : 0,
                  marks: Number(item.marks) || 1,
                  difficulty: item.difficulty || diff,
                }));
              }
            }
          } catch (retryErr) {
            console.warn("⚠️ Groq secondary model retry failed:", retryErr.message);
          }
        }
      }
    } catch (error) {
      console.warn("⚠️ AI API Connection Exception:", error.message);
    }
  }

  console.log(`ℹ️ Using intelligent fallback MCQ generator for Class ${std} ${sub} (${diff})`);
  return fallbackMCQGenerator({ classVal: std, subject: sub, syllabus: topicText, difficulty: diff, count: numQuestions });
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
  const apiKey = process.env.GROK_API_KEY || process.env.GROQ_API_KEY;

  if (apiKey && apiKey !== "your_xai_grok_api_key_here") {
    try {
      const isGroq = apiKey.startsWith("gsk_");
      const apiUrl = isGroq ? "https://api.groq.com/openai/v1/chat/completions" : GROK_API_URL;
      const model = isGroq ? "openai/gpt-oss-120b" : "grok-2-latest";

      const prompt = `Analyze exam performance for student '${studentName}' in ${subject}.
Score: ${score}/${totalMarks} (${percentage}%). Correct: ${correctCount}, Wrong: ${wrongCount}.

Return ONLY a raw JSON object with keys:
- "overallPerformance": string ("Excellent" | "Good" | "Satisfactory" | "Needs Improvement")
- "strengths": string
- "areasForImprovement": string
- "recommendation": string
`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
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
      console.warn("⚠️ AI Performance Analysis skipped, using fallback analysis.");
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

/** Intelligent Fallback MCQ Generator tailored by Standard, Subject, Topic & Difficulty */
function fallbackMCQGenerator({ classVal, subject, syllabus, difficulty, count }) {
  const std = String(classVal || "5");
  const sub = String(subject || "Science");
  const diff = String(difficulty || "Medium");
  const topicSnippet = (syllabus || "General Topics").trim();

  // Subject-specific intelligent question banks
  const questionPools = {
    Mathematics: [
      { q: `What is the value of 15 × 8 in Class ${std} Mathematics?`, opt: ["120", "110", "130", "140"], ans: 0 },
      { q: `Regarding ${topicSnippet}: What is the perimeter of a rectangle with length 8 cm and width 5 cm?`, opt: ["26 cm", "40 cm", "13 cm", "30 cm"], ans: 0 },
      { q: `In Class ${std} ${sub}, which fraction is equivalent to 3/4?`, opt: ["6/8", "5/8", "3/8", "9/16"], ans: 0 },
      { q: `If x + 7 = 15, what is the value of x?`, opt: ["8", "7", "9", "22"], ans: 0 },
      { q: `What is the smallest prime number taught in Class ${std}?`, opt: ["2", "1", "3", "0"], ans: 0 },
    ],
    Science: [
      { q: `Regarding ${topicSnippet}: Which organelle in plant cells carries out photosynthesis?`, opt: ["Chloroplast", "Mitochondria", "Nucleus", "Ribosome"], ans: 0 },
      { q: `What gas do plants release during photosynthesis in Class ${std} Science?`, opt: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], ans: 0 },
      { q: `Which of the following is a non-renewable source of energy?`, opt: ["Coal", "Solar Energy", "Wind Energy", "Hydroelectric Energy"], ans: 0 },
      { q: `What state of matter has a fixed volume but no fixed shape?`, opt: ["Liquid", "Solid", "Gas", "Plasma"], ans: 0 },
      { q: `In Class ${std} ${sub}, which system transports blood through the human body?`, opt: ["Circulatory System", "Digestive System", "Respiratory System", "Nervous System"], ans: 0 },
    ],
    English: [
      { q: `In Class ${std} English (${topicSnippet}): Identify the noun in "The swift cat ran quickly."`, opt: ["cat", "swift", "ran", "quickly"], ans: 0 },
      { q: `What is the correct antonym of the word "Ancient"?`, opt: ["Modern", "Old", "Historic", "Traditional"], ans: 0 },
      { q: `Which punctuation mark is used at the end of an interrogative sentence?`, opt: ["Question Mark (?)", "Full Stop (.)", "Comma (,)", "Exclamation Mark (!)"], ans: 0 },
      { q: `Choose the correct past tense of the verb "Go":`, opt: ["Went", "Gone", "Going", "Goes"], ans: 0 },
      { q: `Identify the conjunction in "She studied hard, so she passed the exam."`, opt: ["so", "studied", "hard", "she"], ans: 0 },
    ],
    "Social Science": [
      { q: `Regarding ${topicSnippet}: What is the capital of India?`, opt: ["New Delhi", "Mumbai", "Kolkata", "Chennai"], ans: 0 },
      { q: `In Class ${std} Social Science, which planet is known as the Red Planet?`, opt: ["Mars", "Venus", "Jupiter", "Saturn"], ans: 0 },
      { q: `What is the fundamental law-making body of India?`, opt: ["Parliament", "Supreme Court", "Election Commission", "Cabinet"], ans: 0 },
      { q: `Which ocean is located to the south of India?`, opt: ["Indian Ocean", "Pacific Ocean", "Atlantic Ocean", "Arctic Ocean"], ans: 0 },
    ],
  };

  const selectedPool = questionPools[sub] || [
    { q: `Regarding ${topicSnippet} in Class ${std} ${sub}: Which concept represents a core principle?`, opt: ["Foundational Rule", "Secondary Option", "Unrelated Theory", "Static Variant"], ans: 0 },
    { q: `What is a key objective covered under Class ${std} ${sub}?`, opt: ["Conceptual Mastery", "Memorization Only", "Random Estimation", "None of these"], ans: 0 },
    { q: `Which tool or method is standard in Class ${std} ${sub}?`, opt: ["Systematic Analysis", "Unverified Guessing", "Manual Skipping", "Arbitrary Testing"], ans: 0 },
  ];

  const generated = [];
  for (let i = 0; i < count; i++) {
    const item = selectedPool[i % selectedPool.length];
    generated.push({
      id: i + 1,
      question: `Q${i + 1}. [Class ${std} · ${diff}] ${item.q}`,
      options: item.opt,
      correctAnswer: item.ans,
      marks: 1,
      difficulty: diff,
    });
  }
  return generated;
}
