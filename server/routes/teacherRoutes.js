import express from "express";
import { getTeachers, createTeacher } from "../controllers/teacherController.js";

const router = express.Router();

router.route("/").get(getTeachers).post(createTeacher);

export default router;
