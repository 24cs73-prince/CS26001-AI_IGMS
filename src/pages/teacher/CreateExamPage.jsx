import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheckCircle,
  FiCalendar,
  FiClock,
  FiFileText,
  FiSend,
  FiSave,
  FiCpu,
  FiBookOpen,
} from "react-icons/fi";

import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/ui/Card";
import { Button, Input, Dropdown, Modal } from "../../components/ui";
import { onlineExamService } from "../../services/onlineExamService";

// Class 1 to Class 8 as requested
const CLASSES = Array.from({ length: 8 }, (_, i) => ({
  value: String(i + 1),
  label: `Class ${i + 1}`,
}));

const SUBJECTS = [
  { value: "Science", label: "Science" },
  { value: "Mathematics", label: "Mathematics" },
  { value: "English", label: "English" },
  { value: "Social Science", label: "Social Science" },
  { value: "Hindi", label: "Hindi" },
  { value: "Computer Science", label: "Computer Science" },
];

export default function CreateExamPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "Class 5 Science - Term Exam 1",
    classVal: "5",
    subject: "Science",
    syllabus: "Chapters 1 to 3: Living Organisms, Plant Life & Human Body Basics",
    duration: "30 minutes",
    durationMinutes: 30,
    totalQuestions: 10,
    totalMarks: 10,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 86400000 * 5).toISOString().split("T")[0],
  });

  const [generating, setGenerating] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [createdExamId, setCreatedExamId] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleGenerateAndCreate = async (status = "Published") => {
    if (!formData.title.trim()) return;

    setGenerating(true);

    // AI Generation progress animation sequence (simulating Grok AI generation)
    const messages = [
      `Reading syllabus topics for Class ${formData.classVal} ${formData.subject}...`,
      `Initializing Grok AI Prompt Engine...`,
      `Generating ${formData.totalQuestions} curriculum-aligned MCQ questions...`,
      `Calculating distractor options & answer keys...`,
      `Finalizing online exam paper...`,
    ];

    let i = 0;
    setLoadingText(messages[0]);

    const interval = setInterval(() => {
      i++;
      if (i < messages.length) {
        setLoadingText(messages[i]);
      } else {
        clearInterval(interval);
      }
    }, 700);

    try {
      // Simulate API call + create exam in service
      setTimeout(async () => {
        const newExam = await onlineExamService.createExam({
          title: formData.title,
          class: formData.classVal,
          subject: formData.subject,
          syllabus: formData.syllabus,
          duration: formData.duration,
          durationMinutes: formData.durationMinutes,
          totalQuestions: formData.totalQuestions,
          totalMarks: formData.totalMarks,
          startDate: formData.startDate,
          endDate: formData.endDate,
          status: status,
        });

        setCreatedExamId(newExam.id);
        setGenerating(false);

        if (status === "Published") {
          setShowSuccessModal(true);
        } else {
          navigate("/teacher/exams");
        }
      }, 3500);
    } catch (err) {
      console.error(err);
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Create AI Online Exam"
        description="Specify syllabus topics for Class 1 to 8 to generate an online MCQ test using AI."
        breadcrumbs={[
          { label: "Online Exams", to: "/teacher/exams" },
          { label: "Create Exam" },
        ]}
      />

      <AnimatePresence mode="wait">
        {/* STEP 1: FORM DISPLAY */}
        {!generating ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <Card className="border border-hairline shadow-soft space-y-6">
              <div className="border-b border-hairline pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-ink">Exam & Syllabus Details</h2>
                  <p className="text-sm text-slate-500">
                    Provide class, subject, and syllabus topics. AI will generate questions accordingly.
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FiCpu className="h-5 w-5" />
                </div>
              </div>

              <div className="space-y-6">
                {/* Exam Title */}
                <div>
                  <Input
                    label="Exam Name / Title"
                    placeholder="e.g. Class 5 Science - Unit Test 1"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                {/* Grid 2 Cols: Class (1 to 8) & Subject */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Dropdown
                    label="Select Standard / Class (Class 1 to 8)"
                    options={CLASSES}
                    value={CLASSES.find((c) => c.value === formData.classVal) || CLASSES[4]}
                    onChange={(opt) =>
                      setFormData({
                        ...formData,
                        classVal: opt.value,
                        title: `Class ${opt.value} ${formData.subject} - Unit Test`,
                      })
                    }
                  />

                  <Dropdown
                    label="Subject"
                    options={SUBJECTS}
                    value={SUBJECTS.find((s) => s.value === formData.subject) || SUBJECTS[0]}
                    onChange={(opt) =>
                      setFormData({
                        ...formData,
                        subject: opt.value,
                        title: `Class ${formData.classVal} ${opt.value} - Unit Test`,
                      })
                    }
                  />
                </div>

                {/* Syllabus / Topic Input Field */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <FiBookOpen className="h-4 w-4 text-primary" />
                    Syllabus / Topics (AI Input Context)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter chapters or specific topics, e.g. Light, Shadows and Reflections, Electricity and Circuits..."
                    value={formData.syllabus}
                    onChange={(e) => setFormData({ ...formData, syllabus: e.target.value })}
                    className="w-full rounded-xl border border-hairline bg-white p-3 text-sm text-ink placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    ⚡ Note: Grok AI will generate questions strictly covering this syllabus.
                  </span>
                </div>

                {/* Grid 3 Cols: Questions, Marks, Duration */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Input
                    label="Total Questions"
                    type="number"
                    value={formData.totalQuestions}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        totalQuestions: e.target.value,
                        totalMarks: e.target.value,
                      })
                    }
                  />

                  <Input
                    label="Total Marks"
                    type="number"
                    value={formData.totalMarks}
                    onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                  />

                  <Input
                    label="Duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                </div>

                {/* Start Date & End Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    type="date"
                    label="Start Date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                  <Input
                    type="date"
                    label="End Date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-hairline pt-6">
                <Button
                  variant="outline"
                  icon={FiSave}
                  onClick={() => handleGenerateAndCreate("Draft")}
                >
                  Save as Draft
                </Button>

                <Button
                  icon={FiCpu}
                  onClick={() => handleGenerateAndCreate("Published")}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary-600 hover:to-accent-600 text-white shadow-soft"
                >
                  ✨ Generate Paper with AI & Publish Exam
                </Button>
              </div>
            </Card>
          </motion.div>
        ) : (
          /* STEP 2: AI GENERATION LOADING ANIMATION */
          <motion.div
            key="generating"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-hairline shadow-xl p-8"
          >
            <div className="relative flex h-32 w-32 items-center justify-center">
              <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
              <div className="absolute inset-4 animate-pulse rounded-full bg-primary/40" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-2xl">
                <FiCpu className="h-8 w-8 text-white animate-spin" />
              </div>
            </div>

            <h3 className="mt-8 text-xl font-bold text-ink">AI Engine is Generating Exam Paper...</h3>
            <p className="mt-2 text-sm font-semibold text-primary animate-pulse">{loadingText}</p>
            <span className="mt-4 text-xs font-medium text-slate-400">
              [Future Grok AI API Call: <code className="text-slate-600">POST https://api.x.ai/v1/chat/completions</code>]
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <Modal
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Exam Published Successfully"
      >
        <div className="text-center py-4 space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mx-auto">
            <FiCheckCircle className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-ink">Exam & AI Paper Generated Successfully</h3>
            <p className="text-sm text-slate-500 mt-1">
              Class {formData.classVal} students can now attempt this examination online.
            </p>
          </div>
          <div className="pt-4 flex justify-center">
            <Button
              onClick={() => {
                setShowSuccessModal(false);
                navigate(`/teacher/exams/${createdExamId}`);
              }}
              className="bg-primary hover:bg-primary-600 shadow-soft"
            >
              View Exam & Questions
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
