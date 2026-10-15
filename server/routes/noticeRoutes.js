import express from "express";
import { getNotices, createNotice } from "../controllers/noticeController.js";
import { protect, protectRoles, requireSchool } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getNotices)
  .post(protect, requireSchool, protectRoles(["principal", "super_admin"]), createNotice);

export default router;
