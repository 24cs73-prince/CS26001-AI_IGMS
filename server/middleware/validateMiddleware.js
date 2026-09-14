/**
 * Request Validation & Input Sanitization Middleware
 */
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
    return res.status(400).json({ message: "Syllabus / Topics context is required." });
  }

  next();
};

export const validateSubmitExam = (req, res, next) => {
  const { answers } = req.body;

  if (!answers || typeof answers !== "object") {
    return res.status(400).json({ message: "Student answer payload is required." });
  }

  next();
};
