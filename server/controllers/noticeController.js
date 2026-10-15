import { Notice } from "../models/Notice.js";
import { applyQueryFeatures } from "../utils/queryHelper.js";

/**
 * @desc    Get All Notices
 * @route   GET /api/notices
 */
export const getNotices = async (req, res) => {
  try {
    const searchFields = ["title", "category", "content", "audience"];
    const requestedSchoolId = typeof req.query.school_id === "string" ? req.query.school_id : undefined;
    const schoolId = req.user?.school_id || requestedSchoolId || "SCH-001";
    const result = await applyQueryFeatures(
      Notice,
      req.query,
      searchFields,
      { school_id: schoolId }
    );
    res.json(result.data);
  } catch (error) {
    console.error("Get Notices Error:", error);
    res.status(500).json({ message: "Server error fetching notices." });
  }
};

/**
 * @desc    Create Broadcast Notice
 * @route   POST /api/notices
 */
export const createNotice = async (req, res) => {
  try {
    const { title, category, audience, priority, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Notice title and content are required." });
    }
    const schoolId = req.user.roleKey === "super_admin" ? req.body.school_id : req.user.school_id;
    if (!schoolId) {
      return res.status(400).json({ message: "A school must be assigned before creating a notice." });
    }

    const notice = await Notice.create({
      title,
      category: category || "General",
      audience: audience || "All",
      priority: priority || "Normal",
      content,
      school_id: schoolId,
      publishedBy: req.user?.name || "School Principal Office",
    });

    res.status(201).json(notice);
  } catch (error) {
    console.error("Create Notice Error:", error);
    res.status(500).json({ message: "Server error creating notice." });
  }
};
