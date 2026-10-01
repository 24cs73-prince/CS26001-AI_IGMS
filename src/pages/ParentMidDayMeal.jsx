import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiClock,
  FiCalendar,
  FiCheckCircle,
  FiCoffee,
  FiInfo,
  FiHeart,
  FiAward,
  FiAlertCircle,
  FiSun,
  FiRefreshCw,
} from "react-icons/fi";
import PageHeader from "../components/common/PageHeader";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../services/api";

/**
 * Mid-Day Meal Menu Page (મધ્યાહન ભોજન મેનુ)
 * Official Gujarat Government School Nutrition & Mid-Day Meal Schedule.
 * 100% Database-backed via /api/meals/weekly and /api/meals/today with complete Gujarati/English bilingual switching.
 */
export default function ParentMidDayMeal() {
  const { language, t, isGu } = useLanguage();
  const currentDayIndex = new Date().getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  const [weeklyMenu, setWeeklyMenu] = useState([]);
  const [todayInfo, setTodayInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMealData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [meals, today] = await Promise.all([
        api.getMeals(language),
        api.getTodayMeal(language),
      ]);
      setWeeklyMenu(Array.isArray(meals) ? meals : []);
      setTodayInfo(today || null);
    } catch (err) {
      console.error("Meal API fetch error:", err);
      setError(
        isGu
          ? "મધ્યાહન ભોજન ડેટા લોડ કરવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો."
          : "Failed to load mid-day meal data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMealData();
  }, [language]);


  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={t("meal.pageTitle")}
        description={t("meal.pageDescription")}
        breadcrumbs={[
          { label: t("nav.parentPortal") },
          { label: t("meal.pageTitle") },
        ]}
        action={
          <Badge tone="primary" className="px-3 py-1 text-xs font-bold">
            {t("meal.pmPoshanScheme")}
          </Badge>
        }
      />

      {/* Loading State */}
      {loading && (
        <Card className="p-12 text-center border border-slate-200">
          <div className="flex flex-col items-center justify-center space-y-3">
            <FiRefreshCw className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-semibold text-slate-600">
              {isGu ? "મધ્યાહન ભોજન મેનુ લોડ થઈ રહ્યું છે..." : "Loading mid-day meal schedule..."}
            </p>
          </div>
        </Card>
      )}

      {/* Error State */}
      {!loading && error && (
        <Card className="p-8 text-center border border-rose-200 bg-rose-50/50">
          <div className="flex flex-col items-center justify-center space-y-3">
            <FiAlertCircle className="h-8 w-8 text-rose-500" />
            <p className="text-sm font-bold text-rose-800">{error}</p>
            <Button size="sm" tone="primary" onClick={loadMealData} className="gap-2">
              <FiRefreshCw className="h-4 w-4" />
              {isGu ? "ફરી પ્રયાસ કરો" : "Retry"}
            </Button>
          </div>
        </Card>
      )}

      {/* Today's Meal Highlight Card */}
      {!loading && !error && todayInfo && (
        todayInfo.isSunday ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 via-orange-50/50 to-amber-50 p-5 shadow-xs"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-700">
                <FiAlertCircle className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-amber-200/80 px-2 py-0.5 text-[11px] font-bold text-amber-900">
                    {t("meal.todaysMeal")} • {todayInfo.day}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-amber-950">
                  {todayInfo.holidayMessage || (isGu ? "રવિવાર - રજા" : "Sunday - Holiday")}
                </h2>
                <p className="text-xs text-amber-800 font-medium">
                  {todayInfo.holidaySubMessage || (isGu ? "આજે શાળામાં રજા હોવાથી મધ્યાહન ભોજન ઉપલબ્ધ નથી." : "Mid-Day Meal is not served on Sundays.")}
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-blue-200 bg-gradient-to-r from-[#0f2b4d] via-[#163d6b] to-blue-900 p-6 text-white shadow-md sm:p-7"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-3 flex-1 min-w-[280px]">
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/20 px-3.5 py-1 text-xs font-bold text-amber-300 backdrop-blur-xs border border-amber-400/30">
                  <FiCoffee className="h-4 w-4" />
                  {t("meal.todaysMeal")} • {todayInfo.day}
                </div>

                {/* Snack and Main Meal Split */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-1">
                  <div className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/10">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                      <FiSun className="h-4 w-4" />
                      <span>{t("meal.snackHeader")}</span>
                    </div>
                    <p className="mt-1 text-base font-bold text-white leading-snug">
                      {todayInfo.snack || (isGu ? "પૌષ્ટિક નાસ્તો" : "Nutritious Snack")}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/15 p-3.5 backdrop-blur-xs border border-white/15">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                      <FiAward className="h-4 w-4" />
                      <span>{t("meal.mealHeader")}</span>
                    </div>
                    <p className="mt-1 text-base font-bold text-white leading-snug">
                      {todayInfo.meal || (isGu ? "ગરમ ભોજન" : "Hot Cooked Meal")}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-blue-100">
                  <span className="inline-flex items-center gap-1.5 font-semibold bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs">
                    <FiClock className="h-4 w-4 text-amber-300" />
                    {t("meal.mealTimePrefix")}: <b className="text-white">{todayInfo.time}</b>
                  </span>
                  {todayInfo.tag && (
                    <span className="inline-flex items-center gap-1.5 font-semibold bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs">
                      <FiHeart className="h-4 w-4 text-rose-300" />
                      {todayInfo.tag}
                    </span>
                  )}
                </div>
              </div>

              <div className="hidden lg:flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-white/10 p-3 backdrop-blur-xs border border-white/15 text-amber-300">
                <FiHeart className="h-12 w-12 text-amber-400 animate-pulse" />
              </div>
            </div>
          </motion.div>
        )
      )}

      {/* Official Table View (વાર | નાસ્તો | પ્રથમ ભોજન | સમય) */}
      {!loading && !error && weeklyMenu.length > 0 && (
        <>
          <Card className="overflow-hidden p-0 border border-slate-200 shadow-sm">
            <div className="border-b border-slate-100 bg-[#0f2b4d] px-6 py-4 text-white">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-extrabold text-white">
                {t("meal.detailedTable")}
              </h3>
              <p className="text-xs text-blue-200 mt-0.5">
                {t("meal.detailedSub")}
              </p>
            </div>
            <span className="rounded-lg bg-amber-400 px-2.5 py-1 text-[11px] font-black text-[#0f2b4d]">
              {t("meal.weeklyMenu")}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-amber-50/60 text-slate-800 font-extrabold text-xs">
                <th className="py-3.5 px-6 font-black text-[#0f2b4d] w-[15%]">{t("meal.dayHeader")}</th>
                <th className="py-3.5 px-6 font-black text-[#0f2b4d] w-[35%]">{t("meal.snackHeader")}</th>
                <th className="py-3.5 px-6 font-black text-[#0f2b4d] w-[35%]">{t("meal.mealHeader")}</th>
                <th className="py-3.5 px-6 font-black text-[#0f2b4d] text-center w-[15%]">{t("meal.timeHeader")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {weeklyMenu.map((row) => {
                const isToday = row.dayIndex === currentDayIndex;

                return (
                  <tr
                    key={row.dayIndex}
                    className={`transition-colors ${
                      isToday
                        ? "bg-amber-100/50 font-semibold"
                        : "hover:bg-slate-50/80"
                    }`}
                  >
                    <td className="py-4 px-6 font-extrabold text-ink align-top">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                            isToday ? "bg-primary ring-2 ring-primary/30" : "bg-slate-300"
                          }`}
                        />
                        <span className="text-sm font-bold">{row.day}</span>
                      </div>
                      {isToday && (
                        <span className="mt-1.5 inline-block rounded-md bg-primary px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                          {t("meal.isToday")}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-slate-800 font-semibold align-top text-xs leading-relaxed">
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                          •
                        </span>
                        <span>{row.snack}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-[#0f2b4d] font-bold align-top text-xs leading-relaxed">
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          ✓
                        </span>
                        <span>{row.meal}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-center align-top">
                      <span className="inline-block rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-[#0f2b4d]">
                        {row.time}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Weekly Menu Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <FiCalendar className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold text-ink">
            {t("meal.weeklyMenu")}
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {weeklyMenu.map((item) => {
            const isToday = item.dayIndex === currentDayIndex;

            return (
              <motion.div
                key={item.dayIndex}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.15 }}
              >
                <Card
                  className={`relative h-full transition-all ${
                    isToday
                      ? "border-2 border-primary bg-primary/5 shadow-md ring-2 ring-primary/20"
                      : "border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs"
                  }`}
                >
                  {/* Header with Day and Highlight Badge */}
                  <div className="flex items-center justify-between border-b border-hairline pb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-black ${
                          isToday
                            ? "bg-primary text-white shadow-xs"
                            : "bg-[#0f2b4d] text-white"
                        }`}
                      >
                        {item.day.charAt(0)}
                      </span>
                      <h4 className="text-base font-bold text-[#0f2b4d]">{item.day}</h4>
                    </div>

                    {isToday ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                        <FiCheckCircle className="h-3 w-3" />
                        {t("meal.isToday")}
                      </span>
                    ) : (
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                        {item.tag}
                      </span>
                    )}
                  </div>

                  {/* Snack & Meal Details */}
                  <div className="mt-3.5 space-y-3">
                    {/* નાસ્તો */}
                    <div className="rounded-xl bg-amber-50/70 p-3 border border-amber-200/60">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-800">
                        <FiSun className="h-3.5 w-3.5" />
                        <span>{t("meal.snackHeader")}</span>
                      </div>
                      <p className="mt-1 text-xs font-bold text-amber-950 leading-snug">
                        {item.snack}
                      </p>
                    </div>

                    {/* પ્રથમ ભોજન */}
                    <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-primary">
                        <FiAward className="h-3.5 w-3.5" />
                        <span>{t("meal.mealHeader")}</span>
                      </div>
                      <p className="mt-1 text-xs font-bold text-ink leading-snug">
                        {item.meal}
                      </p>
                    </div>

                    {/* સમય */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-hairline">
                      <span className="font-semibold text-slate-400">{t("meal.timeHeader")}:</span>
                      <span className="font-bold text-[#0f2b4d] flex items-center gap-1">
                        <FiClock className="h-3 w-3 text-primary" />
                        {item.time}
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
      </>
      )}

      {/* Empty State when loaded but no menu */}
      {!loading && !error && weeklyMenu.length === 0 && (
        <Card className="p-8 text-center border border-slate-200">
          <p className="text-sm font-semibold text-slate-600">
            {isGu ? "કોઈ મધ્યાહન ભોજન મેનુ ઉપલબ્ધ નથી." : "No mid-day meal schedule available."}
          </p>
        </Card>
      )}

      {/* Nutrition & Hygiene Standards Note */}
      <Card className="border border-emerald-200 bg-emerald-50/40 p-5 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <FiInfo className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-emerald-950">
              {t("meal.hygieneTitle")}
            </h4>
            <ul className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2 text-xs text-emerald-900 font-medium">
              <li className="flex items-center gap-2">
                <FiCheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>{t("meal.hygiene1")}</span>
              </li>
              <li className="flex items-center gap-2">
                <FiCheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>{t("meal.hygiene2")}</span>
              </li>
              <li className="flex items-center gap-2">
                <FiCheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>{t("meal.hygiene3")}</span>
              </li>
              <li className="flex items-center gap-2">
                <FiCheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>{t("meal.hygiene4")}</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
