import { MealMenu } from "../models/MealMenu.js";
import { Holiday } from "../models/Holiday.js";
import { schoolScope } from "../middleware/authMiddleware.js";

/**
 * Get entire weekly mid-day meal menu (Monday to Saturday)
 */
export const getWeeklyMenu = async (req, res) => {
  try {
    const requestedSchoolId = typeof req.query.schoolId === "string" ? req.query.schoolId : undefined;
    const userSchoolId = req.user?.school_id || requestedSchoolId || "SCH-001";
    const variations = [userSchoolId, userSchoolId.toLowerCase(), userSchoolId.toUpperCase(), "SCH-001", "school-001"];

    const menuDocs = await MealMenu.find({
      schoolId: { $in: variations },
      isActive: true,
    }).sort({ dayOfWeek: 1, updatedAt: -1 });

    // Deduplicate so each dayOfWeek (1 to 6) only appears once
    const uniqueByDay = new Map();
    for (const doc of menuDocs) {
      if (!uniqueByDay.has(doc.dayOfWeek)) {
        uniqueByDay.set(doc.dayOfWeek, doc);
      }
    }

    const cleanMenu = Array.from(uniqueByDay.values()).sort((a, b) => a.dayOfWeek - b.dayOfWeek);
    res.json(cleanMenu);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch meal menu", error: error.message });
  }
};

/**
 * Get Today's Meal Snapshot (with holiday / Sunday verification)
 */
export const getTodayMeal = async (req, res) => {
  try {
    const today = new Date();
    const requestedSchoolId = typeof req.query.schoolId === "string" ? req.query.schoolId : undefined;
    const schoolId = req.user?.school_id || requestedSchoolId || "SCH-001";
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const dateStr = today.toISOString().split("T")[0];

    // Check if Sunday
    if (dayOfWeek === 0) {
      return res.json({
        isSunday: true,
        isHoliday: false,
        dayOfWeek: 0,
        day: { en: "Sunday", gu: "રવિવાર" },
        holidayMessage: { en: "School is closed today.", gu: "આજે શાળામાં રજા છે." },
        holidaySubMessage: {
          en: "Mid-Day Meal is unavailable today due to Sunday school holiday.",
          gu: "રવિવાર હોવાથી મધ્યાહન ભોજન બંધ રહેશે.",
        },
      });
    }

    // Check if holiday in DB
    const holiday = await Holiday.findOne({ schoolId, date: dateStr, isActive: true });
    if (holiday) {
      return res.json({
        isSunday: false,
        isHoliday: true,
        dayOfWeek,
        holidayTitle: holiday.title,
        holidayMessage: {
          en: `School is closed today (${holiday.title.en || holiday.title}).`,
          gu: `આજે શાળામાં રજા છે (${holiday.title.gu || holiday.title}).`,
        },
        holidaySubMessage: {
          en: "Mid-Day Meal is unavailable today due to official school holiday.",
          gu: "આજે શાળામાં સત્તાવાર રજા હોવાથી મધ્યાહન ભોજન બંધ રહેશે.",
        },
      });
    }

    // Fetch day meal from DB
    const meal = await MealMenu.findOne({ schoolId, dayOfWeek, isActive: true });
    if (!meal) {
      return res.status(404).json({ message: "Meal menu for today is not configured" });
    }

    res.json({
      isSunday: false,
      isHoliday: false,
      ...meal.toObject(),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch today's meal", error: error.message });
  }
};

/**
 * Create meal menu item
 */
export const createMealSlot = async (req, res) => {
  try {
    const schoolId = req.user.roleKey === "super_admin" ? req.body.schoolId : req.user.school_id;
    if (!schoolId) return res.status(400).json({ message: "A school must be assigned before creating a meal slot." });
    const slot = new MealMenu({
      ...req.body,
      schoolId,
    });
    await slot.save();
    res.status(201).json(slot);
  } catch (error) {
    res.status(500).json({ message: "Failed to create meal slot", error: error.message });
  }
};

/**
 * Update meal menu item
 */
export const updateMealSlot = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.user.roleKey !== "super_admin") delete updates.schoolId;
    const updated = await MealMenu.findOneAndUpdate(
      { _id: req.params.id, ...schoolScope(req, "schoolId") },
      updates,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Meal slot not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update meal slot", error: error.message });
  }
};

/**
 * Delete meal menu item
 */
export const deleteMealSlot = async (req, res) => {
  try {
    const deleted = await MealMenu.findOneAndDelete({ _id: req.params.id, ...schoolScope(req, "schoolId") });
    if (!deleted) return res.status(404).json({ message: "Meal slot not found" });
    res.json({ message: "Meal slot deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete meal slot", error: error.message });
  }
};
