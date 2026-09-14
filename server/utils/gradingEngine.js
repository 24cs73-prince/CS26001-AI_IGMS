/**
 * Server-Side Auto-Grading & Evaluation Engine
 * Compares student quiz responses against answer keys, calculates marks,
 * percentage, and generates AI performance feedback breakdown.
 */
export function evaluateStudentQuiz(questions = [], studentAnswers = {}) {
  let correctCount = 0;
  let wrongCount = 0;
  let unansweredCount = 0;
  let obtainedMarks = 0;

  questions.forEach((q) => {
    const qIdKey = String(q.id);
    const selected = studentAnswers[qIdKey] ?? studentAnswers[q.id];

    if (selected === undefined || selected === null) {
      unansweredCount++;
    } else if (Number(selected) === Number(q.correctAnswer)) {
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
        ? "Demonstrated exceptional conceptual clarity and precision across all topic questions."
        : "Good understanding of basic foundational question types.",
    areasForImprovement:
      percentage < 90
        ? "Review specific questions where incorrect option choices were selected."
        : "Work on advanced multi-step analytical problem sets.",
    recommendation:
      percentage >= 75
        ? "Maintain high accuracy with periodic revision sessions and mock quizzes."
        : "Re-read chapter summaries and practice additional problem sets.",
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
}
