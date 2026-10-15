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
const getApiKey = () =>
  [process.env.GROK_API_KEY, process.env.GROQ_API_KEY]
    .map((key) => key?.trim())
    .find((key) => key && key !== "your_xai_grok_api_key_here");

export const isAiProviderConfigured = () => Boolean(getApiKey());

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
  const apiKey = getApiKey();
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

        if (Array.isArray(rawList) && rawList.length >= numQuestions) {
          console.log(`✅ Live Groq AI Engine generated ${rawList.length} unique MCQs for Class ${std} ${sub} (${diff})`);
          return rawList.slice(0, numQuestions).map((item, idx) => {
            const question = item.question || item.questionText || item.q;
            const opts = item.options;
            if (
              typeof question !== "string" ||
              !question.trim() ||
              !Array.isArray(opts) ||
              opts.length !== 4 ||
              opts.some((option) => typeof option !== "string" || !option.trim())
            ) {
              throw new Error("AI provider returned an invalid question or option set.");
            }

            let answerIndex;
            if (Number.isInteger(item.correctAnswer) && item.correctAnswer >= 0 && item.correctAnswer < opts.length) {
              answerIndex = item.correctAnswer;
            } else if (Number.isInteger(item.answer) && item.answer >= 0 && item.answer < opts.length) {
              answerIndex = item.answer;
            } else if (typeof item.answer === "string") {
              answerIndex = opts.findIndex((option) =>
                option.trim().toLowerCase() === item.answer.trim().toLowerCase()
              );
            }
            if (!Number.isInteger(answerIndex) || answerIndex < 0) {
              throw new Error("AI provider returned an invalid correct answer.");
            }

            return {
              id: idx + 1,
              question: question.trim(),
              options: opts,
              correctAnswer: answerIndex,
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

  throw new Error(
    apiKey
      ? "AI provider did not return valid exam questions."
      : "AI question generation is not configured."
  );
}

/**
 * Generate Student Performance Analysis & Feedback using Grok AI API
 * @param {Object} params - { studentName, score, totalMarks, percentage, correctCount, wrongCount, subject }
 */
export async function analyzePerformanceWithGrok({
  score = 0,
  totalMarks = 10,
  percentage = 0,
  correctCount = 0,
  wrongCount = 0,
  subject = "General",
}) {
  const apiKey = getApiKey();

  if (apiKey && apiKey !== "your_xai_grok_api_key_here") {
    try {
      const isGroq = apiKey.startsWith("gsk_");
      const apiUrl = isGroq ? "https://api.groq.com/openai/v1/chat/completions" : GROK_API_URL;
      const model = isGroq ? "openai/gpt-oss-120b" : "grok-2-latest";

      const prompt = `Analyze exam performance for a student in ${subject}.
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
      console.warn("⚠️ AI Performance Analysis provider request failed:", e.message);
    }
  }

  throw new Error(
    apiKey
      ? "AI provider did not return valid performance analysis."
      : "AI performance analysis is not configured."
  );
}
