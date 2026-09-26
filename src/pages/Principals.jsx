import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUserCheck,
  FiPlus,
  FiSearch,
  FiHome,
  FiMail,
  FiPhone,
  FiLock,
  FiShield,
  FiMapPin,
  FiKey,
  FiCheckCircle,
  FiEdit,
  FiTrash2,
  FiX,
  FiRefreshCw,
} from "react-icons/fi";
import PageHeader from "../components/common/PageHeader";
import { Button, Card, Badge, Input, Dropdown } from "../components/ui";
import { useToast } from "../context/ToastContext";

const INITIAL_PRINCIPALS = [
  {
    id: "PRN-101",
    name: "Rohan Administrator",
    schoolName: "Government Higher Secondary School",
    district: "Gandhinagar",
    email: "principal@ghss.gandhinagar.igms.gov.in",
    phone: "+91 98765 43210",
    udise: "24070100101",
    status: "Active",
    appointedDate: "2024-06-15",
    studentsCount: 420,
    teachersCount: 18,
  },
  {
    id: "PRN-102",
    name: "Dr. Arvind Bhatt",
    schoolName: "Shri Sardar Patel Vidyalaya",
    district: "Ahmedabad",
    email: "principal@sardarpatel.ahmedabad.igms.gov.in",
    phone: "+91 98234 56789",
    udise: "24070200202",
    status: "Active",
    appointedDate: "2023-11-20",
    studentsCount: 580,
    teachersCount: 24,
  },
  {
    id: "PRN-103",
    name: "Smt. Shailaja Mehta",
    schoolName: "Model Residential Kanya Shala",
    district: "Vadodara",
    email: "principal@mrks.vadodara.igms.gov.in",
    phone: "+91 97123 45678",
    udise: "24190100303",
    status: "Active",
    appointedDate: "2024-01-10",
    studentsCount: 310,
    teachersCount: 14,
  },
  {
    id: "PRN-104",
    name: "Shri Dharmendra Trivedi",
    schoolName: "Navchetan Primary & Secondary School",
    district: "Rajkot",
    email: "principal@navchetan.rajkot.igms.gov.in",
    phone: "+91 99012 34567",
    udise: "24090100404",
    status: "Active",
    appointedDate: "2024-04-05",
    studentsCount: 390,
    teachersCount: 16,
  },
];

const DISTRICTS = [
  "All Districts",
  "Gandhinagar",
  "Ahmedabad",
  "Vadodara",
  "Rajkot",
  "Surat",
  "Bhavnagar",
];

export default function Principals() {
  const toast = useToast();
  const [principals, setPrincipals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrincipal, setEditingPrincipal] = useState(null);

  const [form, setForm] = useState({
    name: "",
    schoolName: "",
    district: "Gandhinagar",
    email: "",
    phone: "",
    password: "Principal@123",
    udise: "",
  });

  const loadPrincipals = () => {
    try {
      const stored = localStorage.getItem("igms.principals_roster");
      if (stored) {
        setPrincipals(JSON.parse(stored));
      } else {
        localStorage.setItem(
          "igms.principals_roster",
          JSON.stringify(INITIAL_PRINCIPALS)
        );
        setPrincipals(INITIAL_PRINCIPALS);
      }
    } catch (e) {
      setPrincipals(INITIAL_PRINCIPALS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrincipals();
  }, []);

  const handleSavePrincipal = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.schoolName.trim() || !form.email.trim()) {
      toast.error("Please fill in Principal Name, School, and Official Email.");
      return;
    }

    if (editingPrincipal) {
      const updated = principals.map((p) =>
        p.id === editingPrincipal.id
          ? {
              ...p,
              name: form.name,
              schoolName: form.schoolName,
              district: form.district,
              email: form.email,
              phone: form.phone || p.phone,
              udise: form.udise || p.udise,
            }
          : p
      );
      setPrincipals(updated);
      localStorage.setItem("igms.principals_roster", JSON.stringify(updated));
      toast.success(`Principal '${form.name}' updated successfully!`);
    } else {
      const newPrincipal = {
        id: `PRN-${Math.floor(100 + Math.random() * 900)}`,
        name: form.name,
        schoolName: form.schoolName,
        district: form.district,
        email: form.email,
        phone: form.phone || "+91 98765 00000",
        udise: form.udise || `2407${Math.floor(1000000 + Math.random() * 9000000)}`,
        status: "Active",
        appointedDate: new Date().toISOString().split("T")[0],
        studentsCount: 350,
        teachersCount: 15,
      };

      const updated = [newPrincipal, ...principals];
      setPrincipals(updated);
      localStorage.setItem("igms.principals_roster", JSON.stringify(updated));

      // Also register credential account
      try {
        const existingAccounts = JSON.parse(
          localStorage.getItem("igms.created_principals") || "[]"
        );
        const newAccount = {
          email: form.email.toLowerCase(),
          password: form.password,
          name: form.name,
          roleKey: "principal",
          role: "Principal",
          schoolName: form.schoolName,
        };
        localStorage.setItem(
          "igms.created_principals",
          JSON.stringify([newAccount, ...existingAccounts])
        );
      } catch (err) {}

      toast.success(
        `Principal account created for '${form.name}'! Credentials active.`
      );
    }

    setIsModalOpen(false);
    setEditingPrincipal(null);
    setForm({
      name: "",
      schoolName: "",
      district: "Gandhinagar",
      email: "",
      phone: "",
      password: "Principal@123",
      udise: "",
    });
  };

  const handleEdit = (p) => {
    setEditingPrincipal(p);
    setForm({
      name: p.name,
      schoolName: p.schoolName,
      district: p.district || "Gandhinagar",
      email: p.email,
      phone: p.phone,
      password: "••••••••",
      udise: p.udise || "",
    });
    setIsModalOpen(true);
  };

  const handleResetPassword = (p) => {
    toast.success(
      `Password reset link dispatched to ${p.email}. Temporary PIN: 123456`
    );
  };

  const filtered = principals.filter((p) => {
    const matchesSearch =
      (p.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.schoolName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.udise || "").includes(searchTerm);

    const matchesDistrict =
      selectedDistrict === "All Districts" || p.district === selectedDistrict;

    return matchesSearch && matchesDistrict;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="State Principals Directory & Oversight"
        description="Provision, assign schools, and manage institutional principal credentials across all districts."
        breadcrumbs={[
          { label: "Super Admin" },
          { label: "Principals Directory" },
        ]}
        action={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              icon={FiRefreshCw}
              onClick={loadPrincipals}
            >
              Refresh
            </Button>
            <Button
              size="sm"
              icon={FiPlus}
              onClick={() => {
                setEditingPrincipal(null);
                setForm({
                  name: "",
                  schoolName: "",
                  district: "Gandhinagar",
                  email: "",
                  phone: "",
                  password: "Principal@123",
                  udise: "",
                });
                setIsModalOpen(true);
              }}
              className="bg-[#0f2b4d] hover:bg-blue-900 text-white font-bold"
            >
              Appoint New Principal
            </Button>
          </div>
        }
      />

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Principals
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FiShield className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-[#0f2b4d]">
            {principals.length}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Institutional heads on record
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Active Portals
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <FiCheckCircle className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-emerald-900">
            {principals.filter((p) => p.status === "Active").length}
          </p>
          <p className="mt-1 text-[11px] text-emerald-600">100% Verified accounts</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
              Districts Covered
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <FiMapPin className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-[#0f2b4d]">
            {new Set(principals.map((p) => p.district)).size}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">Gujarat Education Divisions</p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Assigned Schools
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <FiHome className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-amber-900">
            {principals.length}
          </p>
          <p className="mt-1 text-[11px] text-amber-600">Primary & Secondary Schools</p>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="relative min-w-[280px] flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Principal name, School, UDISE code, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs text-ink outline-none focus:border-primary focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 outline-none focus:border-primary"
          >
            {DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Principals Roster Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {filtered.length === 0 ? (
          <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <FiUserCheck className="mx-auto h-12 w-12 text-slate-300" />
            <p className="mt-3 text-sm font-bold text-ink">
              No Principal Records Found
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Try modifying your search or district filter.
            </p>
          </div>
        ) : (
          filtered.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0f2b4d] text-white font-extrabold text-base shadow-xs">
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-[#0f2b4d]">
                        {p.name}
                      </h3>
                      <Badge tone="success">{p.status}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      ID: <span className="font-semibold text-slate-700">{p.id}</span> • Appointed: {p.appointedDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(p)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition"
                    title="Edit Principal"
                  >
                    <FiEdit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleResetPassword(p)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-amber-600 transition"
                    title="Dispatch Password Reset"
                  >
                    <FiKey className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* School Assignment Info */}
              <div className="mt-4 rounded-xl bg-slate-50/75 p-3 border border-slate-100">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0f2b4d]">
                  <FiHome className="h-4 w-4 text-blue-600" />
                  <span>{p.schoolName}</span>
                </div>
                <div className="mt-2 flex flex-wrap items-center justify-between text-[11px] text-slate-600">
                  <span>
                    District: <b className="text-slate-800">{p.district}</b>
                  </span>
                  <span>
                    UDISE: <b className="text-primary font-mono">{p.udise}</b>
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <FiMail className="h-3.5 w-3.5 text-slate-400" />
                  <span className="truncate font-medium">{p.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiPhone className="h-3.5 w-3.5 text-slate-400" />
                  <span>{p.phone}</span>
                </div>
              </div>

              {/* Action Footer */}
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                  <span>👨‍🎓 {p.studentsCount || 350} Students</span>
                  <span>👩‍🏫 {p.teachersCount || 15} Teachers</span>
                </div>
                <button
                  onClick={() => handleResetPassword(p)}
                  className="inline-flex items-center gap-1 font-bold text-blue-700 hover:text-blue-900 transition text-xs"
                >
                  <FiLock className="h-3.5 w-3.5" />
                  Manage Credentials
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Appoint / Edit Principal Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-100"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0f2b4d]">
                    <FiShield className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0f2b4d]">
                      {editingPrincipal
                        ? "Edit Principal Details"
                        : "Appoint New School Principal"}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Super Admin Institutional Governance Desk
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSavePrincipal} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Principal Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Rajesh K. Varma"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-ink outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Assigned School Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Govt High School"
                      value={form.schoolName}
                      onChange={(e) =>
                        setForm({ ...form, schoolName: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-ink outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      District *
                    </label>
                    <select
                      value={form.district}
                      onChange={(e) =>
                        setForm({ ...form, district: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-ink outline-none focus:border-primary"
                    >
                      {DISTRICTS.filter((d) => d !== "All Districts").map(
                        (d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Official Email ID *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="principal@school.igms.gov.in"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-ink outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-ink outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {!editingPrincipal && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Initial Password
                    </label>
                    <input
                      type="text"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-mono text-ink outline-none focus:border-primary bg-slate-50"
                    />
                    <p className="mt-1 text-[10px] text-slate-400">
                      The Principal can change this password upon initial login.
                    </p>
                  </div>
                )}

                <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#0f2b4d] hover:bg-blue-900 text-white font-bold"
                  >
                    {editingPrincipal
                      ? "Save Changes"
                      : "Confirm & Appoint Principal"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
