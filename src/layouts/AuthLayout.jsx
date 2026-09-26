import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBookOpen,
  FiUsers,
  FiClipboard,
  FiBell,
  FiArrowUpRight,
  FiShield,
  FiPhone,
  FiHelpCircle,
  FiDownload,
  FiHome,
  FiCalendar,
  FiBarChart2,
  FiFileText,
  FiCheckCircle,
  FiArrowDown,
  FiLock,
  FiVolume2,
  FiX,
  FiGlobe,
  FiPrinter,
  FiMail,
} from "react-icons/fi";
import { APP } from "../constants/app";

/**
 * Government of Gujarat School Education Department Portal Layout
 * Features:
 * - Interactive Accessibility & Language Top Bar
 * - Fully Interactive User Manual & System Guide Modal with PDF/Text Download
 * - Interactive Help & Support, Helpline, and Email Contact triggers
 */

const TRANSLATIONS = {
  en: {
    govName: "Government of Gujarat",
    govNameGuj: "ગુજરાત સરકાર",
    deptTitle: "School Education Department",
    deptSub: "Government School Portal",
    skipToMain: "Skip to main content",
    screenReader: "Screen Reader Access",
    home: "Home",
    about: "About Department",
    services: "Services",
    schools: "Schools",
    contact: "Contact",
    securePortal: "Secure Government Portal",
    systemBadge: "Integrated Government School Management System",
    heroHeading: "Digital education",
    heroHeadingSub: "for every school in Gujarat.",
    heroDesc: "A unified digital platform for government school administration, students, teachers, attendance, academics, notices and parent communication.",
    students: "Students",
    teachers: "Teachers",
    academics: "Academics",
    notices: "Notices",
    management: "Management",
    administration: "Administration",
    communication: "& Communication",
    exploreEcosystem: "Explore the school ecosystem",
    userManualTitle: "User Manual & Download Guide",
    helpTitle: "Help & Support",
  },
  gu: {
    govName: "ગુજરાત સરકાર",
    govNameGuj: "Government of Gujarat",
    deptTitle: "શાળા શિક્ષણ વિભાગ",
    deptSub: "સરકારી શાળા પોર્ટલ",
    skipToMain: "મુખ્ય વિષયવસ્તુ પર જાઓ",
    screenReader: "સ્ક્રીન રીડર એક્સેસ",
    home: "મુખ્ય પૃષ્ઠ",
    about: "વિભાગ વિશે",
    services: "સેવાઓ",
    schools: "શાળાઓ",
    contact: "સંપર્ક",
    securePortal: "સુરક્ષિત સરકારી પોર્ટલ",
    systemBadge: "એકીકૃત સરકારી શાળા વ્યવસ્થાપન પ્રણાલી",
    heroHeading: "ડિજિટલ શિક્ષણ",
    heroHeadingSub: "ગુજરાતની દરેક શાળા માટે.",
    heroDesc: "સરકારી શાળા વહીવટ, વિદ્યાર્થીઓ, શિક્ષકો, હાજરી, શિક્ષણ, નોટિસ અને વાલીઓના સંચાર માટેનું એકીકૃત ડિજિટલ પ્લેટફોર્મ.",
    students: "વિદ્યાર્થીઓ",
    teachers: "શિક્ષકો",
    academics: "શિક્ષણ સંચાલન",
    notices: "સૂચનાઓ",
    management: "વ્યવસ્થાપન",
    administration: "વહીવટ",
    communication: "અને સંચાર",
    exploreEcosystem: "શાળા ઇકોસિસ્ટમ જુઓ",
    userManualTitle: "વપરાશકર્તા માર્ગદર્શિકા અને ડાઉનલોડ ગાઇડ",
    helpTitle: "મદદ અને સપોર્ટ",
  },
};

export default function AuthLayout() {
  const location = useLocation();
  const [lang, setLang] = useState("en");
  const [fontScale, setFontScale] = useState(1);
  const [screenReaderOpen, setScreenReaderOpen] = useState(false);
  const [userManualOpen, setUserManualOpen] = useState(false);
  const [contactNotice, setContactNotice] = useState(null);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const isPathActive = (path) => {
    if (path === "/login") return location.pathname === "/login" || location.pathname === "/";
    return location.pathname === path;
  };

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale * 100}%`;
    return () => {
      document.documentElement.style.fontSize = "100%";
    };
  }, [fontScale]);

  const handleSkipToMain = (e) => {
    e.preventDefault();
    const loginInput =
      document.querySelector('input[name="email"]') ||
      document.getElementById("home");
    if (loginInput) {
      loginInput.scrollIntoView({ behavior: "smooth", block: "center" });
      loginInput.focus();
    }
  };

  const handleScreenReader = () => {
    setScreenReaderOpen(true);
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const text =
        lang === "gu"
          ? "ગુજરાત સરકાર શાળા શિક્ષણ વિભાગ ડિજિટલ પોર્ટલ. સ્ક્રીન રીડર એક્સેસિબિલિટી ચાલુ છે."
          : "Government of Gujarat School Education Department Portal. Screen reader accessibility mode active.";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Download System User Manual File Function
  const handleDownloadManualFile = () => {
    const content = `========================================================================
AI-IGMS: INTEGRATED GOVERNMENT SCHOOL MANAGEMENT SYSTEM
OFFICIAL SYSTEM USER MANUAL & DOWNLOAD GUIDE (ACADEMIC YEAR 2025-26)
GOVERNMENT OF GUJARAT - SCHOOL EDUCATION DEPARTMENT
========================================================================

1. OVERVIEW
------------------------------------------------------------------------
AI-IGMS is a unified digital operating platform developed for public 
school education across Gujarat. It connects 5 distinct user roles:
- Super Admin (Directorate of Education Level)
- Principal (School Level Administrator)
- Teacher (Faculty Portal)
- Student (Classroom Portal)
- Parent / Guardian (Child Progress Portal)

2. USER ROLES & PERMISSIONS GUIDELINES
------------------------------------------------------------------------
A) SUPER ADMIN:
   - Provision new schools and assign unique School IDs.
   - Create initial Principal credentials and perform system audits.

B) PRINCIPAL:
   - Manage Student enrollment for Std 1 to Std 8.
   - Manage Faculty Teachers and Department assignments.
   - Link Parent profiles to student records.
   - Filter records by Standard (Std 1-8), Division (A-D), Gender & Status.
   - Export currently filtered dataset to CSV/Excel format.

C) TEACHER:
   - Mark daily student attendance.
   - Upload term-wise examination marks.
   - Generate AI question papers.
   - Apply for leave and view timetables.

D) STUDENT & PARENT:
   - View attendance history and academic score cards.
   - View school notice board announcements.

3. LOGIN INSTRUCTIONS
------------------------------------------------------------------------
1) Open http://localhost:3000/login
2) Select your assigned role tab (Super Admin / Principal / Teacher / Student / Parent).
3) Click "Auto-fill" demo button or enter official email & password.
4) Click "Sign In" to open your customized role dashboard.

4. TECHNICAL SUPPORT & HELPLINE
------------------------------------------------------------------------
Toll-Free Helpline: 079-232-12345
Support Email: support@igms.gov.in
Official Portal: Directorate of School Education, Gandhinagar, Gujarat.
========================================================================`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "AI_IGMS_Government_School_User_Manual_Guide.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const highlights = [
    {
      icon: FiUsers,
      title: t.students,
      subtitle: t.management,
      bg: "bg-blue-50",
      color: "text-blue-600",
    },
    {
      icon: FiBookOpen,
      title: t.teachers,
      subtitle: t.management,
      bg: "bg-emerald-50",
      color: "text-emerald-600",
    },
    {
      icon: FiClipboard,
      title: t.academics,
      subtitle: t.administration,
      bg: "bg-orange-50",
      color: "text-orange-600",
    },
    {
      icon: FiBell,
      title: t.notices,
      subtitle: t.communication,
      bg: "bg-indigo-50",
      color: "text-indigo-600",
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f8fafc] text-[#142d4f]">
      {/* Background Overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.035]"
          style={{
            backgroundImage: "url('/images/ashok_stambh.avif')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/95 to-[#f5f9ff]" />
        <div className="absolute -left-40 top-[20%] h-[420px] w-[420px] rounded-full bg-blue-100/30 blur-3xl" />
        <div className="absolute -right-40 top-[45%] h-[500px] w-[500px] rounded-full bg-emerald-100/20 blur-3xl" />
        <div className="absolute left-[40%] bottom-0 h-[400px] w-[400px] rounded-full bg-orange-100/20 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* =======================================================
            GOVERNMENT TOP BAR
        ======================================================= */}
        <div className="bg-[#12385f] text-white">
          <div className="mx-auto flex h-9 max-w-[1500px] items-center justify-between px-5 text-[11px] lg:px-10">
            <div className="flex items-center gap-3">
              <span className="font-semibold">{t.govNameGuj}</span>
              <span className="opacity-40">|</span>
              <span>{t.govName}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSkipToMain}
                className="hover:underline hover:text-blue-200 transition focus:outline-none"
              >
                {t.skipToMain}
              </button>

              <span className="opacity-40 hidden md:inline">|</span>

              <button
                onClick={handleScreenReader}
                className="hidden md:inline-flex items-center gap-1 hover:text-blue-200 hover:underline transition focus:outline-none"
              >
                <FiVolume2 className="h-3 w-3 text-emerald-400" />
                {t.screenReader}
              </button>

              <span className="opacity-40">|</span>

              <div className="flex items-center gap-1 font-bold">
                <button
                  onClick={() => setFontScale(0.92)}
                  title="Decrease font size"
                  className={`px-1.5 py-0.5 rounded transition ${
                    fontScale === 0.92
                      ? "bg-white/20 text-white font-extrabold"
                      : "opacity-80 hover:opacity-100"
                  }`}
                >
                  A-
                </button>
                <button
                  onClick={() => setFontScale(1)}
                  title="Reset font size"
                  className={`px-1.5 py-0.5 rounded transition ${
                    fontScale === 1
                      ? "bg-white/20 text-white font-extrabold"
                      : "opacity-80 hover:opacity-100"
                  }`}
                >
                  A
                </button>
                <button
                  onClick={() => setFontScale(1.08)}
                  title="Increase font size"
                  className={`px-1.5 py-0.5 rounded transition ${
                    fontScale === 1.08
                      ? "bg-white/20 text-white font-extrabold"
                      : "opacity-80 hover:opacity-100"
                  }`}
                >
                  A+
                </button>
              </div>

              <span className="opacity-40">|</span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setLang("en")}
                  className={`flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] transition ${
                    lang === "en"
                      ? "bg-white text-[#12385f] font-bold shadow-xs"
                      : "opacity-80 hover:opacity-100 hover:text-blue-200"
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLang("gu")}
                  className={`flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] transition ${
                    lang === "gu"
                      ? "bg-white text-[#12385f] font-bold shadow-xs"
                      : "opacity-80 hover:opacity-100 hover:text-blue-200"
                  }`}
                >
                  ગુજરાતી
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =======================================================
            GOVERNMENT HEADER
        ======================================================= */}
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
          <div className="mx-auto flex min-h-[88px] max-w-[1500px] items-center justify-between px-5 lg:px-10">
            <div className="flex items-center gap-4">
              <div className="flex h-[84px] w-[88px] items-center justify-center border-r border-slate-200 pr-5">
                <img
                  src="/images/ashok_stambh.avif"
                  alt="State Emblem of India"
                  className="h-[78px] w-auto object-contain"
                />
              </div>

              <div>
                <p className="text-[10px] font-bold tracking-[0.25em] text-slate-500">
                  {t.govName.toUpperCase()}
                </p>
                <h1 className="mt-1 text-xl font-extrabold text-[#17395f] sm:text-2xl">
                  {t.deptTitle}
                </h1>
                <p className="text-xs text-slate-500 sm:text-sm font-semibold">
                  {t.deptSub}
                </p>
              </div>
            </div>

            <nav className="hidden items-center gap-7 lg:flex">
              <Link
                to="/login"
                className={`text-sm font-semibold transition pb-1 ${
                  isPathActive("/login")
                    ? "text-blue-700 font-bold border-b-2 border-blue-600"
                    : "text-[#17395f] hover:text-blue-600"
                }`}
              >
                {t.home}
              </Link>

              <Link
                to="/about-department"
                className={`text-sm font-semibold transition pb-1 ${
                  isPathActive("/about-department")
                    ? "text-blue-700 font-bold border-b-2 border-blue-600"
                    : "text-[#17395f] hover:text-blue-600"
                }`}
              >
                {t.about}
              </Link>

              <Link
                to="/services"
                className={`text-sm font-semibold transition pb-1 ${
                  isPathActive("/services")
                    ? "text-blue-700 font-bold border-b-2 border-blue-600"
                    : "text-[#17395f] hover:text-blue-600"
                }`}
              >
                {t.services}
              </Link>

              <Link
                to="/schools-directory"
                className={`text-sm font-semibold transition pb-1 ${
                  isPathActive("/schools-directory")
                    ? "text-blue-700 font-bold border-b-2 border-blue-600"
                    : "text-[#17395f] hover:text-blue-600"
                }`}
              >
                {t.schools}
              </Link>

              <Link
                to="/contact-us"
                className={`text-sm font-semibold transition pb-1 ${
                  isPathActive("/contact-us")
                    ? "text-blue-700 font-bold border-b-2 border-blue-600"
                    : "text-[#17395f] hover:text-blue-600"
                }`}
              >
                {t.contact}
              </Link>

              <div className="flex items-center gap-2 rounded-full border border-emerald-400 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700">
                <FiLock className="h-4 w-4 text-emerald-600" />
                {t.securePortal}
              </div>
            </nav>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main>
          {location.pathname === "/login" || location.pathname === "/" ? (
            <>
              <section id="home" className="relative overflow-hidden">
                <div className="pointer-events-none absolute right-0 top-0 h-full w-[45%] bg-gradient-to-l from-blue-50/60 to-transparent" />
                <div className="pointer-events-none absolute right-[34%] top-20 h-[430px] w-[430px] rounded-full border border-blue-100/70" />
                <div className="pointer-events-none absolute right-[35%] top-28 h-[410px] w-[410px] rounded-full border border-blue-100/50" />

                <div className="mx-auto grid min-h-[calc(100vh-120px)] max-w-[1500px] items-start gap-8 px-5 pb-6 pt-4 lg:grid-cols-[1fr_480px] lg:px-10 lg:pt-6">
                  {/* Left Side */}
                  <motion.div
                    initial={{ opacity: 0, x: -25 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.55 }}
                    className="relative"
                  >
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#edf4fc] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#54708f]">
                      <FiBookOpen className="h-4 w-4 text-blue-600" />
                      {t.systemBadge}
                    </div>

                    <h2 className="max-w-[820px] text-[38px] font-extrabold leading-[1.05] tracking-tight text-[#142f52] sm:text-[46px] xl:text-[52px]">
                      {t.heroHeading}
                      <span className="block text-[#1769e8]">
                        {t.heroHeadingSub}
                      </span>
                    </h2>

                    <p className="mt-4 max-w-[720px] text-[15px] leading-7 text-slate-600 sm:text-base">
                      {t.heroDesc}
                    </p>

                    <div
                      id="services"
                      className="mt-6 grid max-w-[800px] grid-cols-2 gap-4 sm:grid-cols-4"
                    >
                      {highlights.map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.4,
                              delay: index * 0.08,
                            }}
                            className="text-center"
                          >
                            <div
                              className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl ${item.bg}`}
                            >
                              <Icon className={`h-5 w-5 ${item.color}`} />
                            </div>
                            <p className="mt-2 text-xs font-bold text-[#17395f] sm:text-sm">
                              {item.title}
                            </p>
                            <p className="text-xs font-semibold text-slate-500 sm:text-sm">
                              {item.subtitle}
                            </p>
                          </motion.div>
                        );
                      })}
                    </div>

                    <div className="mt-6">
                      <div className="mb-2.5 flex items-center gap-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                          Government Leadership
                        </p>
                        <div className="h-px flex-1 bg-slate-200" />
                      </div>

                      <div className="grid max-w-[850px] grid-cols-1 gap-3 sm:grid-cols-3">
                        <LeaderCard
                          image="/images/pm-modi.png"
                          name="Shri Narendra Modi"
                          position="Hon'ble Prime Minister of India"
                        />
                        <LeaderCard
                          image="/images/Cm-bhupendra.jpg"
                          name="Shri Bhupendra Patel"
                          position="Hon'ble Chief Minister of Gujarat"
                        />
                        <LeaderCard
                          image="/images/kuber-dindor.jpg"
                          name="Dr. Kuberbhai Dindor"
                          position="Education Leadership, Gujarat"
                        />
                      </div>
                    </div>

                    <Link
                      to="/about-department"
                      className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-blue-600 transition hover:text-blue-800"
                    >
                      {t.exploreEcosystem}
                      <FiArrowDown className="h-4 w-4 animate-bounce" />
                    </Link>
                  </motion.div>

                  {/* Login Panel */}
                  <motion.div
                    initial={{ opacity: 0, x: 25 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.55 }}
                    className="relative lg:sticky lg:top-28 z-20"
                  >
                    <div className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-[0_15px_45px_rgba(20,45,79,0.1)] sm:p-6">
                      <Outlet />
                    </div>

                    <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50/70 px-3.5 py-2">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#12385f] text-emerald-600 shadow-sm">
                        <FiShield className="h-3.5 w-3.5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-emerald-800 leading-tight">
                          Government Portal Access
                        </p>
                        <p className="text-[10px] text-emerald-700">
                          Secure role-based authentication for school users.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </section>

              {/* About Section */}
              <section id="about" className="relative border-t border-slate-200 bg-white/95">
                <div className="mx-auto max-w-[1500px] px-5 py-20 lg:px-10">
                  <div className="max-w-3xl">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-600">
                      Government School Digital Ecosystem
                    </p>
                    <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-[#142f52] sm:text-5xl">
                      One platform.
                      <span className="block text-blue-600">
                        Every school function.
                      </span>
                    </h2>
                    <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
                      AI-IGMS brings the everyday operations of a government
                      school into one structured digital environment, connecting
                      administrators, principals, teachers, students and parents.
                    </p>
                  </div>

                  <div id="schools" className="mt-14 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
                    <motion.div
                      initial={{ opacity: 0, x: -25 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      className="relative"
                    >
                      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl">
                        <img
                          src="/images/government-school.png"
                          alt="Government school campus"
                          className="h-[390px] w-full object-cover"
                        />
                      </div>
                      <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/80 bg-white/95 p-4 shadow-lg backdrop-blur">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <FiHome className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#17395f]">
                              Government School Network
                            </p>
                            <p className="text-xs text-slate-500">
                              Connected through AI-IGMS
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    <div>
                      <p className="text-sm font-bold text-[#17395f]">
                        Built around the people who run a school
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        Each role gets access to the information and workflows
                        relevant to its responsibilities.
                      </p>
                      <div className="mt-7 space-y-4">
                        <EcosystemItem
                          icon={FiShield}
                          title="Principal"
                          text="Manage school administration, staff, academic records and institutional activities."
                        />
                        <EcosystemItem
                          icon={FiBookOpen}
                          title="Teacher"
                          text="Handle attendance, marks, timetable, notices and classroom activities."
                        />
                        <EcosystemItem
                          icon={FiUsers}
                          title="Student"
                          text="Access academic information, attendance, notices and school activities."
                        />
                        <EcosystemItem
                          icon={FiUsers}
                          title="Parent"
                          text="Stay connected with attendance, academic progress and school communication."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </>
          ) : (
            <div className="mx-auto max-w-[1500px] min-h-[calc(100vh-220px)] px-5 py-6 lg:px-10">
              <Outlet />
            </div>
          )}

          {/* Fully Interactive Footer */}
          <footer id="contact" className="border-t border-slate-200 bg-white">
            <div className="mx-auto flex max-w-[1500px] flex-col gap-7 px-5 py-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
              <div className="flex flex-wrap gap-x-8 gap-y-4">
                {/* User Manual & Download Guide */}
                <button
                  onClick={() => setUserManualOpen(true)}
                  className="flex items-center gap-3 rounded-xl p-2 text-left hover:bg-slate-50 transition border border-transparent hover:border-slate-200 cursor-pointer"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-[#17395f] shadow-xs">
                    <FiDownload className="h-5 w-5 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#17395f]">
                      User Manual
                    </p>
                    <p className="text-xs text-blue-600 font-semibold flex items-center gap-1">
                      Download Guide <FiArrowUpRight className="h-3 w-3" />
                    </p>
                  </div>
                </button>

                {/* Help & Support */}
                <button
                  onClick={() => setContactNotice("help")}
                  className="flex items-center gap-3 rounded-xl p-2 text-left hover:bg-slate-50 transition border border-transparent hover:border-slate-200 cursor-pointer"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 shadow-xs">
                    <FiHelpCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#17395f]">
                      Help & Support
                    </p>
                    <p className="text-xs text-slate-500">Get Assistance</p>
                  </div>
                </button>

                {/* Helpline */}
                <button
                  onClick={() => setContactNotice("phone")}
                  className="flex items-center gap-3 rounded-xl p-2 text-left hover:bg-slate-50 transition border border-transparent hover:border-slate-200 cursor-pointer"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-orange-700 shadow-xs">
                    <FiPhone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#17395f]">
                      Helpline
                    </p>
                    <p className="text-xs font-mono font-bold text-slate-600">079-232-12345</p>
                  </div>
                </button>

                {/* Email Support */}
                <button
                  onClick={() => setContactNotice("email")}
                  className="flex items-center gap-3 rounded-xl p-2 text-left hover:bg-slate-50 transition border border-transparent hover:border-slate-200 cursor-pointer"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-700 shadow-xs">
                    <FiMail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#17395f]">
                      Email Support
                    </p>
                    <p className="text-xs font-medium text-slate-600">support@igms.gov.in</p>
                  </div>
                </button>
              </div>

              <div className="text-left lg:text-right">
                <p className="text-sm font-bold text-[#17395f]">
                  {t.govNameGuj}
                </p>
                <p className="text-xs text-slate-400">{t.govName}</p>
                <p className="mt-1 text-[10px] text-slate-400">
                  © {new Date().getFullYear()} {APP.org}
                </p>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* Screen Reader Dialog Modal */}
      <AnimatePresence>
        {screenReaderOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5 text-[#12385f]">
                  <FiVolume2 className="h-5 w-5 text-emerald-600" />
                  <h3 className="font-extrabold text-base">{t.screenReader}</h3>
                </div>
                <button
                  onClick={() => setScreenReaderOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              <div className="py-4 text-sm text-slate-600 space-y-3">
                <p className="font-semibold text-slate-800">
                  W3C WCAG 2.1 AA Screen Reader Accessibility Active
                </p>
                <p>
                  This portal is optimized for screen readers including NVDA, JAWS, and VoiceOver. Voice synthesizer announcement has been triggered.
                </p>
                <div className="rounded-xl bg-blue-50 p-3 text-xs text-blue-900 font-medium">
                  Announcement: "Government of Gujarat School Education Department Portal. Screen reader accessibility mode active."
                </div>
              </div>

              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => setScreenReaderOpen(false)}
                  className="rounded-xl bg-[#12385f] px-4 py-2 text-xs font-bold text-white hover:bg-blue-900"
                >
                  Close Notification
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Official User Manual & Download Guide Modal */}
      <AnimatePresence>
        {userManualOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3 text-[#12385f]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <FiDownload className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg">
                      AI-IGMS User Manual & System Download Guide
                    </h3>
                    <p className="text-xs text-slate-500">
                      Academic Year 2025-26 • Directorate of School Education
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setUserManualOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              {/* Manual Content Scroll Container */}
              <div className="py-4 text-xs text-slate-600 space-y-4 overflow-y-auto pr-2 flex-1">
                <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3.5 text-blue-900">
                  <p className="font-bold text-sm mb-1">
                    Integrated Government School Management System (AI-IGMS)
                  </p>
                  <p>
                    This official manual outlines system operation, login procedures, role privileges, student enrollment (Std 1–8), examination grading, and automated report exports for school administrators and staff.
                  </p>
                </div>

                <div className="space-y-3 border-t border-slate-100 pt-3">
                  <h4 className="font-bold text-sm text-[#17395f]">
                    1. Role Access Summary
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong className="text-slate-800">Super Admin:</strong> System seeding, school provisioning, and principal assignment.</li>
                    <li><strong className="text-slate-800">Principal:</strong> Manage Students (Std 1-8), Faculty Teachers, Parents, Filter views, and CSV export datasets.</li>
                    <li><strong className="text-slate-800">Teacher:</strong> Attendance marking, term marks upload, AI question paper generator, and leave applications.</li>
                    <li><strong className="text-slate-800">Student & Parent:</strong> Academic result verification and attendance history.</li>
                  </ul>
                </div>

                <div className="space-y-3 border-t border-slate-100 pt-3">
                  <h4 className="font-bold text-sm text-[#17395f]">
                    2. Login & Credential Instructions
                  </h4>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Navigate to the official portal page <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-700">http://localhost:3000/login</code>.</li>
                    <li>Select your specific role pill (Super Admin, Principal, Teacher, Student, or Parent).</li>
                    <li>Use the "Auto-fill" button or enter your government email & password.</li>
                    <li>Click "Sign In" to proceed to your role dashboard.</li>
                  </ol>
                </div>

                <div className="space-y-3 border-t border-slate-100 pt-3">
                  <h4 className="font-bold text-sm text-[#17395f]">
                    3. Technical Helpline & Support
                  </h4>
                  <p>
                    For technical inquiries, password resets, or portal assistance, contact the Directorate Helpline at <strong className="text-slate-800">079-232-12345</strong> or email <strong className="text-slate-800">support@igms.gov.in</strong>.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">
                  File Format: Plain Text / PDF System Guide
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setUserManualOpen(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleDownloadManualFile}
                    className="flex items-center gap-2 rounded-xl bg-[#17395f] px-4 py-2 text-xs font-bold text-white hover:bg-blue-900 shadow-md"
                  >
                    <FiDownload className="h-4 w-4" />
                    Download System Guide (.txt)
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Help / Contact Notification Modal */}
      <AnimatePresence>
        {contactNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5 text-[#12385f]">
                  <FiHelpCircle className="h-5 w-5 text-blue-600" />
                  <h3 className="font-extrabold text-base">
                    {contactNotice === "help" ? "Help & Support Center" : contactNotice === "phone" ? "Government Helpline" : "Email Support"}
                  </h3>
                </div>
                <button
                  onClick={() => setContactNotice(null)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              <div className="py-4 text-xs text-slate-600 space-y-3">
                {contactNotice === "help" && (
                  <>
                    <p className="font-bold text-slate-800 text-sm">
                      Directorate of School Education Helpdesk
                    </p>
                    <p>
                      Our support team is available Monday through Saturday (9:00 AM to 6:00 PM) to assist with login issues, school provisioning, and portal access.
                    </p>
                    <div className="rounded-xl bg-blue-50 p-3 text-blue-900 font-medium space-y-1">
                      <p>• Toll-Free Helpline: <strong>079-232-12345</strong></p>
                      <p>• Official Support Email: <strong>support@igms.gov.in</strong></p>
                    </div>
                  </>
                )}

                {contactNotice === "phone" && (
                  <>
                    <p className="font-bold text-slate-800 text-sm">
                      Official Government Helpline Connected
                    </p>
                    <p>
                      Call Toll-Free <strong>079-232-12345</strong> for immediate assistance with school administration, teacher assignment, or student portal issues.
                    </p>
                  </>
                )}

                {contactNotice === "email" && (
                  <>
                    <p className="font-bold text-slate-800 text-sm">
                      Email Support Service
                    </p>
                    <p>
                      Send your inquiry or error report to <strong>support@igms.gov.in</strong>. Typical response time is within 24 hours.
                    </p>
                  </>
                )}
              </div>

              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => setContactNotice(null)}
                  className="rounded-xl bg-[#12385f] px-4 py-2 text-xs font-bold text-white hover:bg-blue-900"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LeaderCard({ image, name, position }) {
  return (
    <div className="group flex h-[105px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="flex w-[95px] shrink-0 items-end justify-center overflow-hidden bg-gradient-to-b from-slate-50 to-blue-50">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-contain object-bottom transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center px-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-xs font-extrabold text-[#17395f]">
              {name}
            </h3>
            <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-slate-500">
              {position}
            </p>
          </div>
          <FiArrowUpRight className="h-4 w-4 shrink-0 text-slate-300" />
        </div>
      </div>
    </div>
  );
}

function EcosystemItem({ icon: Icon, title, text }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-4 transition hover:border-blue-100 hover:shadow-sm">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="font-bold text-[#17395f]">{title}</p>
        <p className="mt-1 text-sm leading-6 text-slate-500">{text}</p>
      </div>
    </div>
  );
}