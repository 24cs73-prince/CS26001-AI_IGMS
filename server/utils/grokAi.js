import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Load environment variables from server/.env if available
const serverEnvPath = path.resolve(process.cwd(), "server", ".env");
if (fs.existsSync(serverEnvPath)) {
  dotenv.config({ path: serverEnvPath });
}
dotenv.config();

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
  language = "English",
}) {
  const apiKey = process.env.GROK_API_KEY || process.env.GROQ_API_KEY;
  const numQuestions = Math.max(1, parseInt(count, 10) || 10);
  const diff = (difficulty || "Medium").trim();
  const std = (classVal || "5").trim();
  const sub = (subject || "General").trim();
  const topicText = (syllabus || "").trim();
  const langStr = (language || "English").trim();

  let langDirective = "";
  if (langStr.toLowerCase() === "gujarati") {
    langDirective = `CRITICAL MANDATORY REQUIREMENT: The ENTIRE exam paper, including ALL question text, ALL 4 option choices (A, B, C, D), and instructions MUST BE 100% WRITTEN IN GUJARATI LANGUAGE ONLY (ગુજરાતી લીપી)! Do NOT output any English or Hindi words.`;
  } else if (langStr.toLowerCase() === "hindi") {
    langDirective = `CRITICAL MANDATORY REQUIREMENT: The ENTIRE exam paper, including ALL question text, ALL 4 option choices (A, B, C, D), and instructions MUST BE 100% WRITTEN IN HINDI LANGUAGE ONLY (हिंदी देवनागरी)! Do NOT output any English or Gujarati words.`;
  } else {
    langDirective = `CRITICAL MANDATORY REQUIREMENT: The ENTIRE exam paper, including ALL question text and ALL 4 option choices (A, B, C, D) MUST BE 100% WRITTEN IN ENGLISH LANGUAGE ONLY!`;
  }

  const prompt = `You are an expert examination paper creator for Class ${std} (Standard ${std}) ${sub} under Indian NCERT & State Curriculum.

Task: Generate EXACTLY ${numQuestions} BRAND NEW, UNIQUE multiple-choice questions (MCQs).

EXAM SPECIFICATIONS:
- Standard: Class ${std}
- Subject: ${sub}
- Target Difficulty: ${diff}
- Target Paper Language: ${langStr}
- Specific Syllabus Topics: "${topicText || `Class ${std} ${sub} Standard NCERT Curriculum Topics`}"

${langDirective}

STRICT RULES FOR GENERATION:
1. EVERY question MUST specifically test concepts, vocabulary, definitions, grammar rules, principles, or problems relevant to Class ${std} ${sub}.
2. If syllabus topics are provided ("${topicText}"), ALL questions MUST directly test THAT specific topic!
3. Provide EXACTLY 4 distinct option choices per question in ${langStr}.
4. Return ONLY raw valid JSON containing a "questions" array of question objects without markdown backticks.

SCHEMA FORMAT:
{
  "questions": [
    {
      "id": 1,
      "question": "Question text written 100% in ${langStr}",
      "options": ["Choice A in ${langStr}", "Choice B in ${langStr}", "Choice C in ${langStr}", "Choice D in ${langStr}"],
      "correctAnswer": 0,
      "marks": 1,
      "difficulty": "${diff}"
    }
  ]
}
`;

  if (apiKey && apiKey !== "your_xai_grok_api_key_here") {
    try {
      const isGroq = apiKey.startsWith("gsk_");
      const apiUrl = isGroq ? "https://api.groq.com/openai/v1/chat/completions" : GROK_API_URL;
      const primaryModel = isGroq ? "openai/gpt-oss-120b" : "grok-2-latest";

      let systemPrompt = "";
      if (langStr.toLowerCase() === "gujarati") {
        systemPrompt = "તમે શાળા શિક્ષણ માટેના નિષ્ણાત પરીક્ષા પ્રશ્નપત્ર નિર્માતા છો. તમારે તમામ પ્રશ્નો અને તમામ ૪ વિકલ્પો (A, B, C, D) 100% ગુજરાતી ભાષામાં જ લખવાના છે. ફક્ત RAW VALID JSON જ આપો.";
      } else if (langStr.toLowerCase() === "hindi") {
        systemPrompt = "आप स्कूली शिक्षा के लिए एक विशेषज्ञ परीक्षा प्रश्न पत्र निर्माता हैं। आपको सभी प्रश्न और चारों विकल्प (A, B, C, D) 100% केवल हिंदी भाषा में ही लिखने हैं। केवल RAW VALID JSON ही प्रदान करें।";
      } else {
        systemPrompt = "You are an expert examination question generator for school education. Generate all questions in English. Respond ONLY with raw valid JSON.";
      }

      console.log(`🤖 Requesting live AI MCQ generation via Groq Cloud (${primaryModel}) for Std ${std} ${sub} (${diff}) in ${langStr}...`);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: primaryModel,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt },
          ],
          temperature: 0.3,
          max_tokens: 1200,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const rawContent = data.choices?.[0]?.message?.content || "";
        const cleanJson = rawContent.replace(/```json/g, "").replace(/```/g, "").trim();
        let parsedData = null;
        try {
          parsedData = JSON.parse(cleanJson);
        } catch (e) {
          const match = cleanJson.match(/\[.*\]|\{.*\}/s);
          if (match) {
            try { parsedData = JSON.parse(match[0]); } catch (e2) {}
          }
        }

        const rawList = Array.isArray(parsedData)
          ? parsedData
          : (parsedData?.questions || parsedData?.data || parsedData?.mcqs || []);

        if (Array.isArray(rawList) && rawList.length > 0) {
          console.log(`✅ Live Groq AI Engine generated ${rawList.length} unique MCQs for Class ${std} ${sub} (${diff})`);
          return rawList.slice(0, numQuestions).map((item, idx) => {
            const opts = Array.isArray(item.options) && item.options.length >= 2
              ? item.options
              : ["Option A", "Option B", "Option C", "Option D"];

            let cIdx = 0;
            if (typeof item.correctAnswer === "number" && item.correctAnswer >= 0 && item.correctAnswer < opts.length) {
              cIdx = item.correctAnswer;
            } else if (typeof item.answer === "number" && item.answer >= 0 && item.answer < opts.length) {
              cIdx = item.answer;
            } else if (typeof item.answer === "string") {
              const matched = opts.findIndex(o => String(o).trim().toLowerCase() === item.answer.trim().toLowerCase());
              cIdx = matched >= 0 ? matched : 0;
            } else {
              cIdx = idx % opts.length;
            }

            return {
              id: idx + 1,
              question: item.question || item.questionText || item.q || `Question ${idx + 1}`,
              options: opts,
              correctAnswer: cIdx,
              marks: Number(item.marks) || 1,
              difficulty: item.difficulty || diff,
            };
          });
        }
      } else {
        const errText = await response.text();
        console.warn("⚠️ AI Primary API status:", response.status, errText);

        // Fallback retry with qwen/qwen3.8-27b model if primary returned error
        if (isGroq) {
          try {
            console.log("ℹ️ Retrying with Groq secondary model (qwen/qwen3.8-27b)...");
            const retryRes = await fetch(apiUrl, {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "qwen/qwen3.8-27b",
                messages: [
                  { role: "system", content: "You are a JSON-only API assistant for educational exam paper generation." },
                  { role: "user", content: prompt },
                ],
                temperature: 0.7,
              }),
            });

            if (retryRes.ok) {
              const retryData = await retryRes.json();
              const rawContent = retryData.choices?.[0]?.message?.content || "";
              const cleanJson = rawContent.replace(/```json/g, "").replace(/```/g, "").trim();
              let parsedData = null;
              try {
                parsedData = JSON.parse(cleanJson);
              } catch (e) {
                const match = cleanJson.match(/\[.*\]|\{.*\}/s);
                if (match) parsedData = JSON.parse(match[0]);
              }

              const rawList = Array.isArray(parsedData)
                ? parsedData
                : (parsedData?.questions || parsedData?.data || []);

              if (Array.isArray(rawList) && rawList.length > 0) {
                console.log(`✅ Groq Secondary Engine generated ${rawList.length} MCQs`);
                return rawList.slice(0, numQuestions).map((item, idx) => {
                  const opts = Array.isArray(item.options) && item.options.length >= 2
                    ? item.options
                    : ["Option A", "Option B", "Option C", "Option D"];

                  let cIdx = 0;
                  if (typeof item.correctAnswer === "number") cIdx = item.correctAnswer;
                  else if (typeof item.answer === "string") {
                    const m = opts.findIndex(o => String(o).trim().toLowerCase() === item.answer.trim().toLowerCase());
                    if (m >= 0) cIdx = m;
                  }

                  return {
                    id: idx + 1,
                    question: item.question || item.questionText || item.q || `Question ${idx + 1}`,
                    options: opts,
                    correctAnswer: cIdx,
                    marks: Number(item.marks) || 1,
                    difficulty: item.difficulty || diff,
                  };
                });
              }
            }
          } catch (retryErr) {
            console.warn("⚠️ Groq secondary retry exception:", retryErr.message);
          }
        }
      }
    } catch (error) {
      console.warn("⚠️ Groq AI Connection Exception:", error.message);
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
