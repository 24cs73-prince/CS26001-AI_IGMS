import { useMemo, useState, useEffect } from "react";
import {
  FiPlus,
  FiFilter,
  FiPhone,
  FiMail,
  FiDownload,
  FiUserCheck,
} from "react-icons/fi";

import { useFetch } from "../hooks/useFetch";
import { useDebounce } from "../hooks/useDebounce";
import { usePagination } from "../hooks/usePagination";
import { api } from "../services/api";
import { searchRows } from "../utils/filter";
import { exportToCSV } from "../utils/exportCsv";
import { STATUS_TONE } from "../constants/theme";
import { STANDARDS, SECTIONS, formatStandard } from "../constants/app";

import PageHeader from "../components/common/PageHeader";
import {
  Button,
  Badge,
  Avatar,
  Table,
  SearchBox,
  Dropdown,
  Pagination,
  Modal,
  Input,
  Card,
  EmptyState,
} from "../components/ui";

import { PageLoader } from "../components/ui/Loader";
import { useToast } from "../context/ToastContext";

/**
 * Principal Parent Management Page
 *
 * Features:
 * - Search by Parent Name, Parent Phone, Email, Linked Student Name, Student ID
 * - Filters for Standard (Std 1 to Std 8), Division (A/B/C/D), and Status
 * - Add Parent modal with live state update (no page reload)
 * - Filtered CSV export capability
 */
export default function Parents() {
  const { data: rawStudents, loading } = useFetch(() => api.getStudents(), []);
  const toast = useToast();

  // Local additions for parents created in current session
  const [addedParents, setAddedParents] = useState([]);

  // Search & Filter state
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 250);

  const [classFilter, setClassFilter] = useState({
    value: "all",
    label: "All Standards (Std 1-8)",
  });

  const [sectionFilter, setSectionFilter] = useState({
    value: "all",
    label: "All Divisions",
  });

  const [statusFilter, setStatusFilter] = useState({
    value: "all",
    label: "All Statuses",
  });

  const [selected, setSelected] = useState(null);
  const [addOpen, setAddOpen] = useState(false);

  const initialFormState = {
    guardian: "",
    phone: "",
    email: "",
    studentName: "",
    studentId: "",
    className: "Std 5",
    section: "A",
    status: "Active",
  };

  const [newParent, setNewParent] = useState(initialFormState);

  useEffect(() => {
    if (addOpen) {
      const nextId = 500 + (rawStudents?.length || 0) + addedParents.length + 1;
      setNewParent({
        ...initialFormState,
        studentId: `STU-${1000 + nextId}`,
      });
    }
  }, [addOpen, rawStudents, addedParents.length]);

  /*
   * Derive Parent records from Student relationships + added parents
   */
  const parentsList = useMemo(() => {
    const parentMap = [];

    // Added parents first
    addedParents.forEach((p, idx) => {
      parentMap.push({
        id: `PAR-${500 + idx + 1}`,
        guardian: p.guardian,
        phone: p.phone,
        email: p.email,
        studentName: p.studentName,
        studentId: p.studentId,
        className: p.className,
        displayClass: formatStandard(p.className),
        section: p.section.toUpperCase(),
        attendance: 92,
        average: 84,
        status: p.status || "Active",
      });
    });

    // Derive from raw students
    if (Array.isArray(rawStudents)) {
      rawStudents.forEach((s, idx) => {
        const displayCls = formatStandard(s?.className || s?.standard || "Std 5");
        parentMap.push({
          id: `PAR-${100 + idx + 1}`,
          guardian: String(s?.guardian || `${s?.name || "Student"}'s Parent`),
          phone: String(s?.phone || "+91 98000 00000"),
          email: String(s?.email || `${(s?.name || "student").toLowerCase().replace(/[^a-z]/g, "")}@igms.edu`),
          studentName: String(s?.name || "Student"),
          studentId: String(s?.studentId || s?.id || `STU-${1000 + idx}`),
          className: s?.className || displayCls,
          displayClass: displayCls,
          section: String(s?.section || "A").toUpperCase(),
          attendance: Number(s?.attendance) || 90,
          average: Number(s?.average) || 80,
          status: String(s?.status || "Active"),
        });
      });
    }

    return parentMap;
  }, [rawStudents, addedParents]);

  /*
   * Dropdown options
   */
  const classOptions = useMemo(() => {
    return [
      { value: "all", label: "All Standards (Std 1-8)" },
      ...STANDARDS.map((std) => ({ value: std, label: std })),
    ];
  }, []);

  const sectionOptions = useMemo(() => {
    return [
      { value: "all", label: "All Divisions" },
      ...SECTIONS.map((sec) => ({ value: sec, label: `Division ${sec}` })),
    ];
  }, []);

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  /*
   * Multi-field search and combined filter
   */
  const filtered = useMemo(() => {
    if (!parentsList || parentsList.length === 0) return [];

    let rows = [...parentsList];

    rows = searchRows(rows, debounced, [
      "guardian",
      "phone",
      "email",
      "studentName",
      "studentId",
      "displayClass",
    ]);

    if (classFilter.value !== "all") {
      const targetCls = formatStandard(classFilter.value).toLowerCase();
      rows = rows.filter(
        (p) => formatStandard(p.displayClass).toLowerCase() === targetCls
      );
    }

    if (sectionFilter.value !== "all") {
      rows = rows.filter(
        (p) => p.section.toUpperCase() === sectionFilter.value.toUpperCase()
      );
    }

    if (statusFilter.value !== "all") {
      rows = rows.filter(
        (p) => p.status.toLowerCase() === statusFilter.value.toLowerCase()
      );
    }

    return rows;
  }, [parentsList, debounced, classFilter, sectionFilter, statusFilter]);

  const { page, setPage, totalPages, total, pageRows, pageSize } =
    usePagination(filtered, 8);

  /*
   * Handle Create Parent with validation
   */
  const handleCreateParent = () => {
    if (!newParent.guardian.trim()) {
      toast.warning("Please enter Parent / Guardian Name.");
      return;
    }
    if (!newParent.studentName.trim()) {
      toast.warning("Please enter Linked Student Name.");
      return;
    }

    const payload = {
      guardian: newParent.guardian.trim(),
      phone: newParent.phone.trim() || "+91 98000 00000",
      email:
        newParent.email.trim() ||
        `${newParent.guardian.toLowerCase().replace(/[^a-z]/g, "")}@igms.edu`,
      studentName: newParent.studentName.trim(),
      studentId: newParent.studentId.trim() || `STU-${1000 + parentsList.length + 1}`,
      className: newParent.className,
      section: newParent.section.toUpperCase(),
      status: newParent.status || "Active",
    };

    // Update local state live without hard page reload
    setAddedParents((prev) => [payload, ...prev]);
    toast.success(`Parent record for ${payload.guardian} added successfully!`);
    setAddOpen(false);
  };

  /*
   * Handle CSV Export for filtered parents
   */
  const handleExportCSV = () => {
    if (!filtered || filtered.length === 0) {
      toast.warning("No parent records found matching the current search/filters.");
      return;
    }

    const headers = [
      "Parent / Guardian",
      "Phone",
      "Email",
      "Linked Student",
      "Student ID",
      "Standard",
      "Division",
      "Attendance (%)",
      "Average Score (%)",
      "Status",
    ];

    const rows = filtered.map((p) => [
      p.guardian,
      p.phone,
      p.email,
      p.studentName,
      p.studentId,
      p.displayClass,
      p.section,
      p.attendance,
      p.average,
      p.status,
    ]);

    exportToCSV("Parents_List.csv", headers, rows);
    toast.success(`Exported ${filtered.length} filtered parent record(s)!`);
  };

  if (loading) return <PageLoader label="Loading parent records…" />;

  const columns = [
    {
      key: "guardian",
      header: "Parent / Guardian",
      render: (r) => (
        <div className="flex items-center gap-3">
          <Avatar name={r.guardian} size="sm" />
          <div>
            <p className="font-medium text-ink">{r.guardian}</p>
            <p className="text-xs text-slate-400">{r.phone}</p>
          </div>
        </div>
      ),
    },
    {
      key: "studentName",
      header: "Linked Student",
      render: (r) => (
        <div>
          <p className="font-medium text-ink">{r.studentName}</p>
          <p className="text-xs text-slate-400">ID: {r.studentId}</p>
        </div>
      ),
    },
    {
      key: "className",
      header: "Standard / Div",
      render: (r) => (
        <span className="font-medium text-slate-700">
          {r.displayClass} - Div {r.section}
        </span>
      ),
    },
    {
      key: "attendance",
      header: "Student Attendance",
      align: "center",
      render: (r) => (
        <span
          className={
            r.attendance >= 85
              ? "text-accent-600 font-medium"
              : r.attendance >= 70
              ? "text-warning-600 font-medium"
              : "text-danger-600 font-medium"
          }
        >
          {r.attendance}%
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      render: (r) => (
        <Badge tone={STATUS_TONE[r.status] || "neutral"}>{r.status}</Badge>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Parent Management"
        description={`${total} parents linked across Std 1 to Std 8.`}
        breadcrumbs={[{ label: "Parents" }]}
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
              Add Parent
            </Button>
          </div>
        }
      />

      <Card padding={false}>
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-hairline p-4 lg:flex-row lg:items-center">
          <SearchBox
            value={query}
            onChange={setQuery}
            placeholder="Search by parent name, phone, student name, ID…"
            className="w-full lg:max-w-xs"
          />

          <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
            <FiFilter className="hidden h-4 w-4 text-slate-400 lg:block" />

            {/* Standard Filter */}
            <Dropdown
              options={classOptions}
              value={classFilter}
              onChange={setClassFilter}
              className="w-44"
            />

            {/* Section Filter */}
            <Dropdown
              options={sectionOptions}
              value={sectionFilter}
              onChange={setSectionFilter}
              className="w-36"
            />

            {/* Status Filter */}
            <Dropdown
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              className="w-32"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No parent records found"
              description="No parent records match your current search query or filter selection."
              icon={FiUserCheck}
            />
          </div>
        ) : (
          <>
            <Table
              columns={columns}
              data={pageRows}
              rowKey={(r) => r.id}
              onRowClick={setSelected}
            />

            <div className="border-t border-hairline p-4">
              <Pagination
                page={page}
                totalPages={totalPages}
                total={total}
                pageSize={pageSize}
                onPage={setPage}
              />
            </div>
          </>
        )}
      </Card>

      {/* Profile drawer */}
      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        size="md"
        title="Parent Profile"
        subtitle={`Parent of ${selected?.studentName}`}
      >
        {selected && (
          <div>
            <div className="flex items-center gap-4">
              <Avatar name={selected.guardian} size="xl" />
              <div>
                <h3 className="text-lg font-semibold text-ink">
                  {selected.guardian}
                </h3>
                <p className="text-sm text-slate-500">
                  {selected.phone} · {selected.email}
                </p>
                <div className="mt-1">
                  <Badge tone={STATUS_TONE[selected.status] || "neutral"}>
                    {selected.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-canvas p-4">
                <p className="text-xs text-slate-400">Child's Attendance</p>
                <p className="text-xl font-bold text-ink">
                  {selected.attendance}%
                </p>
              </div>
              <div className="rounded-xl bg-canvas p-4">
                <p className="text-xs text-slate-400">Child's Average Score</p>
                <p className="text-xl font-bold text-ink">
                  {selected.average}%
                </p>
              </div>
            </div>

            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-slate-500">Linked Student</dt>
                <dd className="font-medium text-ink">{selected.studentName}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-500">Student ID</dt>
                <dd className="font-medium text-ink">{selected.studentId}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-500">Class & Division</dt>
                <dd className="font-medium text-ink">
                  {selected.displayClass} · Division {selected.section}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-1.5 text-slate-500">
                  <FiPhone className="h-3.5 w-3.5" /> Phone
                </dt>
                <dd className="font-medium text-ink">{selected.phone}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-1.5 text-slate-500">
                  <FiMail className="h-3.5 w-3.5" /> Email
                </dt>
                <dd className="font-medium text-ink">{selected.email}</dd>
              </div>
            </dl>
          </div>
        )}
      </Modal>

      {/* Add Parent modal */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add New Parent"
        subtitle="Link parent details to a student record."
        footer={
          <>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateParent}>Save Parent</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Parent / Guardian Name *"
            placeholder="e.g. Rajesh Sharma"
            value={newParent.guardian}
            onChange={(e) =>
              setNewParent({ ...newParent, guardian: e.target.value })
            }
          />
          <Input
            label="Linked Student Name *"
            placeholder="e.g. Aarav Sharma"
            value={newParent.studentName}
            onChange={(e) =>
              setNewParent({ ...newParent, studentName: e.target.value })
            }
          />
          <Input
            label="Student ID"
            placeholder="e.g. STU-1001"
            value={newParent.studentId}
            onChange={(e) =>
              setNewParent({ ...newParent, studentId: e.target.value })
            }
          />
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Standard / Class
            </label>
            <select
              value={newParent.className}
              onChange={(e) =>
                setNewParent({ ...newParent, className: e.target.value })
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
              value={newParent.section}
              onChange={(e) =>
                setNewParent({ ...newParent, section: e.target.value })
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
            label="Phone Number"
            placeholder="+91 98000 00000"
            value={newParent.phone}
            onChange={(e) =>
              setNewParent({ ...newParent, phone: e.target.value })
            }
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="parent@igms.edu"
            value={newParent.email}
            onChange={(e) =>
              setNewParent({ ...newParent, email: e.target.value })
            }
            className="sm:col-span-2"
          />
        </div>
      </Modal>
    </div>
  );
}
