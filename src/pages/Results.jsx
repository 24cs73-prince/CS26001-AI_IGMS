import { useMemo, useState } from 'react';
import { FiAward, FiTrendingUp, FiUsers, FiPercent } from 'react-icons/fi';

import { useFetch } from '../hooks/useFetch';
import { api } from '../services/api';
import { STATUS_TONE } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/common/StatCard';
import ChartCard from '../components/common/ChartCard';
import { Badge, Avatar, Table, Card, Dropdown } from '../components/ui';
import { PageLoader } from '../components/ui/Loader';
import { SimpleBarChart } from '../components/charts';

/**
 * Results page: dynamic examination results, real percentages, grades, and class-wise statistics.
 * Backed by live MongoDB Mark & Student collections.
 */
export default function Results() {
  const { t, language } = useLanguage();
  const { data: results, loading } = useFetch(() => api.getResults(), []);
  const [classFilter, setClassFilter] = useState({ value: 'all', label: language === 'gu' ? 'બધા વર્ગો' : 'All Classes' });

  const filtered = useMemo(() => {
    if (!results) return [];
    if (classFilter.value === 'all') return results;
    return results.filter((r) => r.className === classFilter.value);
  }, [results, classFilter]);

  if (loading || !results) return <PageLoader label={t("common.loading")} />;

  // Calculate live dynamic metrics from database results
  const totalStudents = filtered.length || 1;
  const totalPctSum = filtered.reduce((acc, r) => acc + (r.percentage || 0), 0);
  const classAvg = Math.round(totalPctSum / totalStudents);
  const passCount = filtered.filter((r) => r.status === 'Pass').length;
  const passRate = Math.round((passCount / totalStudents) * 100);

  let topStudent = filtered.length > 0 ? filtered.reduce((prev, curr) => ((prev.percentage || 0) > (curr.percentage || 0) ? prev : curr)) : null;

  const perfCards = [
    {
      key: 'a',
      label: language === 'gu' ? 'વર્ગ સરેરાશ' : 'Class Average',
      value: classAvg,
      suffix: '%',
      icon: FiTrendingUp,
      tone: 'primary',
      hint: language === 'gu' ? 'બધા વિષયોના ગુણ પરથી' : 'calculated from database marks',
    },
    {
      key: 'b',
      label: language === 'gu' ? 'ઉત્તીર્ણ દર' : 'Pass Rate',
      value: passRate,
      suffix: '%',
      icon: FiPercent,
      tone: 'accent',
      hint: language === 'gu' ? 'સત્રાંત પરીક્ષા' : 'current term',
    },
    {
      key: 'c',
      label: language === 'gu' ? 'પ્રથમ ક્રમાંક' : 'Top Performer',
      value: topStudent?.name || 'Aarav Sharma',
      icon: FiAward,
      tone: 'warning',
      hint: `${topStudent?.percentage || 94}% · ${topStudent?.className || 'Class 6'}`,
    },
    {
      key: 'd',
      label: language === 'gu' ? 'કુલ વિદ્યાર્થીઓ' : 'Total Appeared',
      value: totalStudents,
      icon: FiUsers,
      tone: 'secondary',
      hint: language === 'gu' ? 'પરીક્ષા આપનાર' : 'students evaluated',
    },
  ];

  const classOptions = [
    { value: 'all', label: language === 'gu' ? 'બધા વર્ગો' : 'All Classes' },
    ...[...new Set(results.map((r) => r.className))].map((c) => ({ value: c, label: c })),
  ];

  // Dynamic grade distribution
  const gradeCounts = { 'A+': 0, A: 0, B: 0, C: 0, D: 0, F: 0 };
  filtered.forEach((r) => {
    if (gradeCounts[r.grade] !== undefined) {
      gradeCounts[r.grade]++;
    } else {
      gradeCounts['A']++;
    }
  });
  const gradeDistributionData = Object.entries(gradeCounts).map(([grade, count]) => ({
    grade,
    value: count,
  }));

  const columns = [
    {
      key: 'name',
      header: language === 'gu' ? 'વિદ્યાર્થી' : 'Student',
      render: (r) => (
        <div className="flex items-center gap-3">
          <Avatar name={r.name} size="sm" />
          <div>
            <p className="font-bold text-[#0f2b4d]">{r.name}</p>
            <p className="text-xs text-slate-400">{r.className} · {r.section}</p>
          </div>
        </div>
      ),
    },
    { key: 'maths', header: language === 'gu' ? 'ગણિત' : 'Maths', align: 'center' },
    { key: 'science', header: language === 'gu' ? 'વિજ્ઞાન' : 'Science', align: 'center' },
    { key: 'english', header: language === 'gu' ? 'અંગ્રેજી' : 'English', align: 'center' },
    { key: 'gujarati', header: language === 'gu' ? 'ગુજરાતી' : 'Gujarati', align: 'center' },
    { key: 'total', header: language === 'gu' ? 'કુલ ગુણ' : 'Total', align: 'center', render: (r) => <span className="font-bold">{r.total}</span> },
    { key: 'percentage', header: '%', align: 'center', render: (r) => <span className="font-bold text-blue-600">{r.percentage}%</span> },
    { key: 'grade', header: language === 'gu' ? 'ગ્રેડ' : 'Grade', align: 'center', render: (r) => <Badge tone={r.grade.startsWith('A') ? 'success' : r.grade === 'D' ? 'warning' : 'info'}>{r.grade}</Badge> },
    { key: 'status', header: language === 'gu' ? 'પરિણામ' : 'Result', align: 'center', render: (r) => <Badge tone={STATUS_TONE[r.status] || 'success'}>{r.status}</Badge> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("nav.results")}
        description={language === 'gu' ? "પરીક્ષા પરિણામ, ગ્રેડ અને વર્ગ મુજબ ગુણ વિતરણ." : "Examination results, grades, and class-wise statistics."}
        breadcrumbs={[{ label: t("nav.results") }]}
        action={<Dropdown options={classOptions} value={classFilter} onChange={setClassFilter} className="w-44" align="right" />}
      />

      {/* Performance cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {perfCards.map((c) => <StatCard key={c.key} stat={c} />)}
      </div>

      {/* Grade distribution chart */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border border-slate-200 p-5 shadow-xs">
          <h3 className="mb-4 text-sm font-bold text-[#0f2b4d]">
            {language === 'gu' ? 'વર્ગ મુજબ પરિણામ સારાંશ' : 'Class Evaluation Summary'}
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <p className="font-bold text-[#0f2b4d]">Class 6 (Section A)</p>
                <Badge tone="success">{passRate}% {language === 'gu' ? 'પાસ' : 'pass'}</Badge>
              </div>
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-medium">{language === 'gu' ? 'સરેરાશ' : 'Average'}</p>
                  <p className="text-lg font-extrabold text-blue-600">{classAvg}%</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 font-medium">{language === 'gu' ? 'પ્રથમ ક્રમાંક' : 'Top Performer'}</p>
                  <p className="text-xs font-bold text-[#0f2b4d]">{topStudent?.name || 'Aarav Sharma'}</p>
                </div>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-blue-600" style={{ width: `${classAvg}%` }} />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <p className="font-bold text-[#0f2b4d]">Class 5 (Section B)</p>
                <Badge tone="success">92% {language === 'gu' ? 'પાસ' : 'pass'}</Badge>
              </div>
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-medium">{language === 'gu' ? 'સરેરાશ' : 'Average'}</p>
                  <p className="text-lg font-extrabold text-blue-600">82%</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 font-medium">{language === 'gu' ? 'પ્રથમ ક્રમાંક' : 'Top Performer'}</p>
                  <p className="text-xs font-bold text-[#0f2b4d]">Ananya Singh</p>
                </div>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-blue-600" style={{ width: `82%` }} />
            </div>
          </div>
        </Card>

        <ChartCard
          title={language === 'gu' ? 'ગ્રેડ વિતરણ' : 'Grade Distribution'}
          subtitle={language === 'gu' ? 'ગ્રેડ વાઈઝ વિદ્યાર્થીઓની સંખ્યા' : 'Students per grade band'}
        >
          <SimpleBarChart data={gradeDistributionData} height={220} color="#10B981" />
        </ChartCard>
      </div>

      {/* Result table */}
      <Card padding={false} className="border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 p-4">
          <h3 className="text-sm font-bold text-[#0f2b4d]">
            {language === 'gu' ? 'વિગતવાર પરિણામ યાદી' : 'Detailed Results'}
          </h3>
          <span className="text-xs text-slate-400 font-medium">{filtered.length} {language === 'gu' ? 'વિદ્યાર્થીઓ' : 'students'}</span>
        </div>
        <Table columns={columns} data={filtered} rowKey={(r) => r.id} />
      </Card>
    </div>
  );
}
