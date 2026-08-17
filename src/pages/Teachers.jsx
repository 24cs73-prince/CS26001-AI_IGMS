import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FiPlus, FiStar, FiMail, FiPhone, FiBookOpen } from "react-icons/fi";

import { useFetch } from "../hooks/useFetch";
import { useDebounce } from "../hooks/useDebounce";
import { api } from "../services/api";
import { searchRows } from "../utils/filter";
import { DEPARTMENTS } from "../constants/app";

import PageHeader from "../components/common/PageHeader";
import {
  Button,
  Badge,
  Avatar,
  SearchBox,
  Dropdown,
  EmptyState,
} from "../components/ui";
import { PageLoader } from "../components/ui/Loader";
import { useToast } from "../context/ToastContext";

/**
 * Teacher Management page: responsive card grid with search + department filter...
 */
export default function Teachers() {
  const { data: teachers, loading } = useFetch(() => api.getTeachers(), []);
  const toast = useToast();

  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 250);
  const [deptFilter, setDeptFilter] = useState({
    value: "all",
    label: "All Departments",
  });

  const filtered = useMemo(() => {
    if (!teachers) return [];
    let rows = searchRows(teachers, debounced, [
      "name",
      "id",
      "subject",
      "email",
    ]);
    if (deptFilter.value !== "all")
      rows = rows.filter((t) => t.department === deptFilter.value);
    return rows;
  }, [teachers, debounced, deptFilter]);

  if (loading) return <PageLoader label="Loading teachers…" />;

  const deptOptions = [
    { value: "all", label: "All Departments" },
    ...DEPARTMENTS.map((d) => ({ value: d, label: d })),
  ];
  const isApprovedLeave = (teacher) => teacher?.status === "On Leave";

  return (
    <div>
      <PageHeader
        title="Teacher Management"
        description={`${teachers.length} faculty members across ${DEPARTMENTS.length} departments.`}
        breadcrumbs={[{ label: "Teachers" }]}
        action={
          <Button
            icon={FiPlus}
            onClick={() => toast.success("Add teacher (demo).")}
          >
            Add Teacher
          </Button>
        }
      />

      {/* Toolbar */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBox
          value={query}
          onChange={setQuery}
          placeholder="Search teachers by name or subject…"
          className="sm:max-w-sm"
        />
        <div className="sm:ml-auto">
          <Dropdown
            options={deptOptions}
            value={deptFilter}
            onChange={setDeptFilter}
            className="w-52"
            align="right"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No teachers found"
          description="Try adjusting your search or filter."
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
                    <p className="text-xs text-slate-400">{t.id}</p>
                  </div>
                </div>
                {isApprovedLeave(t) && <Badge tone="warning">On Leave</Badge>}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Badge tone="primary">{t.department}</Badge>
                <span className="inline-flex items-center gap-1 text-xs text-slate-500">
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
                {t.classes.map((c) => (
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
    </div>
  );
}
