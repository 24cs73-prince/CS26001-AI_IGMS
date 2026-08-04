/**
 * Mock AI service. Returns canned/dummy AI output after a short delay to
 * simulate model latency. No real model is called — this is UI-only.
 */
const delay = (ms = 1200) => new Promise((res) => setTimeout(res, ms));

/** Generate a dummy question paper for the given config. */
export async function generateQuestionPaper({ className, subject, difficulty, questionCount = 10 }) {
  await delay();
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
      totalMarks: sections.reduce(
        (sum, s, i) => sum + s.count * [1, 3, 5][i],
        0
      ),
      duration: '3 hours',
      generatedAt: new Date().toISOString(),
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

/** Return a dummy performance analysis for a student. */
export async function analyzePerformance(student) {
  await delay(900);
  const avg = student?.average ?? 74;
  const predicted = Math.min(99, Math.round(avg + (Math.random() * 8 - 2)));
  const band =
    avg >= 85 ? 'Excellent' : avg >= 70 ? 'Good' : avg >= 50 ? 'Average' : 'Needs Attention';

  return {
    band,
    strengths: ['Consistent attendance', 'Strong in conceptual questions', 'Timely submissions'],
    weaknesses: ['Application-based problems', 'Time management in exams'],
    recommendations: [
      'Allocate 30 minutes daily to practice application questions.',
      'Attempt two timed mock tests before the term exam.',
      'Revise formula sheets weekly with peer study groups.',
    ],
    prediction: {
      nextTermScore: predicted,
      confidence: 82,
      riskLevel: avg < 50 ? 'High' : avg < 70 ? 'Moderate' : 'Low',
    },
  };
}
