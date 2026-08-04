import { useMemo, useState } from "react";
import { FiPlus, FiFilter, FiPhone, FiMail, FiDownload } from "react-icons/fi";

import { useFetch } from "../hooks/useFetch";
import { useDebounce } from "../hooks/useDebounce";
import { usePagination } from "../hooks/usePagination";
import { api } from "../services/api";
import { searchRows } from "../utils/filter";
import { STATUS_TONE } from "../constants/theme";

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
} from "../components/ui";
import { PageLoader } from "../components/ui/Loader";
import { useToast } from "../context/ToastContext";

/**
 * Student Management page: searchable, filterable, paginated table
 * with a profile drawer and an (UI-only) "Add Student" modal.
 */
export default function Students() {
  const { data: students, loading } = useFetch(() => api.getStudents(), []);
  const toast = useToast();

  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 250);
  const [classFilter, setClassFilter] = useState({
    value: "all",
    label: "All Classes",
  });
  const [selected, setSelected] = useState(null);
  const [addOpen, setAddOpen] = useState(false);

  const classOptionsFromData = useMemo(() => {
    if (!students) return [{ value: "all", label: "All Classes" }];

    const allowedClasses = new Set(["Class 6", "Class 7", "Class 8"]);
    const options = [
      ...new Set(
        students
          .filter((s) => allowedClasses.has(s.className))
          .map((s) => s.className),
      ),
    ];
    return [
      { value: "all", label: "All Classes" },
      ...options.map((c) => ({ value: c, label: c })),
    ];
  }, [students]);

  const filtered = useMemo(() => {
    if (!students) return [];

    const allowedClasses = new Set(["Class 6", "Class 7", "Class 8"]);
    let rows = students.filter((s) => allowedClasses.has(s.className));
    rows = searchRows(rows, debounced, ["name", "id", "email", "guardian"]);
    if (classFilter.value !== "all")
      rows = rows.filter((s) => s.className === classFilter.value);
    return rows;
  }, [students, debounced, classFilter]);

  const { page, setPage, totalPages, total, pageRows, pageSize } =
    usePagination(filtered, 8);

  if (loading) return <PageLoader label="Loading students…" />;

  const classOptions = classOptionsFromData;

  const columns = [
    {
      key: "name",
      header: "Student",
      render: (r) => (
        <div className="flex items-center gap-3">
          <Avatar name={r.name} size="sm" />
          <div>
            <p className="font-medium text-ink">{r.name}</p>
            <p className="text-xs text-slate-400">{r.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: "className",
      header: "Class",
      render: (r) => (
        <span>
          {r.className} · {r.section}
        </span>
      ),
    },
    { key: "guardian", header: "Guardian" },
    {
      key: "attendance",
      header: "Attendance",
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
      key: "average",
      header: "Avg. Score",
      align: "center",
      render: (r) => <span className="font-medium">{r.average}%</span>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Student Management"
        description={`${total} students across all classes and sections.`}
        breadcrumbs={[{ label: "Students" }]}
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              icon={FiDownload}
              onClick={() => toast.info("Export started (demo).")}
            >
              Export
            </Button>
            <Button icon={FiPlus} onClick={() => setAddOpen(true)}>
              Add Student
            </Button>
          </div>
        }
      />

      <Card padding={false}>
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-hairline p-4 md:flex-row md:items-center">
          <SearchBox
            value={query}
            onChange={setQuery}
            placeholder="Search by name, ID, email…"
            className="md:max-w-xs"
          />
          <div className="flex flex-1 items-center gap-2 md:justify-end">
            <FiFilter className="hidden h-4 w-4 text-slate-400 md:block" />
            <Dropdown
              options={classOptions}
              value={classFilter}
              onChange={setClassFilter}
              className="w-40"
            />
          </div>
        </div>

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
      </Card>

      {/* Profile drawer */}
      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        size="md"
        title="Student Profile"
        subtitle={selected?.id}
      >
        {selected && (
          <div>
            <div className="flex items-center gap-4">
              <Avatar name={selected.name} size="xl" />
              <div>
                <h3 className="text-lg font-semibold text-ink">
                  {selected.name}
                </h3>
                <p className="text-sm text-slate-500">
                  {selected.className} · Section {selected.section} · Roll{" "}
                  {selected.roll}
                </p>
                <div className="mt-1">
                  <Badge tone={STATUS_TONE[selected.status]}>
                    {selected.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-canvas p-4">
                <p className="text-xs text-slate-400">Attendance</p>
                <p className="text-xl font-bold text-ink">
                  {selected.attendance}%
                </p>
              </div>
              <div className="rounded-xl bg-canvas p-4">
                <p className="text-xs text-slate-400">Average Score</p>
                <p className="text-xl font-bold text-ink">
                  {selected.average}%
                </p>
              </div>
            </div>

            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-slate-500">Guardian</dt>
                <dd className="font-medium text-ink">{selected.guardian}</dd>
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
              <div className="flex items-center justify-between">
                <dt className="text-slate-500">Admission Date</dt>
                <dd className="font-medium text-ink">
                  {selected.admissionDate}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </Modal>

      {/* Add student modal (UI only) */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add New Student"
        subtitle="Enter the student's details below."
        footer={
          <>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setAddOpen(false);
                toast.success("Student added (demo).");
              }}
            >
              Save Student
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Full Name" placeholder="e.g. Aarav Sharma" />
          <Input label="Roll Number" type="number" placeholder="e.g. 26" />
          <Input label="Class" placeholder="e.g. Class 10" />
          <Input label="Section" placeholder="e.g. A" />
          <Input label="Guardian Name" placeholder="e.g. Rajesh Sharma" />
          <Input label="Phone" placeholder="+91 …" />
          <Input
            label="Email"
            type="email"
            placeholder="student@igms.edu"
            className="sm:col-span-2"
          />
        </div>
      </Modal>
    </div>
  );
}
