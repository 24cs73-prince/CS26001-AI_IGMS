import {
  MOCK_MCQ_PAPERS,
  INITIAL_ONLINE_EXAMS,
  INITIAL_SUBMISSIONS,
} from "../data/examMockData";

const STORAGE_KEYS = {
  EXAMS: "igms.online_exams",
  SUBMISSIONS: "igms.exam_submissions",
};

// Artificial network latency simulation helper
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

function loadStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

function saveStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}

/** Initialize storage if empty */
function ensureStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.EXAMS)) {
    saveStorage(STORAGE_KEYS.EXAMS, INITIAL_ONLINE_EXAMS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SUBMISSIONS)) {
    saveStorage(STORAGE_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
  }
}

ensureStorage();

/**
 * AI Question Generator Simulation (Class 1 to 8 Syllabus-based)
 * -----------------------------------------------------------------
 * FUTURE GROK AI API INTEGRATION POINT:
 * In production, replace this static generator with a real call to Grok AI:
 *
 * async function fetchGrokAIQuestions({ classVal, subject, syllabus, count }) {
 *   const response = await fetch("https://api.x.ai/v1/chat/completions", {
 *     method: "POST",
 *     headers: {
 *       "Authorization": `Bearer ${process.env.VITE_GROK_API_KEY}`,
 *       "Content-Type": "application/json"
 *     },
 *     body: JSON.stringify({
 *       model: "grok-2-latest",
 *       messages: [{
 *         role: "user",
 *         content: `Generate ${count} multiple choice questions for Class ${classVal} ${subject} based on this syllabus: "${syllabus}".`
 *       }]
 *     })
 *   });
 *   return await response.json();
 * }
 */
function generateAIQuestionsFromSyllabus({ classVal, subject, syllabus, count = 10 }) {
  const syllabusText = (syllabus || "General Syllabus").trim();
  const numQuestions = Math.max(1, parseInt(count, 10) || 10);

  // Subject-specific question databanks for Class 1 to 8
  const baseQuestions = {
    Science: [
      { q: "Which part of the plant absorbs water and minerals from the soil?", opt: ["Stem", "Roots", "Leaves", "Flower"], ans: 1 },
      { q: "What gas do humans breathe out during respiration?", opt: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], ans: 1 },
      { q: "Which of the following is a herbivorous animal?", opt: ["Tiger", "Lion", "Cow", "Eagle"], ans: 2 },
      { q: "What is the primary source of light and energy on Earth?", opt: ["Moon", "Sun", "Stars", "Fire"], ans: 1 },
      { q: "Water boils at what temperature at standard pressure?", opt: ["50°C", "80°C", "100°C", "120°C"], ans: 2 },
      { q: "Which organ controls all functions of the human body?", opt: ["Heart", "Brain", "Lungs", "Stomach"], ans: 1 },
      { q: "What process do green plants use to prepare their food?", opt: ["Respiration", "Photosynthesis", "Transpiration", "Evaporation"], ans: 1 },
      { q: "Which metal is liquid at room temperature?", opt: ["Iron", "Copper", "Mercury", "Aluminum"], ans: 2 },
      { q: "Which instrument is used to measure body temperature?", opt: ["Barometer", "Thermometer", "Speedometer", "Amphibian"], ans: 1 },
      { q: "Which chapter concept relates to:", opt: ["Living Things", "Energy & Force", "Chemical Reaction", "Ecosystem"], ans: 0 },
    ],
    Mathematics: [
      { q: "What is the place value of 5 in 4,528?", opt: ["5", "50", "500", "5000"], ans: 2 },
      { q: "What is the perimeter of a square with side length 6 cm?", opt: ["12 cm", "24 cm", "36 cm", "18 cm"], ans: 1 },
      { q: "Which fraction is equivalent to 1/2?", opt: ["2/4", "3/8", "1/3", "4/5"], ans: 0 },
      { q: "What is 12 × 11?", opt: ["121", "132", "144", "110"], ans: 1 },
      { q: "What is the smallest prime number?", opt: ["0", "1", "2", "3"], ans: 2 },
      { q: "If an angle is less than 90 degrees, it is called:", opt: ["Obtuse angle", "Right angle", "Acute angle", "Straight angle"], ans: 2 },
      { q: "Solve for x: x + 15 = 40", opt: ["15", "25", "30", "35"], ans: 1 },
      { q: "What is the sum of angles in a triangle?", opt: ["90°", "180°", "270°", "360°"], ans: 1 },
      { q: "Find the average of 10, 20, and 30:", opt: ["15", "20", "25", "30"], ans: 1 },
      { q: "What is the square root of 64?", opt: ["6", "7", "8", "9"], ans: 2 },
    ],
    English: [
      { q: "Choose the correct noun in the sentence: 'The cat ran quickly.'", opt: ["Cat", "Ran", "Quickly", "The"], ans: 0 },
      { q: "What is the antonym of 'Ancient'?", opt: ["Old", "Modern", "Historic", "Antique"], ans: 1 },
      { q: "Identify the pronoun: 'She is reading a book.'", opt: ["Reading", "Book", "She", "Is"], ans: 2 },
      { q: "Which sentence is written in the Past Tense?", opt: ["I walk to school", "I will walk to school", "I walked to school", "I am walking"], ans: 2 },
      { q: "Choose the correctly spelled word:", opt: ["Recieve", "Receive", "Recive", "Receeve"], ans: 1 },
      { q: "What is the plural of 'Child'?", opt: ["Childs", "Children", "Childrens", "Childes"], ans: 1 },
      { q: "Identify the adjective: 'The sky is blue.'", opt: ["Sky", "Is", "Blue", "The"], ans: 2 },
    ],
    "Social Science": [
      { q: "Which is the largest continent on Earth?", opt: ["Africa", "Asia", "Europe", "North America"], ans: 1 },
      { q: "Who was the first Prime Minister of independent India?", opt: ["Mahatma Gandhi", "Dr. B.R. Ambedkar", "Jawaharlal Nehru", "Sardar Patel"], ans: 2 },
      { q: "Which planet is known as the Blue Planet?", opt: ["Mars", "Venus", "Earth", "Jupiter"], ans: 2 },
      { q: "What is the capital city of India?", opt: ["Mumbai", "New Delhi", "Kolkata", "Bengaluru"], ans: 1 },
      { q: "The Indian Constitution came into effect on:", opt: ["15 August 1947", "26 January 1950", "2 October 1969", "26 November 1949"], ans: 1 },
    ],
  };

  const pool = baseQuestions[subject] || baseQuestions.Science;

  const generated = [];
  for (let i = 0; i < numQuestions; i++) {
    const template = pool[i % pool.length];
    
    // Customizing question text with Syllabus context
    let qText = template.q;
    if (i === 0 && syllabusText) {
      qText = `[${syllabusText}] ${template.q}`;
    }

    generated.push({
      id: i + 1,
      question: qText,
      options: template.opt,
      correctAnswer: template.ans,
      marks: 1,
    });
  }

  return generated;
}

export const onlineExamService = {
  /** Fetch all available MCQ question papers */
  async getMCQPapers() {
    await delay();
    return [...MOCK_MCQ_PAPERS];
  },

  /** Fetch all online exams */
  async getExams() {
    await delay();
    return loadStorage(STORAGE_KEYS.EXAMS, INITIAL_ONLINE_EXAMS);
  },

  /** Fetch single exam by ID */
  async getExamById(examId) {
    await delay();
    const exams = loadStorage(STORAGE_KEYS.EXAMS, INITIAL_ONLINE_EXAMS);
    return exams.find((e) => e.id === examId) || null;
  },

  /**
   * Create a new online exam using AI-generated questions from Syllabus
   */
  async createExam(payload) {
    await delay(600); // Artificial delay to simulate AI processing
    const exams = loadStorage(STORAGE_KEYS.EXAMS, INITIAL_ONLINE_EXAMS);

    const classVal = payload.class || "5";
    const subject = payload.subject || "Science";
    const syllabus = payload.syllabus || "General Syllabus Topics";
    const totalQuestions = parseInt(payload.totalQuestions, 10) || 10;
    const totalMarks = parseInt(payload.totalMarks, 10) || totalQuestions;

    // Generate AI questions matching the syllabus and class
    const aiQuestions = generateAIQuestionsFromSyllabus({
      classVal,
      subject,
      syllabus,
      count: totalQuestions,
    });

    // Each question gets proportional marks
    const markPerQ = totalMarks / aiQuestions.length;
    aiQuestions.forEach((q) => {
      q.marks = markPerQ;
    });

    const newExam = {
      id: `exam_${Date.now()}`,
      title: payload.title || `Class ${classVal} ${subject} - AI Exam`,
      class: classVal,
      subject: subject,
      syllabus: syllabus,
      duration: payload.duration || "30 minutes",
      durationMinutes: parseInt(payload.durationMinutes, 10) || 30,
      totalQuestions: aiQuestions.length,
      totalMarks: totalMarks,
      status: payload.status || "Published", // "Draft" or "Published"
      resultsStatus: "DRAFT",
      evaluationCompleted: false,
      submissionsCount: 0,
      totalStudents: 40,
      startDate: payload.startDate || new Date().toISOString().split("T")[0],
      endDate: payload.endDate || new Date(Date.now() + 86400000 * 5).toISOString().split("T")[0],
      questions: aiQuestions,
    };

    const updated = [newExam, ...exams];
    saveStorage(STORAGE_KEYS.EXAMS, updated);

    // Initialize empty submissions array for this new exam
    const submissionsMap = loadStorage(STORAGE_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
    submissionsMap[newExam.id] = [];
    saveStorage(STORAGE_KEYS.SUBMISSIONS, submissionsMap);

    return newExam;
  },

  /** Publish an existing draft exam */
  async publishExam(examId) {
    await delay();
    const exams = loadStorage(STORAGE_KEYS.EXAMS, INITIAL_ONLINE_EXAMS);
    const updated = exams.map((e) =>
      e.id === examId ? { ...e, status: "Published" } : e
    );
    saveStorage(STORAGE_KEYS.EXAMS, updated);
    return updated.find((e) => e.id === examId);
  },

  /** Fetch student submissions for an exam */
  async getSubmissions(examId) {
    await delay();
    const submissionsMap = loadStorage(STORAGE_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
    return submissionsMap[examId] || [];
  },

  /** Pure evaluation calculation helper function */
  calculateEvaluation(questions, studentAnswers) {
    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;
    let obtainedMarks = 0;

    questions.forEach((q) => {
      const selected = studentAnswers[q.id];
      if (selected === undefined || selected === null) {
        unansweredCount++;
      } else if (selected === q.correctAnswer) {
        correctCount++;
        obtainedMarks += q.marks || 1;
      } else {
        wrongCount++;
      }
    });

    const totalMarks = questions.reduce((acc, q) => acc + (q.marks || 1), 0);
    const percentage = Math.round((obtainedMarks / (totalMarks || 1)) * 100);

    let performanceBadge = "Needs Improvement";
    if (percentage >= 85) performanceBadge = "Excellent";
    else if (percentage >= 70) performanceBadge = "Good";
    else if (percentage >= 50) performanceBadge = "Satisfactory";

    const aiFeedback = {
      overallPerformance: performanceBadge,
      strengths:
        percentage >= 80
          ? "Demonstrated excellent mastery of core syllabus concepts and principles."
          : "Good understanding of foundational questions.",
      areasForImprovement:
        percentage < 90
          ? "Review questions where incorrect options were selected."
          : "Work on advanced analytical questions.",
      recommendation:
        percentage >= 75
          ? "Maintain high accuracy with periodic revision sessions."
          : "Re-read chapter summaries and practice more problem sets.",
    };

    return {
      obtainedMarks,
      totalMarks,
      percentage,
      correctCount,
      wrongCount,
      unansweredCount,
      performanceBadge,
      aiFeedback,
    };
  },

  /** Submit student attempt */
  async submitExam({ examId, studentId = "ST001", studentName = "Rahul Patel", answers = {} }) {
    await delay(600);
    const exams = loadStorage(STORAGE_KEYS.EXAMS, INITIAL_ONLINE_EXAMS);
    const exam = exams.find((e) => e.id === examId);
    if (!exam) throw new Error("Exam not found");

    const submissionsMap = loadStorage(STORAGE_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
    const examSubs = submissionsMap[examId] || [];

    const existingIndex = examSubs.findIndex((s) => s.studentId === studentId);

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const evalResults = this.calculateEvaluation(exam.questions, answers);

    const submissionObj = {
      studentId,
      studentName,
      class: exam.class,
      division: "A",
      submittedAt: timeStr,
      status: "Submitted",
      evaluated: false,
      answers,
      ...evalResults,
    };

    if (existingIndex >= 0) {
      examSubs[existingIndex] = submissionObj;
    } else {
      examSubs.push(submissionObj);
    }

    submissionsMap[examId] = examSubs;
    saveStorage(STORAGE_KEYS.SUBMISSIONS, submissionsMap);

    exam.submissionsCount = examSubs.length;
    saveStorage(STORAGE_KEYS.EXAMS, exams);

    return submissionObj;
  },

  /** Teacher action: Run mock evaluation on all submissions for an exam */
  async evaluateExam(examId) {
    await delay(600);
    const exams = loadStorage(STORAGE_KEYS.EXAMS, INITIAL_ONLINE_EXAMS);
    const exam = exams.find((e) => e.id === examId);
    if (!exam) throw new Error("Exam not found");

    const submissionsMap = loadStorage(STORAGE_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
    const examSubs = submissionsMap[examId] || [];

    const evaluatedSubs = examSubs.map((sub) => {
      const evalRes = this.calculateEvaluation(exam.questions, sub.answers || {});
      return {
        ...sub,
        ...evalRes,
        evaluated: true,
      };
    });

    submissionsMap[examId] = evaluatedSubs;
    saveStorage(STORAGE_KEYS.SUBMISSIONS, submissionsMap);

    exam.evaluationCompleted = true;
    saveStorage(STORAGE_KEYS.EXAMS, exams);

    return {
      evaluatedCount: evaluatedSubs.length,
      submissions: evaluatedSubs,
    };
  },

  /** Teacher action: Publish Results so students can view them */
  async publishResults(examId) {
    await delay(500);
    const exams = loadStorage(STORAGE_KEYS.EXAMS, INITIAL_ONLINE_EXAMS);
    const updated = exams.map((e) =>
      e.id === examId ? { ...e, resultsStatus: "PUBLISHED" } : e
    );
    saveStorage(STORAGE_KEYS.EXAMS, updated);
    return updated.find((e) => e.id === examId);
  },

  /** Download results as CSV file */
  downloadResultsCSV(examTitle, submissions = []) {
    if (!submissions || submissions.length === 0) return;

    const headers = [
      "Student Name",
      "Student ID",
      "Marks",
      "Percentage",
      "Correct",
      "Wrong",
      "Unanswered",
      "Status",
    ];

    const rows = submissions.map((s) => [
      `"${s.studentName}"`,
      `"${s.studentId}"`,
      `"${s.obtainedMarks}/${s.obtainedMarks + (s.wrongCount + s.unansweredCount)}"`,
      `"${s.percentage}%"`,
      s.correctCount,
      s.wrongCount,
      s.unansweredCount,
      `"${s.performanceBadge || 'Submitted'}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const cleanTitle = (examTitle || "Exam_Results").replace(/[^a-zA-Z0-9]/g, "_");
    link.setAttribute("download", `${cleanTitle}_Results.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
