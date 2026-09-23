/**
 * Server-Side Spreadsheet & CSV Export Utility Helper
 * Formats student examination results into structured CSV data for download.
 */
export function generateResultsCSV(examTitle, submissions = []) {
  const headers = [
    "Student Name",
    "Student ID",
    "Class",
    "Division",
    "Submitted Time",
    "Marks Obtained",
    "Total Marks",
    "Percentage",
    "Correct Answers",
    "Wrong Answers",
    "Unanswered",
    "Performance Status",
  ];

  const rows = submissions.map((s) => [
    `"${s.studentName || 'Student'}"`,
    `"${s.studentId || ''}"`,
    `"${s.classVal || ''}"`,
    `"${s.division || 'A'}"`,
    `"${s.submittedAt || ''}"`,
    s.obtainedMarks || 0,
    s.totalMarks || 0,
    `"${s.percentage || 0}%"`,
    s.correctCount || 0,
    s.wrongCount || 0,
    s.unansweredCount || 0,
    `"${s.performanceBadge || 'Submitted'}"`,
  ]);

  const csvString = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
  
  return {
    filename: `${(examTitle || "Exam_Results").replace(/[^a-zA-Z0-9]/g, "_")}_Results.csv`,
    contentType: "text/csv; charset=utf-8",
    data: csvString,
  };
}
