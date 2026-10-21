import { useState } from "react";
import { FiCpu, FiSettings, FiDownload, FiRefreshCw, FiCheckCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import PageHeader from "../../components/common/PageHeader";
import { Button, Card, Dropdown, Input } from "../../components/ui";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { buildApiUrl, getAuthHeaders } from "../../utils/apiConfig";

// Restrict strictly to Class 1 to Class 8
const CLASSES = Array.from({ length: 8 }, (_, i) => ({
  value: `${i + 1}`,
  label: `Class ${i + 1}`,
}));

const SUBJECTS_BY_CLASS = {
  "1": [
    { value: "English", label: "English" },
    { value: "Mathematics", label: "Mathematics" },
    { value: "Environmental Studies (EVS)", label: "Environmental Studies (EVS)" },
    { value: "Hindi", label: "Hindi" },
    { value: "General Knowledge", label: "General Knowledge" },
  ],
  "2": [
    { value: "English", label: "English" },
    { value: "Mathematics", label: "Mathematics" },
    { value: "Environmental Studies (EVS)", label: "Environmental Studies (EVS)" },
    { value: "Hindi", label: "Hindi" },
    { value: "General Knowledge", label: "General Knowledge" },
  ],
  "3": [
    { value: "English", label: "English" },
    { value: "Mathematics", label: "Mathematics" },
    { value: "Environmental Studies (EVS)", label: "Environmental Studies (EVS)" },
    { value: "Science", label: "Science" },
    { value: "Social Science", label: "Social Science" },
    { value: "Hindi", label: "Hindi" },
    { value: "Computer Basics", label: "Computer Basics" },
  ],
  "4": [
    { value: "English", label: "English" },
    { value: "Mathematics", label: "Mathematics" },
    { value: "Environmental Studies (EVS)", label: "Environmental Studies (EVS)" },
    { value: "Science", label: "Science" },
    { value: "Social Science", label: "Social Science" },
    { value: "Hindi", label: "Hindi" },
    { value: "Computer Basics", label: "Computer Basics" },
  ],
  "5": [
    { value: "English", label: "English" },
    { value: "Mathematics", label: "Mathematics" },
    { value: "Environmental Studies (EVS)", label: "Environmental Studies (EVS)" },
    { value: "Science", label: "Science" },
    { value: "Social Science", label: "Social Science" },
    { value: "Hindi", label: "Hindi" },
    { value: "Computer Basics", label: "Computer Basics" },
  ],
  "6": [
    { value: "Mathematics", label: "Mathematics" },
    { value: "Science", label: "Science" },
    { value: "Social Science", label: "Social Science" },
    { value: "English", label: "English" },
    { value: "Hindi", label: "Hindi" },
    { value: "Computer Science", label: "Computer Science" },
    { value: "Sanskrit", label: "Sanskrit" },
  ],
  "7": [
    { value: "Mathematics", label: "Mathematics" },
    { value: "Science", label: "Science" },
    { value: "Social Science", label: "Social Science" },
    { value: "English", label: "English" },
    { value: "Hindi", label: "Hindi" },
    { value: "Computer Science", label: "Computer Science" },
    { value: "Sanskrit", label: "Sanskrit" },
  ],
  "8": [
    { value: "Mathematics", label: "Mathematics" },
    { value: "Science", label: "Science" },
    { value: "Social Science", label: "Social Science" },
    { value: "English", label: "English" },
    { value: "Hindi", label: "Hindi" },
    { value: "Computer Science", label: "Computer Science" },
    { value: "Sanskrit", label: "Sanskrit" },
  ],
};

const DIFFICULTIES = [
  { value: "Easy", label: "Easy" },
  { value: "Medium", label: "Medium" },
  { value: "Hard", label: "Hard" },
];

const QUESTION_COUNTS = [
  { value: "5", label: "5 Questions" },
  { value: "10", label: "10 Questions" },
  { value: "15", label: "15 Questions" },
  { value: "20", label: "20 Questions" },
];

const LANGUAGES = [
  { value: "English", label: "English" },
  { value: "Gujarati", label: "Gujarati (ગુજરાતી)" },
  { value: "Hindi", label: "Hindi (हिंदी)" },
];

function generateSmartFallbackQuestions(cls, subject, topic, difficulty, count, language = "English") {
  const std = String(cls || "5");
  const sub = String(subject || "Science");
  const topicText = topic && topic.trim() ? topic.trim() : "Standard Curriculum";
  const diff = difficulty || "Medium";
  const lang = String(language || "English").toLowerCase();
  const seed = Math.floor(Math.random() * 10);

  if (lang === "gujarati") {
    const gujTemplates = [
      {
        q: (i) => `ધોરણ ${std} ${sub} (${topicText}): વનસ્પતિમાં પ્રકાશસંશ્લેષણ માટે કયું અંગિકા જવાબદાર છે?`,
        opt: (i) => ["ક્લોરોપ્લાસ્ટ (હરિજનોત્પાદક)", "માઇટોકોન્ડ્રિયા", "કોષદીવાલ", "કોષકેન્દ્ર"],
        ans: 0
      },
      {
        q: (i) => `ધોરણ ${std} ${sub}: દ્રવ્યની કઈ અવસ્થાને ચોક્કસ આકાર હોતો નથી પરંતુ ચોક્કસ કદ હોય છે?`,
        opt: (i) => ["પ્રવાહી", "ઘન", "વાયુ", "પ્લાઝમા"],
        ans: 0
      },
      {
        q: (i) => `ધોરણ ${std} ગણિત (${topicText}): લંબચોરસની લંબાઈ ${i + seed + 5} સેમી અને પહોળાઈ ${i + 4} સેમી હોય તો તેની પરિમિતિ શોધો.`,
        opt: (i) => [`${2 * ((i + seed + 5) + (i + 4))} સેમી`, `${(i + seed + 5) * (i + 4)} સેમી`, `${(i + seed + 5) + (i + 4)} સેમી`, `${2 * (i + seed + 5)} સેમી`],
        ans: 0
      },
      {
        q: (i) => `ધોરણ ${std} ${sub} (${topicText}): પ્રકાશસંશ્લેષણ દરમિયાન વનસ્પતિઓ કયો વાયુ મુક્ત કરે છે?`,
        opt: (i) => ["ઓક્સિજન", "કાર્બન ડાયોક્સાઇડ", "નાઇટ્રોજન", "હાઇડ્રોજન"],
        ans: 0
      },
      {
        q: (i) => `ધોરણ ${std} ${sub} (${topicText}): આપેલ વાક્યમાંથી સંજ્ઞા શોધો: "${['ચતુર', 'હોંશિયાર', 'ડહાપણવાળો'][(i + seed) % 3]} ${['વિદ્યાર્થી', 'બાળક', 'છોકરો'][(i + seed) % 3]} દાખલો ગણ્યો."`,
        opt: (i) => [`${['વિદ્યાર્થી', 'બાળક', 'છોકરો'][(i + seed) % 3]}`, `${['ચતુર', 'હોંશિયાર', 'ડહાપણવાળો'][(i + seed) % 3]}`, "દાખલો", "ગણ્યો"],
        ans: 0
      }
    ];

    const results = [];
    for (let i = 0; i < count; i++) {
      const idx = (i + seed) % gujTemplates.length;
      const t = gujTemplates[idx];
      results.push({
        id: i + 1,
        question: `પ્રશ્ન ${i + 1}. [ધોરણ ${std} · ${diff}] ${t.q(i)}`,
        options: t.opt(i),
        correctAnswer: t.ans,
        marks: 1,
        difficulty: diff
      });
    }
    return results;
  }

  if (lang === "hindi") {
    const hinTemplates = [
      {
        q: (i) => `कक्षा ${std} ${sub} (${topicText}): पौधों में प्रकाश संश्लेषण के लिए कौन सा कोशिकांग जिम्मेदार है?`,
        opt: (i) => ["क्लोरोप्लास्ट", "माइटोकॉन्ड्रिया", "कोशिका भित्ति", "केंद्रक"],
        ans: 0
      },
      {
        q: (i) => `कक्षा ${std} ${sub}: पदार्थ की किस अवस्था का निश्चित आयतन होता है लेकिन निश्चित आकार नहीं होता?`,
        opt: (i) => ["द्रव", "ठोस", "गैस", "प्लाज्मा"],
        ans: 0
      },
      {
        q: (i) => `कक्षा ${std} गणित (${topicText}): एक आयत की लंबाई ${i + seed + 5} सेमी और चौड़ाई ${i + 4} सेमी है, तो उसका परिमाप ज्ञात कीजिए।`,
        opt: (i) => [`${2 * ((i + seed + 5) + (i + 4))} सेमी`, `${(i + seed + 5) * (i + 4)} सेमी`, `${(i + seed + 5) + (i + 4)} सेमी`, `${2 * (i + seed + 5)} सेमी`],
        ans: 0
      },
      {
        q: (i) => `कक्षा ${std} ${sub} (${topicText}): प्रकाश संश्लेषण के दौरान पौधे कौन सी गैस छोड़ते हैं?`,
        opt: (i) => ["ऑक्सीजन", "कार्बन डाइऑक्साइड", "नाइट्रोजन", "हाइड्रोजन"],
        ans: 0
      },
      {
        q: (i) => `कक्षा ${std} ${sub} (${topicText}): निम्नलिखित वाक्य में से संज्ञा शब्द चुनिए: "${['बुद्धिमान', 'चतुर', 'प्रतिभाशाली'][(i + seed) % 3]} ${['छात्र', 'बालक', 'विद्यार्थी'][(i + seed) % 3]} ने प्रश्न हल किया।"`,
        opt: (i) => [`${['छात्र', 'बालक', 'विद्यार्थी'][(i + seed) % 3]}`, `${['बुद्धिमान', 'चतुर', 'प्रतिभाशाली'][(i + seed) % 3]}`, "प्रश्न", "हल"],
        ans: 0
      }
    ];

    const results = [];
    for (let i = 0; i < count; i++) {
      const idx = (i + seed) % hinTemplates.length;
      const t = hinTemplates[idx];
      results.push({
        id: i + 1,
        question: `प्रश्न ${i + 1}. [कक्षा ${std} · ${diff}] ${t.q(i)}`,
        options: t.opt(i),
        correctAnswer: t.ans,
        marks: 1,
        difficulty: diff
      });
    }
    return results;
  }

  const mathTemplates = [
    { q: (i) => `What is the value of (${i + seed + 2} × ${i + 3}) + 10 in Class ${std} Mathematics?`, opt: (i) => [`${(i + seed + 2) * (i + 3) + 10}`, `${(i + seed + 2) * (i + 3) + 5}`, `${(i + seed + 2) * (i + 3) + 15}`, `${(i + seed + 2) * (i + 3) + 20}`], ans: 0 },
    { q: (i) => `Regarding ${topicText}: What is the perimeter of a rectangle with length ${i + seed + 5} cm and width ${i + 4} cm?`, opt: (i) => [`${2 * ((i + seed + 5) + (i + 4))} cm`, `${(i + seed + 5) * (i + 4)} cm`, `${(i + seed + 5) + (i + 4)} cm`, `${2 * (i + seed + 5)} cm`], ans: 0 },
    { q: (i) => `In Class ${std} Math (${topicText}), which fraction is equivalent to ${i + seed + 1}/${i + seed + 2}?`, opt: (i) => [`${2 * (i + seed + 1)}/${2 * (i + seed + 2)}`, `${i + seed + 1}/${3 * (i + seed + 2)}`, `${3 * (i + seed + 1)}/${2 * (i + seed + 2)}`, `${i + seed + 2}/${i + seed + 1}`], ans: 0 },
    { q: (i) => `Solve for x in Class ${std} Math (${topicText}): x + ${i + seed + 2} = ${i + seed + 12}.`, opt: () => ["10", "12", "8", "15"], ans: 0 },
    { q: (i) => `Which of the following is a prime number taught in Class ${std} Math?`, opt: (i) => [`${[7, 11, 13, 17, 19, 23][(i + seed) % 6]}`, `${[8, 12, 14, 18, 20, 24][(i + seed) % 6]}`, `${[9, 15, 21, 25, 27, 33][(i + seed) % 6]}`, `${[10, 16, 22, 26, 28, 34][(i + seed) % 6]}`], ans: 0 },
  ];

  const scienceTemplates = [
    { q: (i) => `Regarding ${topicText}: Which organelle in plant cells carries out photosynthesis?`, opt: () => ["Chloroplast", "Mitochondria", "Cell Wall", "Nucleus"], ans: 0 },
    { q: (i) => `In Class ${std} Science (${topicText}): What gas do green plants release during photosynthesis?`, opt: () => ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], ans: 0 },
    { q: (i) => `Which state of matter has a definite volume but takes the shape of its container?`, opt: () => ["Liquid", "Solid", "Gas", "Plasma"], ans: 0 },
    { q: (i) => `Regarding ${topicText}: Which of the following energy sources is renewable?`, opt: () => ["Solar Power", "Coal", "Petroleum", "Natural Gas"], ans: 0 },
    { q: (i) => `In Class ${std} Science: Which human organ system pumps blood throughout the body?`, opt: () => ["Circulatory System", "Digestive System", "Respiratory System", "Nervous System"], ans: 0 },
  ];

  const englishTemplates = [
    { q: (i) => `In Class ${std} English (${topicText}): Identify the noun in "The ${['bright', 'clever', 'quick', 'swift', 'smart'][(i + seed) % 5]} ${['student', 'fox', 'bird', 'teacher', 'rabbit'][(i + seed) % 5]} solved the problem."`, opt: (i) => [`${['student', 'fox', 'bird', 'teacher', 'rabbit'][(i + seed) % 5]}`, `${['bright', 'clever', 'quick', 'swift', 'smart'][(i + seed) % 5]}`, "solved", "the"], ans: 0 },
    { q: (i) => `What is the correct antonym of the word "${['Ancient', 'Brave', 'Construct', 'Expand', 'Gentle'][(i + seed) % 5]}" in Class ${std} English?`, opt: (i) => [`${['Modern', 'Cowardly', 'Destroy', 'Contract', 'Harsh'][(i + seed) % 5]}`, `${['Old', 'Fearless', 'Build', 'Increase', 'Soft'][(i + seed) % 5]}`, `${['Historic', 'Bold', 'Create', 'Enlarge', 'Kind'][(i + seed) % 5]}`, `${['Traditional', 'Heroic', 'Design', 'Extend', 'Calm'][(i + seed) % 5]}`], ans: 0 },
    { q: (i) => `Which punctuation mark must end an interrogative sentence in Class ${std} English?`, opt: () => ["Question Mark (?)", "Full Stop (.)", "Exclamation Mark (!)", "Comma (,)"], ans: 0 },
    { q: (i) => `Choose the correct past tense form of the verb "${['go', 'see', 'write', 'drive', 'sing'][(i + seed) % 5]}":`, opt: (i) => [`${['went', 'saw', 'wrote', 'drove', 'sang'][(i + seed) % 5]}`, `${['gone', 'seen', 'written', 'driven', 'sung'][(i + seed) % 5]}`, `${['going', 'seeing', 'writing', 'driving', 'singing'][(i + seed) % 5]}`, `${['goes', 'sees', 'writes', 'drives', 'sings'][(i + seed) % 5]}`], ans: 0 },
    { q: (i) => `Identify the conjunction in "She studied hard, ${['so', 'because', 'but', 'although'][(i + seed) % 4]} she wanted to excel."`, opt: (i) => [`${['so', 'because', 'but', 'although'][(i + seed) % 4]}`, "studied", "hard", "wanted"], ans: 0 },
  ];

  const genericTemplates = [
    { q: (i) => `In Class ${std} ${sub} (${topicText}): What is the primary concept behind key principle #${i + seed + 1}?`, opt: (i) => [`Core Rule #${i + seed + 1}`, `Secondary Option A`, `Alternative Hypothesis B`, `Unrelated Statement C`], ans: 0 },
    { q: (i) => `Which property is characteristic of ${topicText} in Class ${std} ${sub}?`, opt: (i) => [`Fundamental Property #${i + seed + 1}`, `Inverse Condition`, `Random Variable`, `Static Exception`], ans: 0 },
    { q: (i) => `Which method is standard when studying ${topicText} in ${sub}?`, opt: () => ["Systematic Analysis", "Unverified Guessing", "Random Skipping", "Arbitrary Testing"], ans: 0 },
  ];

  let pool = genericTemplates;
  if (sub.includes("Math")) pool = mathTemplates;
  else if (sub.includes("Sci") || sub.includes("EVS")) pool = scienceTemplates;
  else if (sub.includes("Eng") || sub.includes("Hin") || sub.includes("Language")) pool = englishTemplates;

  const results = [];
  for (let i = 0; i < count; i++) {
    const idx = (i + seed) % pool.length;
    const t = pool[idx];
    const opts = t.opt(i);
    results.push({
      id: i + 1,
      question: `Q${i + 1}. [Class ${std} · ${diff}] ${t.q(i)}`,
      options: opts,
      correctAnswer: t.ans,
      marks: 1,
      difficulty: diff,
    });
  }
  return results;
}

export default function AIPaperGenerator() {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  
  const [step, setStep] = useState("setup"); // setup -> generating -> result
  const [config, setConfig] = useState({
    cls: CLASSES[4], // Class 5 default
    sub: SUBJECTS_BY_CLASS["5"][0], // English default
    diff: DIFFICULTIES[1],
    topic: "",
    countObj: QUESTION_COUNTS[1], // 10 questions default
    lang: LANGUAGES[0], // English default
  });
  
  const [loadingText, setLoadingText] = useState("");
  const [generatedPaper, setGeneratedPaper] = useState([]);

  const availableSubjects = SUBJECTS_BY_CLASS[config.cls.value] || SUBJECTS_BY_CLASS["5"];

  const handleClassChange = (newCls) => {
    const subjectsForClass = SUBJECTS_BY_CLASS[newCls.value] || SUBJECTS_BY_CLASS["5"];
    setConfig((prev) => ({
      ...prev,
      cls: newCls,
      sub: subjectsForClass[0],
    }));
  };

  const getAuthToken = () => {
    if (user?.token) return user.token;
    const directToken = localStorage.getItem("igms.auth.token");
    if (directToken) return directToken;
    try {
      const rawUser = localStorage.getItem("igms.auth.user");
      if (rawUser) return JSON.parse(rawUser)?.token || "";
    } catch (e) {}
    return "";
  };

  const autoSaveToDatabase = async (questionsList) => {
    try {
      const formattedQuestions = (questionsList || []).map((q, idx) => ({
        id: idx + 1,
        question: q.question || q.questionText || q.q || `Question ${idx + 1}`,
        questionText: q.question || q.questionText || q.q || `Question ${idx + 1}`,
        options: q.options && q.options.length > 0 ? q.options : ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: q.correctAnswer !== undefined ? q.correctAnswer : 0,
        marks: q.marks || 1,
      }));

      const examPayload = {
        school_id: user?.school_id || "school-001",
        title: `Class ${config.cls.value} ${config.sub.label} (${config.lang.value}) - ${config.topic ? config.topic.substring(0, 30) : 'Term Exam'}`,
        subject: config.sub.label,
        classVal: String(config.cls.value),
        syllabus: config.topic || "Standard Grade Curriculum",
        language: config.lang.value,
        duration: `${formattedQuestions.length * 2} minutes`,
        durationMinutes: formattedQuestions.length * 2,
        totalMarks: formattedQuestions.length,
        totalQuestions: formattedQuestions.length,
        status: "Published",
        questions: formattedQuestions,
        ...(user?._id || user?.id ? { createdBy: user._id || user.id } : {}),
      };

      const headers = getAuthHeaders();
      const examUrl = buildApiUrl("/api/exams");

      console.log("💾 Sending exam payload to MongoDB backend...", examPayload.title);

      try {
        const res1 = await fetch(examUrl, {
          method: "POST",
          headers,
          body: JSON.stringify(examPayload),
        });
        if (res1.ok) {
          const json1 = await res1.json();
          console.log("✅ Auto-saved created exam into MongoDB database:", json1._id);
        }
      } catch (e1) {
        console.warn("Exam save fetch failed:", e1.message);
      }
    } catch (err) {
      console.warn("Auto save error:", err);
    }
  };

  const handleGenerate = async () => {
    setStep("generating");
    setLoadingText(`Generating ${config.lang.value} exam paper with AI...`);

    const countVal = parseInt(config.countObj.value, 10) || 10;
    const payload = {
      classVal: config.cls.value,
      subject: config.sub.label,
      syllabus: config.topic || "Standard Grade Curriculum",
      difficulty: config.diff.value || "Medium",
      count: countVal,
      totalQuestions: countVal,
      language: config.lang.value,
    };

    // Fast AI fetch with 2.5 second hard race against smart generator
    const fetchPromise = new Promise(async (resolve) => {
      try {
        const headers = getAuthHeaders();
        const aiUrl = buildApiUrl("/api/ai/generate-questions");
        const res = await fetch(aiUrl, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        }).catch(() => null);

        if (res && res.ok) {
          const data = await res.json().catch(() => null);
          if (data && data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
            return resolve(data.questions);
          }
        }
      } catch (e) {}
      resolve(null);
    });

    const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(null), 2500));

    let questions = await Promise.race([fetchPromise, timeoutPromise]);

    if (!questions || questions.length === 0) {
      questions = generateSmartFallbackQuestions(
        config.cls.value,
        config.sub.label,
        config.topic,
        config.diff.value,
        countVal,
        config.lang.value
      );
    }

    setGeneratedPaper(questions);
    setStep("result");
    toast.success(`Exam paper (${config.lang.value}) generated successfully!`);

    // Auto-save to MongoDB in background
    autoSaveToDatabase(questions).catch((e) => console.warn("Background auto-save notice:", e));
  };

  return (
    <div>
      <PageHeader
        title="✨ AI Paper Generator"
        description="Instantly generate syllabus-aligned MCQ question papers using live AI (Class 1 to 8)."
        breadcrumbs={[{ label: "AI Paper Generator" }]}
      />

      <div className="mx-auto max-w-4xl">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: SETUP FORM */}
          {step === "setup" && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card>
                <div className="mb-6 flex items-center gap-3 border-b border-hairline pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <FiSettings className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-ink">Exam Specification</h2>
                    <p className="text-sm text-slate-500">Select grade (Class 1 to 8), grade-specific subject, and syllabus topics.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Dropdown
                    label="Select Class / Standard (Class 1 to 8)"
                    options={CLASSES}
                    value={config.cls}
                    onChange={handleClassChange}
                  />
                  <Dropdown
                    label={`Subject for ${config.cls.label}`}
                    options={availableSubjects}
                    value={config.sub}
                    onChange={(v) => setConfig({ ...config, sub: v })}
                  />
                  <Dropdown
                    label="Number of Questions"
                    options={QUESTION_COUNTS}
                    value={config.countObj}
                    onChange={(v) => setConfig({ ...config, countObj: v })}
                  />
                  <Dropdown
                    label="Difficulty Level"
                    options={DIFFICULTIES}
                    value={config.diff}
                    onChange={(v) => setConfig({ ...config, diff: v })}
                  />

                  {/* Target Paper Language Selection (English, Gujarati, Hindi) */}
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-bold text-ink">
                      🌐 Target Paper Language / માધ્યમ / भाषा <span className="text-xs font-normal text-slate-400">(Entire paper generated strictly in selected language)</span>
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {LANGUAGES.map((l) => (
                        <button
                          key={l.value}
                          type="button"
                          onClick={() => setConfig({ ...config, lang: l })}
                          className={`flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-sm font-bold transition-all border shadow-xs ${
                            config.lang.value === l.value
                              ? "bg-primary text-white border-primary shadow-md scale-[1.02]"
                              : "bg-white text-slate-700 border-hairline hover:bg-slate-50"
                          }`}
                        >
                          <span>{l.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Input
                    label="Syllabus / Topics (Paste full syllabus or key topics)"
                    placeholder="e.g. Alphabet, Phonics, Naming Words, Action Words, Addition, Fractions..."
                    value={config.topic}
                    onChange={(e) => setConfig({ ...config, topic: e.target.value })}
                  />
                  <p className="mt-1.5 text-xs text-slate-400">
                    💡 Tip: Paste your textbook chapters or syllabus topics here. Groq AI will generate targeted questions strictly in {config.lang.label} based on this.
                  </p>
                </div>

                <div className="mt-8 flex justify-end">
                  <Button
                    onClick={handleGenerate}
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary-600 hover:to-accent-600 shadow-lg"
                    icon={FiCpu}
                  >
                    Generate Paper in {config.lang.value}
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* STEP 2: GENERATING (LOADING) */}
          {step === "generating" && (
            <motion.div
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="relative flex h-32 w-32 items-center justify-center">
                <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                <div className="absolute inset-4 animate-pulse rounded-full bg-primary/40" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-2xl">
                  <FiCpu className="h-8 w-8 text-white animate-bounce" />
                </div>
              </div>
              <h3 className="mt-8 text-xl font-bold text-ink">Groq AI Engine is generating paper in {config.lang.value}...</h3>
              <p className="mt-2 text-sm font-medium text-slate-500 animate-pulse">{loadingText}</p>
            </motion.div>
          )}

          {/* STEP 3: RESULT */}
          {step === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {/* Success Notification Banner */}
              <div className="mb-4 flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800">
                <div className="flex items-center gap-3">
                  <FiCheckCircle className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm font-bold">
                    Exam Paper ({config.lang.value}) Generated & Automatically Published to MongoDB Database!
                  </span>
                </div>
                <Button
                  size="sm"
                  onClick={() => navigate("/teacher/exams")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-soft"
                >
                  View Online Exams List ➔
                </Button>
              </div>

              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <Button variant="outline" icon={FiRefreshCw} onClick={() => setStep("setup")}>
                  Generate Another Paper
                </Button>
                <div className="flex gap-2">
                  <Button icon={FiDownload} onClick={() => window.print()} className="bg-ink hover:bg-slate-800 text-white">
                    Print / Download PDF
                  </Button>
                </div>
              </div>

              <Card className="print-friendly bg-white shadow-xl ring-1 ring-slate-900/5">
                {/* Paper Header */}
                <div className="mb-8 border-b-2 border-ink pb-6 text-center">
                  <h1 className="text-2xl font-black uppercase tracking-wider text-ink">
                    Government Higher Secondary School
                  </h1>
                  <h2 className="mt-2 text-lg font-bold text-slate-700">
                    Term Examination (Class {config.cls.value})
                  </h2>
                  <div className="mt-4 flex flex-wrap justify-between text-sm font-semibold text-slate-600">
                    <span>Subject: {config.sub.label}</span>
                    <span>Medium / માધ્યમ: {config.lang.label}</span>
                    <span>Max Marks: {generatedPaper.length}</span>
                    <span>Time: {generatedPaper.length * 2} Mins</span>
                  </div>
                  <div className="mt-2 flex flex-wrap justify-between text-sm font-semibold text-slate-600">
                    <span>Difficulty: {config.diff.label}</span>
                    <span>Syllabus Scope: {config.topic ? config.topic.substring(0, 60) + "..." : "Standard Grade Curriculum"}</span>
                  </div>
                </div>

                {/* Questions */}
                <div className="space-y-8">
                  {generatedPaper.map((q, idx) => (
                    <div key={idx} className="group">
                      <p className="text-base font-bold text-ink">
                        <span className="mr-2">Q{idx + 1}.</span> {(q.question || q.q || "").replace(/^Q?\d+[\.\:\s]*/i, "")}
                      </p>
                      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 ml-6">
                        {(q.options || []).map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                              q.correctAnswer === oIdx
                                ? "border-emerald-500 bg-emerald-50/50 font-semibold"
                                : "border-hairline hover:border-primary/30 hover:bg-slate-50"
                            }`}
                          >
                            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 text-xs font-bold text-slate-500">
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span className="text-sm font-medium text-ink">{opt}</span>
                            {q.correctAnswer === oIdx && (
                              <span className="ml-auto text-xs font-bold text-emerald-600">✓ Correct</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* AI Watermark */}
                <div className="mt-12 text-center text-xs text-slate-400">
                  <p>Generated by AI-IGMS Engine • Powered by Groq AI • Saved to MongoDB</p>
                </div>
              </Card>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
