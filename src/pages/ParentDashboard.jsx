import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { FiUser, FiBookOpen, FiClock, FiStar, FiFileText, FiBell, FiCoffee, FiArrowRight } from "react-icons/fi";

import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../services/api";
import { getTodaysMeal } from "../data/midDayMealData";
import PageHeader from "../components/common/PageHeader";
import Card from "../components/ui/Card";
import { PageLoader } from "../components/ui/Loader";

/**
 * Parent Dashboard — simple, clean view of child's academic snapshot.
 * Parents see attendance, grades, and recent notices at a glance.
 * Supports complete bilingual switching.
 */
export default function ParentDashboard() {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const [child, setChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const todayMeal = useMemo(() => getTodaysMeal(new Date(), language), [language]);

  useEffect(() => {
    async function fetchChildData() {
      try {
        const myChildren = await api.getMyChildren();
        let myChild = myChildren && myChildren.length > 0 ? myChildren[0] : null;

        if (!myChild) {
          const students = await api.getStudents();
          myChild = (students || []).find((s) => s.id === user?.childStudentId || s.studentId === user?.childStudentId) || (students && students[0]);
        }

        if (myChild) {
          setChild({
            name: myChild.name,
            className: myChild.className,
            section: myChild.section,
            rollNo: myChild.roll || myChild.rollNumber || 1,
            attendance: (myChild.attendance || 90) + "%",
            grade: (myChild.average || 80) >= 90 ? "A+" : (myChild.average || 80) >= 80 ? "A" : (myChild.average || 80) >= 70 ? "B" : (myChild.average || 80) >= 60 ? "C" : "D",
            rank: "1st",
          });
        }
      } catch (error) {
        console.error("Failed to fetch child data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchChildData();
  }, [user]);

  const recentNotices = [
    { id: 1, title: language === "gu" ? "વાર્ષિક રમતગમત સ્પર્ધા નોંધણી શરૂ" : "Annual Sports Meet Registration Open", date: "Oct 1, 2025" },
    { id: 2, title: language === "gu" ? "દિવાળી વેકેશન - શાળા ૨૦ થી ૨૫ ઓક્ટોબર બંધ રહેશે" : "Diwali Holidays – School Closed Oct 20–25", date: "Sep 28, 2025" },
    { id: 3, title: language === "gu" ? "વાલી-શિક્ષક બેઠક (PTM) ૫ નવેમ્બરના રોજ" : "Parent-Teacher Meeting on Nov 5", date: "Sep 25, 2025" },
  ];

  if (loading) {
    return <PageLoader label={t("common.loading")} />;
  }

  if (!child) {
    return (
      <div>
        <PageHeader title={t("parent.dashboardTitle")} description={t("parent.welcomeMsg")} />
        <Card>
          <p className="text-slate-500">{t("parent.noChildFound")}</p>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={t("parent.dashboardTitle")}
        description={`${t("parent.welcomeMsg")} (${user?.name?.split(" ")[0] || t("roles.parent")})`}
        breadcrumbs={[{ label: t("parent.dashboardTitle") }]}
      />

      {/* Child Info Card */}
      <Card className="mb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <FiUser className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-ink">{child.name}</h2>
            <p className="text-sm text-slate-500">
              {child.className} · {t("common.section")} {child.section} · {t("common.rollNo")} {child.rollNo}
            </p>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <FiClock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">{t("common.attendance")}</p>
              <p className="text-xl font-bold text-ink">{child.attendance}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FiStar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">{t("parent.overallGrade")}</p>
              <p className="text-xl font-bold text-ink">{child.grade}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <FiBookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">{t("parent.classRank")}</p>
              <p className="text-xl font-bold text-ink">{child.rank}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Mid-Day Meal Today's Snapshot Card (મધ્યાહન ભોજન) */}
      <Card className="mb-6 border border-blue-100 bg-gradient-to-r from-blue-50/70 via-slate-50 to-amber-50/40 p-5 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0f2b4d] text-amber-400 shadow-xs">
              <FiCoffee className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  {t("meal.pmPoshanScheme")}
                </span>
                <span className="rounded-md bg-amber-100 px-1.5 py-0.2 text-[10px] font-bold text-amber-900">
                  {t("meal.todaysMeal")}
                </span>
              </div>
              <h3 className="mt-0.5 text-sm font-bold text-[#0f2b4d]">
                {todayMeal.isSunday
                  ? todayMeal.holidayMessage
                  : `${todayMeal.day} • ${t("meal.snackHeader")}: ${todayMeal.snack} | ${t("meal.mealHeader")}: ${todayMeal.meal}`}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {todayMeal.isSunday
                  ? todayMeal.holidaySubMessage
                  : `${t("meal.mealTimePrefix")}: ${todayMeal.time}`}
              </p>
            </div>
          </div>

          <Link
            to="/parent/mid-day-meal"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0f2b4d] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-900 transition shrink-0"
          >
            <span>{t("meal.viewWeeklyMenu")}</span>
            <FiArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </Card>

      {/* Recent Notices */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiBell className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-ink">{t("parent.recentNotices")}</h3>
          </div>
          <Link
            to="/parent/notices"
            className="text-xs font-medium text-primary hover:text-primary-700"
          >
            {t("parent.viewAllNotices")}
          </Link>
        </div>
        <ul className="space-y-3">
          {recentNotices.map((n) => (
            <li
              key={n.id}
              className="flex items-start justify-between border-b border-hairline pb-3 last:border-0 last:pb-0"
            >
              <div className="flex items-start gap-2.5">
                <FiFileText className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <p className="text-sm text-ink">{n.title}</p>
              </div>
              <span className="shrink-0 text-xs text-slate-400">{n.date}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
