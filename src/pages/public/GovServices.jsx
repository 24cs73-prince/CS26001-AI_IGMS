import { motion } from "framer-motion";
import {
  FiBookOpen,
  FiAward,
  FiCpu,
  FiCalendar,
  FiCheckCircle,
  FiUsers,
  FiDownload,
  FiShield,
  FiArrowUpRight,
} from "react-icons/fi";

/**
 * Public Government Services Directory Page
 */
export default function GovServices() {
  const services = [
    {
      title: "Gyan Sadhana Scholarship Scheme",
      category: "Student Financial Aid",
      desc: "Financial assistance provided to meritorious students from Class 9 to 12 across government and grant-in-aid schools.",
      badge: "State Scholarship",
      icon: FiAward,
      color: "border-blue-200 bg-blue-50 text-blue-800",
    },
    {
      title: "PM POSHAN (Mid-Day Meal Program)",
      category: "Student Nutrition & Welfare",
      desc: "Daily hot cooked nutritious meals served to primary and upper primary government school children to ensure health & attendance.",
      badge: "Welfare Scheme",
      icon: FiUsers,
      color: "border-emerald-200 bg-emerald-50 text-emerald-800",
    },
    {
      title: "Shala Praveshotsav & Kanya Kelavani",
      category: "Enrollment Drive",
      desc: "Annual statewide mass enrollment drive encouraging 100% primary school enrollment and girl child education empowerment.",
      badge: "Annual Drive",
      icon: FiCalendar,
      color: "border-orange-200 bg-orange-50 text-orange-800",
    },
    {
      title: "AI Question Paper & Exam Generator",
      category: "Academic Assessment",
      desc: "AI-powered automated question paper synthesis tool aligned with Gujarat State Board curriculum for Std 1 to Std 8.",
      badge: "AI-IGMS Core Feature",
      icon: FiCpu,
      color: "border-purple-200 bg-purple-50 text-purple-800",
    },
    {
      title: "Mission Vidya Remedial Learning",
      category: "Quality Improvement",
      desc: "Special remedial classes and individualized learning plans for students needing additional support in reading, writing, and mathematics.",
      badge: "Learning Initiative",
      icon: FiBookOpen,
      color: "border-teal-200 bg-teal-50 text-teal-800",
    },
    {
      title: "Free Textbook & Uniform Distribution",
      category: "Student Supply Welfare",
      desc: "Free distribution of state-approved textbooks and school uniforms to all enrolled primary school students.",
      badge: "Annual Supply",
      icon: FiCheckCircle,
      color: "border-indigo-200 bg-indigo-50 text-indigo-800",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full space-y-8 py-6"
    >
      {/* Banner */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-[#17395f] via-[#1b436f] to-blue-900 p-8 text-white shadow-lg sm:p-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-200 backdrop-blur-xs">
          <FiCpu className="h-4 w-4 text-emerald-400" />
          Government Digital Education Services Directory
        </div>

        <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">
          School Digital Services & Welfare Schemes
        </h1>
        <p className="mt-2 text-sm text-blue-200">
          સરકારી શિક્ષણ સેવાઓ અને વિદ્યાર્થી કલ્યાણ યોજનાઓ
        </p>
        <p className="mt-4 max-w-3xl text-sm text-blue-100/90 leading-relaxed">
          Explore official services, scholarship schemes, academic evaluation tools, and student welfare initiatives provided by the School Education Department, Government of Gujarat.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${item.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-700">
                    {item.badge}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold text-[#17395f]">
                  {item.title}
                </h3>
                <p className="text-xs font-semibold text-blue-600 mt-0.5">
                  {item.category}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-slate-600">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-blue-700 font-bold">
                <span>Official Scheme Status: Active</span>
                <FiArrowUpRight className="h-4 w-4" />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
