import { useState, useMemo, useEffect } from "react";
import { FiUsers, FiMail, FiPhone } from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import { useFetch } from "../../hooks/useFetch";
import { api } from "../../services/api";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/ui/Card";
import { Table, Avatar, Badge } from "../../components/ui";
import { PageLoader } from "../../components/ui/Loader";

export default function MyClass() {
  const { user } = useAuth();
  const { data: students, loading } = useFetch(() => api.getStudents(), []);

  // Filter students to only show "Class 6, Section A" (Mocking teacher's assigned class)
  const myStudents = useMemo(() => {
    if (!students) return [];
    return students.filter((s) => s.className === "Class 6" && s.section === "A");
  }, [students]);

  if (loading) return <PageLoader label="Loading class roster..." />;

  const columns = [
    {
      key: "name",
      header: "Student",
      render: (r) => (
        <div className="flex items-center gap-3">
          <Avatar name={r.name} size="sm" />
          <div>
            <p className="font-medium text-ink">{r.name}</p>
            <p className="text-xs text-slate-400">Roll No: {r.roll}</p>
          </div>
        </div>
      ),
    },
    { 
      key: "attendance", 
      header: "Attendance", 
      align: "center",
      render: (r) => (
        <span className={r.attendance >= 85 ? "text-accent-600 font-medium" : "text-warning-600 font-medium"}>
          {r.attendance}%
        </span>
      )
    },
    { 
      key: "average", 
      header: "Average Grade", 
      align: "center",
      render: (r) => <span className="font-medium">{r.average}%</span>
    },
    {
      key: "guardian",
      header: "Guardian Contact",
      render: (r) => (
        <div>
          <p className="text-sm font-medium text-ink flex items-center gap-1.5"><FiUsers className="text-slate-400" /> {r.guardian}</p>
          <div className="flex gap-3 text-xs text-slate-500 mt-1">
            <span className="flex items-center gap-1"><FiPhone /> {r.phone}</span>
            <span className="flex items-center gap-1"><FiMail /> {r.email}</span>
          </div>
        </div>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="My Class Roster"
        description="Students enrolled in your primary class (Class 6 · Section A)."
        breadcrumbs={[{ label: "My Class" }]}
      />

      <Card padding={false} className="mt-6">
        <div className="flex items-center justify-between border-b border-hairline p-4">
          <h3 className="text-sm font-semibold text-ink">Class 6 · Section A</h3>
          <Badge tone="primary">{myStudents.length} Students</Badge>
        </div>
        <Table columns={columns} data={myStudents} rowKey={(r) => r.id} />
      </Card>
    </div>
  );
}
