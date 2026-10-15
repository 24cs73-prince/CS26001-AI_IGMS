/**
 * Request Validation & Input Sanitization Middleware
 */
export const isStrongPassword = (password) =>
  typeof password === "string" &&
  password.length >= 8 &&
  /[A-Z]/.test(password) &&
  /[a-z]/.test(password) &&
  /[0-9]/.test(password) &&
  /[^A-Za-z0-9]/.test(password);

export const validateCreateExam = (req, res, next) => {
  const { title, classVal, subject, syllabus } = req.body;

  if (!title || !String(title).trim()) {
    return res.status(400).json({ message: "Exam title is required." });
  }

  if (!classVal) {
    return res.status(400).json({ message: "Class / Standard selection is required." });
  }

  if (!subject || !String(subject).trim()) {
    return res.status(400).json({ message: "Subject is required." });
  }

  if (!syllabus || !String(syllabus).trim()) {
    req.body.syllabus = "Standard Grade Curriculum";
  }

  next();
};

export const validateSubmitExam = (req, res, next) => {
  const { answers } = req.body;

  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    return res.status(400).json({ message: "Student answer payload is required." });
  }
  if (Object.values(answers).some((answer) => !Number.isInteger(answer) || answer < 0)) {
    return res.status(400).json({ message: "Answers must be non-negative option indexes." });
  }

  next();
};
