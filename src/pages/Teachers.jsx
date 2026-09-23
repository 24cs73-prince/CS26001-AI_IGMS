import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiPlus,
  FiStar,
  FiMail,
  FiPhone,
  FiBookOpen,
  FiDownload,
  FiFilter,
  FiUserCheck,
} from "react-icons/fi";

import { useFetch } from "../hooks/useFetch";
import { useDebounce } from "../hooks/useDebounce";
import { api } from "../services/api";
import { searchRows } from "../utils/filter";
import { exportToCSV } from "../utils/exportCsv";
import { DEPARTMENTS, STANDARDS, SECTIONS, formatStandard } from "../constants/app";

import PageHeader from "../components/common/PageHeader";
import {
  Button,
  Badge,
  Avatar,
  SearchBox,
  Dropdown,
  EmptyState,
  Modal,
  Input,
} from "../components/ui";
import { PageLoader } from "../components/ui/Loader";
import { useToast } from "../context/ToastContext";

export default function Teachers() {
  const { data: rawTeachers, loading } = useFetch(() => api.getTeachers(), []);
  const toast = useToast();

  // Local state for additions so UI updates live without hard page reload
  const [addedTeachers, setAddedTeachers] = useState([]);

  // Search & Filters
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 250);

  const [deptFilter, setDeptFilter] = useState({
    value: "all",
    label: "All Departments",
  });

  const [standardFilter, setStandardFilter] = useState({
    value: "all",
    label: "All Standards (Std 1-8)",
  });

  const [statusFilter, setStatusFilter] = useState({
    value: "all",
    label: "All Statuses",
  });

  // Add Teacher modal
  const [addOpen, setAddOpen] = useState(false);

  const initialFormState = {
    teacherId: "",
    name: "",
    department: "Mathematics",
    subject: "Mathematics",
    experience: "5",
    assignedStandard: "Std 5",
    assignedDivision: "A",
    phone: "",
    email: "",
    status: "Active",
  };

  const [newTeacher, setNewTeacher] = useState(initialFormState);

  const resetForm = () => {
    const nextIdNum = 200 + (rawTeachers?.length || 0) + addedTeachers.length + 1;
    setNewTeacher({
      ...initialFormState,
      teacherId: `TCH-${nextIdNum}`,
    });
  };

  useEffect(() => {
    if (addOpen) {
      resetForm();
    }
  }, [addOpen, rawTeachers, addedTeachers.length]);

  /*
   * Normalize teachers data (combine fetched + added)
   */
  const teachers = useMemo(() => {
    const combined = [...addedTeachers, ...(rawTeachers || [])];
    if (combined.length === 0) return [];

    return combined.map((t, idx) => {
      const rawClasses = Array.isArray(t.classes) && t.classes.length > 0 ? t.classes : ["Std 5", "Std 6"];
      const formattedClasses = rawClasses.map(formatStandard);

      return {
        ...t,
        id: String(t.teacherId || t.id || `TCH-${200 + idx}`),
        name: String(t.name || "Faculty Member"),
        department: String(t.department || "General"),
        subject: String(t.subject || "General"),
        experience: Number(t.experience) || 5,
        rating: Number(t.rating) || 4.5,
        phone: String(t.phone || "+91 98000 00000"),
        email: String(t.email || `${(t.name || "teacher").toLowerCase().replace(/[^a-z]/g, "")}@igms.edu`),
        classes: formattedClasses,
        status: String(t.status || "Active"),
      };
    });
  }, [rawTeachers, addedTeachers]);

  /*
   * Filter options
   */
  const deptOptions = [
    { value: "all", label: "All Departments" },
    ...DEPARTMENTS.map((d) => ({ value: d, label: d })),
  ];

  const standardOptions = [
    { value: "all", label: "All Standards (Std 1-8)" },
    ...STANDARDS.map((std) => ({ value: std, label: std })),
  ];

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "Active", label: "Active" },
    { value: "On Leave", label: "On Leave" },
    { value: "Inactive", label: "Inactive" },
  ];

  /*
   * Search & Combined Filter
   */
  const filtered = useMemo(() => {
    if (!teachers || teachers.length === 0) return [];

    let rows = searchRows(teachers, debounced, [
      "name",
      "id",
      "subject",
      "email",
      "department",
      "phone",
    ]);

    if (deptFilter.value !== "all") {
      rows = rows.filter((t) => t.department === deptFilter.value);
    }

    if (standardFilter.value !== "all") {
      const targetStd = formatStandard(standardFilter.value).toLowerCase();
      rows = rows.filter((t) =>
        t.classes.some((c) => formatStandard(c).toLowerCase() === targetStd)
      );
    }

    if (statusFilter.value !== "all") {
      rows = rows.filter((t) => t.status.toLowerCase() === statusFilter.value.toLowerCase());
    }

    return rows;
  }, [teachers, debounced, deptFilter, standardFilter, statusFilter]);

  const getAuthToken = () => {
    try {
      const rawUser = localStorage.getItem("igms.auth.user");
      if (rawUser) return JSON.parse(rawUser)?.token || "";
    } catch (e) {}
    return localStorage.getItem("igms.auth.token") || "";
  };

  /*
   * Handle Create Teacher with validation & duplicate checks
   */
  const handleCreateTeacher = async () => {
    if (!newTeacher.name.trim()) {
      toast.warning("Please enter teacher full name.");
      return;
    }
    if (!newTeacher.subject.trim()) {
      toast.warning("Please enter subject taught.");
      return;
    }

    const teacherIdInput = newTeacher.teacherId.trim() || `TCH-${200 + teachers.length + 1}`;

    // Duplicate Check ID
    const duplicateId = teachers.some((t) => t.id.toLowerCase() === teacherIdInput.toLowerCase());
    if (duplicateId) {
      toast.error(`Teacher ID "${teacherIdInput}" already exists! Please use a unique ID.`);
      return;
    }

    // Duplicate Check Email if provided
    if (newTeacher.email.trim()) {
      const duplicateEmail = teachers.some(
        (t) => t.email.toLowerCase() === newTeacher.email.trim().toLowerCase()
      );
      if (duplicateEmail) {
        toast.error(`Email address "${newTeacher.email}" is already registered.`);
        return;
      }
    }

    const assignedCls = `${newTeacher.assignedStandard} - ${newTeacher.assignedDivision}`;

    const payload = {
      teacherId: teacherIdInput,
      name: newTeacher.name.trim(),
      department: newTeacher.department,
      subject: newTeacher.subject.trim(),
      experience: Number(newTeacher.experience) || 5,
      phone: newTeacher.phone.trim() || "+91 98000 00000",
      email:
        newTeacher.email.trim() ||
        `${newTeacher.name.toLowerCase().replace(/[^a-z]/g, "")}@igms.edu`,
      classes: [assignedCls],
      status: newTeacher.status || "Active",
      rating: 4.8,
    };

    try {
      const token = getAuthToken();
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      let res = await fetch("/api/teachers", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      }).catch(() => null);

      if (!res || !res.ok) {
        res = await fetch("http://localhost:5000/api/teachers", {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        }).catch(() => null);
      }
    } catch (err) {
      console.warn("Backend teacher save error, updating local state:", err);
    }

    // Update local state dynamically (NO hard page reload)
    setAddedTeachers((prev) => [payload, ...prev]);
    toast.success(`Teacher ${payload.name} added successfully!`);
    setAddOpen(false);
  };

  /*
   * Handle CSV Export for filtered teachers
   */
  const handleExportCSV = () => {
    if (!filtered || filtered.length === 0) {
      toast.warning("No teacher records found matching the current search/filters.");
      return;
    }

    const headers = [
      "Teacher ID",
      "Full Name",
      "Department",
      "Subject",
      "Experience (Years)",
      "Rating",
      "Email",
      "Phone",
      "Assigned Classes",
      "Status",
    ];

    const rows = filtered.map((t) => [
      t.id,
      t.name,
      t.department,
      t.subject,
      t.experience,
      t.rating,
      t.email,
      t.phone,
      t.classes.join("; "),
      t.status,
    ]);

    exportToCSV("Teachers_List.csv", headers, rows);
    toast.success(`Exported ${filtered.length} filtered teacher record(s)!`);
  };

  if (loading) return <PageLoader label="Loading faculty teachers…" />;

  const isApprovedLeave = (teacher) => teacher?.status === "On Leave";

  return (
    <div>
      <PageHeader
        title="Teacher Management"
        description={`${teachers.length} faculty members across ${DEPARTMENTS.length} departments.`}
        breadcrumbs={[{ label: "Teachers" }]}
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              icon={FiDownload}
              onClick={handleExportCSV}
            >
              Export CSV
            </Button>
            <Button icon={FiPlus} onClick={() => setAddOpen(true)}>
              Add Teacher
            </Button>
          </div>
        }
      />

      {/* Toolbar */}
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center">
        <SearchBox
          value={query}
          onChange={setQuery}
          placeholder="Search teachers by name, ID, subject, email…"
          className="w-full lg:max-w-xs"
        />
        <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
          <FiFilter className="hidden h-4 w-4 text-slate-400 lg:block" />

          {/* Department Filter */}
          <Dropdown
            options={deptOptions}
            value={deptFilter}
            onChange={setDeptFilter}
            className="w-48"
          />

          {/* Standard Filter */}
          <Dropdown
            options={standardOptions}
            value={standardFilter}
            onChange={setStandardFilter}
            className="w-48"
          />

          {/* Status Filter */}
          <Dropdown
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            className="w-36"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No teachers found"
          description="Try adjusting your search query or department/standard filters."
          icon={FiBookOpen}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              className="group rounded-2xl border border-hairline bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={t.name} size="lg" />
                  <div>
                    <p className="font-semibold text-ink">{t.name}</p>
                    <p className="text-xs text-slate-400">ID: {t.id}</p>
                  </div>
                </div>
                {isApprovedLeave(t) ? (
                  <Badge tone="warning">On Leave</Badge>
                ) : (
                  <Badge tone={t.status === "Active" ? "accent" : "neutral"}>
                    {t.status}
                  </Badge>
                )}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Badge tone="primary">{t.department}</Badge>
                <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
                  <FiBookOpen className="h-3.5 w-3.5" /> {t.subject}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-canvas p-3 text-center">
                <div>
                  <p className="text-xs text-slate-400">Experience</p>
                  <p className="text-sm font-semibold text-ink">
                    {t.experience} yrs
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Rating</p>
                  <p className="flex items-center justify-center gap-1 text-sm font-semibold text-ink">
                    <FiStar className="h-3.5 w-3.5 fill-warning text-warning" />{" "}
                    {t.rating}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-1.5 border-t border-hairline pt-4">
                <p className="flex items-center gap-2 text-xs text-slate-500">
                  <FiMail className="h-3.5 w-3.5" /> {t.email}
                </p>
                <p className="flex items-center gap-2 text-xs text-slate-500">
                  <FiPhone className="h-3.5 w-3.5" /> {t.phone}
                </p>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {(t.classes || []).map((c) => (
                  <span
                    key={c}
                    className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Teacher Modal */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add New Faculty Teacher"
        subtitle="Enter teacher details to add to school faculty."
        footer={
          <>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTeacher}>Save Teacher</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Teacher ID"
            placeholder="e.g. TCH-213"
            value={newTeacher.teacherId}
            onChange={(e) =>
              setNewTeacher({ ...newTeacher, teacherId: e.target.value })
            }
          />
          <Input
            label="Full Name *"
            placeholder="e.g. Dr. Meenakshi Iyer"
            value={newTeacher.name}
            onChange={(e) =>
              setNewTeacher({ ...newTeacher, name: e.target.value })
            }
          />

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Department
            </label>
            <select
              value={newTeacher.department}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, department: e.target.value })
              }
              className="w-full rounded-xl border border-hairline bg-white px-3 py-2 text-sm text-ink outline-none focus:border-primary-500"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Subject Taught *"
            placeholder="e.g. Mathematics"
            value={newTeacher.subject}
            onChange={(e) =>
              setNewTeacher({ ...newTeacher, subject: e.target.value })
            }
          />

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Assigned Standard (Std 1-8)
            </label>
            <select
              value={newTeacher.assignedStandard}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, assignedStandard: e.target.value })
              }
              className="w-full rounded-xl border border-hairline bg-white px-3 py-2 text-sm text-ink outline-none focus:border-primary-500"
            >
              {STANDARDS.map((std) => (
                <option key={std} value={std}>
                  {std}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Division / Section
            </label>
            <select
              value={newTeacher.assignedDivision}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, assignedDivision: e.target.value })
              }
              className="w-full rounded-xl border border-hairline bg-white px-3 py-2 text-sm text-ink outline-none focus:border-primary-500"
            >
              {SECTIONS.map((sec) => (
                <option key={sec} value={sec}>
                  Division {sec}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Experience (Years)"
            type="number"
            placeholder="e.g. 8"
            value={newTeacher.experience}
            onChange={(e) =>
              setNewTeacher({ ...newTeacher, experience: e.target.value })
            }
          />

          <Input
            label="Phone Number"
            placeholder="+91 98000 00000"
            value={newTeacher.phone}
            onChange={(e) =>
              setNewTeacher({ ...newTeacher, phone: e.target.value })
            }
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="teacher@igms.edu"
            value={newTeacher.email}
            onChange={(e) =>
              setNewTeacher({ ...newTeacher, email: e.target.value })
            }
            className="sm:col-span-2"
          />
        </div>
      </Modal>
    </div>
  );
}
