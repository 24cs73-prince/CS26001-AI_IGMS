import { useState, useEffect } from "react";
import { FiClock, FiCalendar, FiCheckCircle } from "react-icons/fi";

import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import PageHeader from "../components/common/PageHeader";
import StatCard from "../components/common/StatCard";
import Card from "../components/ui/Card";
import { Badge, Table } from "../components/ui";
import { PageLoader } from "../components/ui/Loader";
import { STATUS_TONE } from "../constants/theme";

export default function ParentAttendance() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [childName, setChildName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAttendance() {
      try {
        const data = await api.getAttendance();
        const myRecord = (data.records || []).find((r) => r.id === user?.childStudentId) || (data.records && data.records[0]);
        
        if (myRecord) {
          setChildName(myRecord.name || "Aarav Sharma");
          setRecords([
            { ...myRecord, date: "2026-08-13" },
            { ...myRecord, date: "2026-08-12", status: "Present", inTime: "07:55" },
            { ...myRecord, date: "2026-08-11", status: "Present", inTime: "08:01" },
            { ...myRecord, date: "2026-08-10", status: "Absent", inTime: "—" },
            { ...myRecord, date: "2026-08-09", status: "Present", inTime: "07:50" },
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch attendance", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAttendance();
  }, [user]);

  if (loading) return <PageLoader label="Loading child's attendance..." />;

  const stats = [
    { key: "total", label: "Total Days", value: "45", icon: FiCalendar, tone: "secondary" },
    { key: "present", label: "Days Present", value: "42", icon: FiCheckCircle, tone: "success" },
    { key: "percentage", label: "Attendance %", value: "93.3%", icon: FiClock, tone: "primary" },
  ];

  const columns = [
    { key: "date", header: "Date" },
    { key: "inTime", header: "In-Time", align: "center" },
    { key: "markedBy", header: "Marked By" },
    { 
      key: "status", 
      header: "Status", 
      align: "center",
      render: (r) => <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge> 
    },
  ];

  return (
    <div>
      <PageHeader
        title={`${childName || "Child"}'s Attendance`}
        description="Track your child's daily attendance history and overall percentage."
        breadcrumbs={[{ label: "Child's Attendance" }]}
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <StatCard key={s.key} stat={s} />
        ))}
      </div>

      <Card padding={false} className="mt-6">
        <div className="flex items-center justify-between border-b border-hairline p-4">
          <h3 className="text-sm font-semibold text-ink">Recent History</h3>
        </div>
        {records.length > 0 ? (
          <Table columns={columns} data={records} rowKey={(r) => r.date} />
        ) : (
          <div className="p-4 text-slate-500">No attendance records found.</div>
        )}
      </Card>
    </div>
  );
}
