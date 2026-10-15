import { buildApiUrl, getAuthHeaders } from "../utils/apiConfig";

/**
 * Online Examination & AI Assessment Service.
 * Fully backed by Express + MongoDB (/api/exams, /api/exams/:id/submit, /api/exams/:id/submissions, etc.).
 * Examination data is read from and written to the backend only.
 */

async function apiFetch(endpoint, options = {}) {
  const headers = { ...getAuthHeaders(), ...(options.headers || {}) };
  let response;
  try {
    response = await fetch(buildApiUrl(endpoint), { ...options, headers });
  } catch (error) {
    if (typeof window === "undefined" || window.location.hostname !== "localhost" || import.meta.env.VITE_API_URL) {
      throw new Error(`Unable to reach the examination service: ${error.message}`);
    }
    try {
      response = await fetch(`http://localhost:5000${endpoint}`, { ...options, headers });
    } catch (fallbackError) {
      throw new Error(`Unable to reach the examination service: ${fallbackError.message}`);
    }
  }
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `Examination request failed (${response.status}).`);
  }
  return response.json();
}

export const onlineExamService = {
  /** Fetch all online exams directly from MongoDB database */
  async getExams() {
    const data = await apiFetch("/api/exams");
    const list = Array.isArray(data) ? data : (data?.data || []);
    if (Array.isArray(list) && list.length > 0) {
      return list.map((e) => ({
        ...e,
        id: String(e._id || e.id || ""),
        class: String(e.classVal || e.class || "6"),
        classVal: String(e.classVal || e.class || "6"),
        status: String(e.status || "Published"),
        subject: String(e.subject || "General"),
        title: String(e.title || "Examination"),
        duration: String(e.duration || "30 minutes"),
        totalQuestions: Number(e.totalQuestions) || (e.questions ? e.questions.length : 10),
        totalMarks: Number(e.totalMarks) || 10,
        submissionsCount: Number(e.submissionsCount) || 0,
        totalStudents: Number(e.totalStudents) || 40,
        questions: Array.isArray(e.questions) ? e.questions : [],
      }));
    }
    return [];
  },

  /** Fetch single exam by ID */
  async getExamById(examId) {
    const e = await apiFetch(`/api/exams/${examId}`);
    if (!e) {
      throw new Error("The examination service returned no exam.");
    }
    return {
      ...e,
      id: String(e._id || e.id || examId),
      class: String(e.classVal || e.class || "6"),
      classVal: String(e.classVal || e.class || "6"),
      questions: Array.isArray(e.questions) ? e.questions : [],
    };
  },

  /** Create a new online exam using AI and persist to MongoDB + Cache */
  async createExam(payload) {
    const classVal = payload.class || payload.classVal || "6";
    const subject = payload.subject || "Science";
    const syllabus = payload.syllabus || "General Syllabus Topics";
    const totalQuestions = parseInt(payload.totalQuestions, 10) || 10;
    const totalMarks = parseInt(payload.totalMarks, 10) || totalQuestions;

    // Call backend to generate AI questions if not provided
    let aiQuestions = payload.questions || [];
    if (!aiQuestions || aiQuestions.length === 0) {
      const aiData = await apiFetch("/api/ai/generate-questions", {
        method: "POST",
        body: JSON.stringify({
          classVal,
          subject,
          syllabus,
          count: totalQuestions,
        }),
      });
      if (aiData && Array.isArray(aiData.questions) && aiData.questions.length > 0) {
        aiQuestions = aiData.questions.map((q, idx) => ({
          id: idx + 1,
          question: q.question || q.text || `Question ${idx + 1}`,
          options: q.options || ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: q.correctAnswer !== undefined ? q.correctAnswer : 0,
          marks: 1,
        }));
      }
    }
    if (!Array.isArray(aiQuestions) || aiQuestions.length === 0) {
      throw new Error("No exam questions were generated; the exam was not saved.");
    }

    const examPayload = {
      title: payload.title || `Class ${classVal} ${subject} - AI Exam`,
      classVal: String(classVal),
      subject: subject,
      syllabus: syllabus,
      duration: payload.duration || "30 minutes",
      durationMinutes: parseInt(payload.durationMinutes, 10) || 30,
      totalQuestions: aiQuestions.length || totalQuestions,
      totalMarks: totalMarks,
      status: payload.status || "Published",
      resultsStatus: "DRAFT",
      evaluationCompleted: false,
      submissionsCount: 0,
      totalStudents: 40,
      startDate: payload.startDate || new Date().toISOString().split("T")[0],
      endDate: payload.endDate || new Date(Date.now() + 86400000 * 5).toISOString().split("T")[0],
      questions: aiQuestions,
    };

    const created = await apiFetch("/api/exams", {
      method: "POST",
      body: JSON.stringify(examPayload),
    });

    const finalExam = created;

    return finalExam;
  },

  /** Publish an existing exam */
  async publishExam(examId) {
    const updated = await apiFetch(`/api/exams/${examId}/publish`, {
      method: "PATCH",
    });
    return updated;
  },

  /** Fetch student submissions for an exam */
  async getSubmissions(examId) {
    const data = await apiFetch(`/api/exams/${examId}/submissions`);
    const list = Array.isArray(data) ? data : (data?.data || []);
    return Array.isArray(list) ? list : [];
  },

  /** Submit student attempt */
  async submitExam({ examId, answers = {} }) {
    const submission = await apiFetch(`/api/exams/${examId}/submit`, {
      method: "POST",
      body: JSON.stringify({
        answers,
      }),
    });
    return submission;
  },

  /** Auto-evaluate all submissions for an exam */
  async evaluateExam(examId) {
    const res = await apiFetch(`/api/exams/${examId}/evaluate`, {
      method: "POST",
    });
    return res;
  },

  /** Publish Results so students can view them */
  async publishResults(examId) {
    const updated = await apiFetch(`/api/exams/${examId}/publish-results`, {
      method: "PATCH",
    });
    return updated;
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
      `"${s.studentName || 'Student'}"`,
      `"${s.studentId || ''}"`,
      `"${s.obtainedMarks || 0}/${(s.obtainedMarks || 0) + ((s.wrongCount || 0) + (s.unansweredCount || 0))}"`,
      `"${s.percentage || 0}%"`,
      s.correctCount || 0,
      s.wrongCount || 0,
      s.unansweredCount || 0,
      `"${s.performanceBadge || s.status || 'Submitted'}"`,
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
