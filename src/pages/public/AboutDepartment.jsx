import { motion } from "framer-motion";
import {
  FiBookOpen,
  FiShield,
  FiAward,
  FiCheckCircle,
  FiUsers,
  FiArrowUpRight,
  FiGlobe,
  FiMapPin,
  FiFeather,
} from "react-icons/fi";

/**
 * About Department Public Page - School Education Department, Government of Gujarat
 */
export default function AboutDepartment() {
  const pillars = [
    {
      icon: FiBookOpen,
      title: "Quality Primary Education",
      desc: "Strengthening foundational literacy and numeracy (FLN) across all government primary schools.",
    },
    {
      icon: FiShield,
      title: "Transparent Digital Governance",
      desc: "Real-time tracking of attendance, marks, school performance, and resource distribution.",
    },
    {
      icon: FiUsers,
      title: "Teacher Empowerment & Training",
      desc: "Continuous professional development, AI-assisted question generators, and digital tools.",
    },
    {
      icon: FiAward,
      title: "Inclusive Student Welfare",
      desc: "Direct Benefit Transfer (DBT), scholarships, free uniforms, textbooks, and nutrition programs.",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full space-y-10 py-6"
    >
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-[#17395f] via-[#1e4a7a] to-blue-900 p-8 text-white shadow-lg sm:p-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-200 backdrop-blur-xs">
          <FiShield className="h-4 w-4 text-emerald-400" />
          Government of Gujarat Official Department Profile
        </div>

        <h1 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl xl:text-5xl">
          School Education Department
        </h1>
        <p className="mt-1 text-base font-semibold text-blue-200">
          શાળા શિક્ષણ વિભાગ • ગાંધીનગર, ગુજરાત
        </p>

        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-blue-100/90 sm:text-base">
          The School Education Department, Government of Gujarat, oversees primary, secondary, and higher secondary education across 33 districts. Through digital innovation, Mission Schools of Excellence, and AI-IGMS, we strive to provide equitable, tech-enabled, and high-quality learning environments.
        </p>
      </div>

      {/* Strategic Vision & Mission Pillars */}
      <div>
        <div className="mb-6 border-b border-slate-200 pb-3">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Institutional Directives
          </p>
          <h2 className="text-2xl font-extrabold text-[#17395f]">
            Core Department Pillars
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:border-blue-300 hover:shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700 mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-[#17395f] text-base">
                  {p.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Organizational Structure Info Box */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <h3 className="text-xl font-extrabold text-[#17395f] mb-3">
          Organizational Architecture & Reach
        </h3>
        <div className="grid gap-4 sm:grid-cols-4 text-center">
          <div className="rounded-xl bg-blue-50/70 p-4 border border-blue-100">
            <p className="text-3xl font-black text-blue-800">33</p>
            <p className="text-xs font-semibold text-slate-600 mt-1">Districts Managed</p>
          </div>
          <div className="rounded-xl bg-emerald-50/70 p-4 border border-emerald-100">
            <p className="text-3xl font-black text-emerald-800">54,000+</p>
            <p className="text-xs font-semibold text-slate-600 mt-1">Government Schools</p>
          </div>
          <div className="rounded-xl bg-orange-50/70 p-4 border border-orange-100">
            <p className="text-3xl font-black text-orange-800">2.5 Lakh+</p>
            <p className="text-xs font-semibold text-slate-600 mt-1">Faculty Teachers</p>
          </div>
          <div className="rounded-xl bg-purple-50/70 p-4 border border-purple-100">
            <p className="text-3xl font-black text-purple-800">1.1 Crore+</p>
            <p className="text-xs font-semibold text-slate-600 mt-1">Enrolled Students</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
