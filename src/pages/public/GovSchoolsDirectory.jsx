import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FiHome,
  FiMapPin,
  FiSearch,
  FiFilter,
  FiUsers,
  FiBookOpen,
  FiCheckCircle,
  FiShield,
} from "react-icons/fi";

/**
 * Public Government Schools Directory Page
 */
export default function GovSchoolsDirectory() {
  const [districtFilter, setDistrictFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const schools = [
    {
      id: "SCH-101",
      name: "Govt. Primary & Model School No. 1",
      district: "Gandhinagar",
      address: "Sector 17, Near Circuit House, Gandhinagar",
      category: "Primary & Upper Primary (Std 1-8)",
      code: "GUJ-330101",
      students: 480,
      teachers: 18,
      status: "Model School",
      facilities: ["Computer Lab", "PM POSHAN Kitchen", "Smart Classroom", "Playground"],
    },
    {
      id: "SCH-102",
      name: "Government Kanya Primary Vidyalaya",
      district: "Ahmedabad",
      address: "Navrangpura, Near Commerce College, Ahmedabad",
      category: "Girls Primary School (Std 1-8)",
      code: "GUJ-330204",
      students: 620,
      teachers: 24,
      status: "Excellence School",
      facilities: ["Science Lab", "Library", "Smart Classroom", "Biometric System"],
    },
    {
      id: "SCH-103",
      name: "Government Primary School - District Hub",
      district: "Rajkot",
      address: "Kalawad Road, Rajkot",
      category: "Primary School (Std 1-8)",
      code: "GUJ-330310",
      students: 540,
      teachers: 20,
      status: "Model School",
      facilities: ["Digital Library", "Sports Field", "Clean Water System"],
    },
    {
      id: "SCH-104",
      name: "Govt. Higher Secondary & Model School",
      district: "Surat",
      address: "Adajan, Near Riverfront, Surat",
      category: "Primary & Secondary (Std 1-8)",
      code: "GUJ-330422",
      students: 750,
      teachers: 28,
      status: "Excellence School",
      facilities: ["Robotics Lab", "Smart Classrooms", "Auditorium"],
    },
    {
      id: "SCH-105",
      name: "Government Primary Ashram School",
      district: "Vadodara",
      address: "Sayajiganj, Vadodara",
      category: "Primary School (Std 1-8)",
      code: "GUJ-330515",
      students: 410,
      teachers: 16,
      status: "Model School",
      facilities: ["Hostel", "Solar Power", "PM POSHAN Meal Hall"],
    },
  ];

  const districts = ["Gandhinagar", "Ahmedabad", "Rajkot", "Surat", "Vadodara"];

  const filteredSchools = useMemo(() => {
    return schools.filter((s) => {
      const matchesDistrict = districtFilter === "all" || s.district === districtFilter;
      const matchesQuery =
        searchQuery === "" ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDistrict && matchesQuery;
    });
  }, [districtFilter, searchQuery]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full space-y-8 py-6"
    >
      {/* Banner */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-[#17395f] via-[#1e4674] to-blue-900 p-8 text-white shadow-lg sm:p-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-200 backdrop-blur-xs">
          <FiHome className="h-4 w-4 text-emerald-400" />
          Government Schools Network Directory
        </div>

        <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">
          Gujarat Government Schools Directory
        </h1>
        <p className="mt-2 text-sm text-blue-200">
          ગુજરાત રાજ્ય સરકારી શાળાઓની યાદી
        </p>
        <p className="mt-4 max-w-3xl text-sm text-blue-100/90 leading-relaxed">
          Search and explore official government primary and model schools across Gujarat connected through the AI-IGMS digital school network.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search school name, district, location..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-600 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-3">
          <FiFilter className="h-4 w-4 text-slate-400" />
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-[#17395f] outline-none"
          >
            <option value="all">All Districts (33 Districts)</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d} District
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Schools Directory Grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {filteredSchools.map((s) => (
          <div
            key={s.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:border-blue-300 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700 border border-blue-200">
                  {s.district} District
                </span>
                <h3 className="mt-2.5 text-lg font-bold text-[#17395f]">
                  {s.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <FiMapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  {s.address}
                </p>
              </div>
              <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                {s.status}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 text-center border border-slate-100">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Enrolled Students</p>
                <p className="text-base font-extrabold text-[#17395f]">{s.students}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Faculty Teachers</p>
                <p className="text-base font-extrabold text-[#17395f]">{s.teachers}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <p className="text-[11px] font-bold text-slate-500 mb-2">School Facilities:</p>
              <div className="flex flex-wrap gap-1.5">
                {s.facilities.map((f, i) => (
                  <span
                    key={i}
                    className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
