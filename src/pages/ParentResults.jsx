import { useState, useEffect } from "react";
import { FiAward, FiBookOpen, FiTrendingUp, FiCheckCircle } from "react-icons/fi";

import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import PageHeader from "../components/common/PageHeader";
import StatCard from "../components/common/StatCard";
import Card from "../components/ui/Card";
import { Badge, Table } from "../components/ui";
import { PageLoader } from "../components/ui/Loader";

export default function ParentResults() {
  const { user } = useAuth();
  const [result, setResult] = useState(null);
  const [childName, setChildName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResult() {
      try {
        const results = await api.getResults();
        const myResult = (results || []).find((r) => r.id === user?.childStudentId) || (results && results[0]);
        setResult(myResult);
        if (myResult) {
          setChildName(myResult.name || "Aarav Sharma");
        }
      } catch (error) {
        console.error("Failed to fetch results", error);
      } finally {
        setLoading(false);
      }
    }
    fetchResult();
  }, [user]);

  if (loading) return <PageLoader label="Loading child's results..." />;

  if (!result) {
    return (
      <div>
        <PageHeader title="Child's Results" description="View exam grades." />
        <Card>
          <p className="text-slate-500">No results found for your child.</p>
        </Card>
      </div>
    );
  }

  const stats = [
    { key: "percentage", label: "Percentage", value: `${result.percentage}%`, icon: FiTrendingUp, tone: "primary" },
    { key: "grade", label: "Overall Grade", value: result.grade, icon: FiAward, tone: "accent" },
    { key: "rank", label: "Class Rank", value: result.rank, icon: FiBookOpen, tone: "secondary" },
    { key: "status", label: "Status", value: result.status, icon: FiCheckCircle, tone: result.status === "Pass" ? "success" : "danger" },
  ];

  const subjectColumns = [
    { key: "subject", header: "Subject" },
    { key: "marks", header: "Marks Obtained", align: "center" },
    { key: "max", header: "Maximum Marks", align: "center" },
  ];

  const subjectData = [
    { id: 1, subject: "Mathematics", marks: result.maths, max: 100 },
    { id: 2, subject: "Science", marks: result.science, max: 100 },
    { id: 3, subject: "English", marks: result.english, max: 100 },
    { id: 4, subject: "Social Science", marks: result.social, max: 100 },
  ];

  return (
    <div>
      <PageHeader
        title={`${childName}'s Results`}
        description="Your child's performance in the recent term examinations."
        breadcrumbs={[{ label: "Child's Results" }]}
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.key} stat={s} />
        ))}
      </div>

      <Card padding={false} className="mt-6">
        <div className="flex items-center justify-between border-b border-hairline p-4">
          <h3 className="text-sm font-semibold text-ink">Subject-wise Breakdown</h3>
          <Badge tone="info">Term 1</Badge>
        </div>
        <Table columns={subjectColumns} data={subjectData} rowKey={(r) => r.id} />
        <div className="flex justify-between border-t border-hairline p-4 font-semibold text-ink">
          <span>Total</span>
          <span>{result.total} / 400</span>
        </div>
      </Card>
    </div>
  );
}
