import { useState } from "react";
import { FiCpu, FiSettings, FiDownload, FiCheck, FiRefreshCw } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/ui/Card";
import { Button, Input, Dropdown } from "../../components/ui";

// Mock data for generation
const SUBJECTS = [
  { value: "maths", label: "Mathematics" },
  { value: "science", label: "Science" },
  { value: "english", label: "English" },
  { value: "social", label: "Social Science" },
];

const CLASSES = Array.from({ length: 8 }, (_, i) => ({
  value: `class-${i + 1}`,
  label: `Class ${i + 1}`,
}));

const DIFFICULTIES = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const MOCK_PAPER = [
  {
    q: "What is the capital of India?",
    options: ["Mumbai", "New Delhi", "Kolkata", "Chennai"],
    ans: 1,
  },
  {
    q: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    ans: 1,
  },
  {
    q: "What is 15 × 8?",
    options: ["110", "120", "130", "140"],
    ans: 1,
  },
  {
    q: "Who wrote the national anthem of India?",
    options: ["Rabindranath Tagore", "Bankim Chandra Chatterjee", "Mahatma Gandhi", "Subhas Chandra Bose"],
    ans: 0,
  },
  {
    q: "What is the chemical symbol for water?",
    options: ["O2", "H2O", "CO2", "NaCl"],
    ans: 1,
  },
];

export default function AIPaperGenerator() {
  const [step, setStep] = useState("setup"); // setup -> generating -> result
  const [config, setConfig] = useState({
    cls: CLASSES[5],
    sub: SUBJECTS[1],
    diff: DIFFICULTIES[1],
    topic: "General Syllabus",
  });
  
  const [loadingText, setLoadingText] = useState("");

  const handleGenerate = () => {
    setStep("generating");
    
    // Fake AI loading sequence
    const messages = [
      "Analyzing syllabus requirements...",
      "Searching educational databanks...",
      "Generating age-appropriate questions...",
      "Balancing difficulty levels...",
      "Formatting final MCQ paper...",
    ];
    
    let i = 0;
    setLoadingText(messages[0]);
    
    const interval = setInterval(() => {
      i++;
      if (i < messages.length) {
        setLoadingText(messages[i]);
      } else {
        clearInterval(interval);
        setStep("result");
      }
    }, 800); // cycle every 800ms
  };

  return (
    <div>
      <PageHeader
        title="✨ AI Paper Generator"
        description="Instantly generate standard MCQ papers for Classes 1 to 8 using AI."
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
                    <h2 className="text-lg font-bold text-ink">Generation Parameters</h2>
                    <p className="text-sm text-slate-500">Define the scope of the exam paper.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Dropdown
                    label="Select Class (1 to 8)"
                    options={CLASSES}
                    value={config.cls}
                    onChange={(v) => setConfig({ ...config, cls: v })}
                  />
                  <Dropdown
                    label="Subject"
                    options={SUBJECTS}
                    value={config.sub}
                    onChange={(v) => setConfig({ ...config, sub: v })}
                  />
                  <Dropdown
                    label="Difficulty Level"
                    options={DIFFICULTIES}
                    value={config.diff}
                    onChange={(v) => setConfig({ ...config, diff: v })}
                  />
                  <Input
                    label="Specific Topic (Optional)"
                    placeholder="e.g. Fractions, Solar System"
                    value={config.topic}
                    onChange={(e) => setConfig({ ...config, topic: e.target.value })}
                  />
                </div>

                <div className="mt-8 flex justify-end">
                  <Button
                    onClick={handleGenerate}
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary-600 hover:to-accent-600 shadow-lg"
                    icon={FiCpu}
                  >
                    Generate Paper with AI
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
                {/* Glowing AI pulse effect */}
                <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                <div className="absolute inset-4 animate-pulse rounded-full bg-primary/40" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-2xl">
                  <FiCpu className="h-8 w-8 text-white animate-bounce" />
                </div>
              </div>
              <h3 className="mt-8 text-xl font-bold text-ink">AI Engine is Working...</h3>
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
              <div className="mb-4 flex items-center justify-between">
                <Button variant="outline" icon={FiRefreshCw} onClick={() => setStep("setup")}>
                  Generate Another
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" icon={FiCheck}>Save to Drive</Button>
                  <Button icon={FiDownload} className="bg-ink hover:bg-slate-800">Download PDF</Button>
                </div>
              </div>

              <Card className="print-friendly bg-white shadow-xl ring-1 ring-slate-900/5">
                {/* Paper Header */}
                <div className="mb-8 border-b-2 border-ink pb-6 text-center">
                  <h1 className="text-2xl font-black uppercase tracking-wider text-ink">
                    Government Higher Secondary School
                  </h1>
                  <h2 className="mt-2 text-lg font-bold text-slate-700">
                    Term Examination ({config.cls.label})
                  </h2>
                  <div className="mt-4 flex justify-between text-sm font-semibold text-slate-600">
                    <span>Subject: {config.sub.label}</span>
                    <span>Max Marks: 10</span>
                    <span>Time: 30 Mins</span>
                  </div>
                  <div className="mt-2 flex justify-between text-sm font-semibold text-slate-600">
                    <span>Difficulty: {config.diff.label}</span>
                    <span>Topic: {config.topic || "General"}</span>
                  </div>
                </div>

                {/* Questions */}
                <div className="space-y-8">
                  {MOCK_PAPER.map((q, idx) => (
                    <div key={idx} className="group">
                      <p className="text-base font-bold text-ink">
                        <span className="mr-2">Q{idx + 1}.</span> {q.q}
                      </p>
                      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 ml-6">
                        {q.options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className="flex items-center gap-3 rounded-lg border border-hairline p-3 transition-colors hover:border-primary/30 hover:bg-slate-50"
                          >
                            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 text-xs font-bold text-slate-500">
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span className="text-sm font-medium text-ink">{opt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* AI Watermark */}
                <div className="mt-12 text-center text-xs text-slate-400">
                  <p>Generated by AI-IGMS Engine v1.0 • Do not distribute without authorization</p>
                </div>
              </Card>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
