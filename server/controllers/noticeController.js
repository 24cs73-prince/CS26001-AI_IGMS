import { Notice } from "../models/Notice.js";
import { applyQueryFeatures } from "../utils/queryHelper.js";

/**
 * @desc    Get All Notices
 * @route   GET /api/notices
 */
export const getNotices = async (req, res) => {
  try {
    const searchFields = ["title", "category", "content", "audience"];
    const result = await applyQueryFeatures(Notice, req.query, searchFields);
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

    const notice = await Notice.create({
      title,
      category: category || "General",
      audience: audience || "All",
      priority: priority || "Normal",
      content,
      publishedBy: req.user?.name || "School Principal Office",
    });

    res.status(201).json(notice);
  } catch (error) {
    console.error("Create Notice Error:", error);
    res.status(500).json({ message: "Server error creating notice." });
  }
};
