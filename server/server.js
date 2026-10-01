import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import schoolRoutes from "./routes/schoolRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import markRoutes from "./routes/markRoutes.js";
import noticeRoutes from "./routes/noticeRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import parentRoutes from "./routes/parentRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import studentParentRoutes from "./routes/studentParentRoutes.js";
import timetableRoutes from "./routes/timetableRoutes.js";
import mealRoutes from "./routes/mealRoutes.js";
import holidayRoutes from "./routes/holidayRoutes.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --------------------
// Middleware
// --------------------
app.use(express.json());

const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.trim().replace(/\/$/, "") : "";
const allowedOrigins = [
  clientUrl,
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, server-to-server) or local dev
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
        callback(null, true);
      } else {
        // Allow deployed Vercel previews or configured client domain
        if (clientUrl && (origin === clientUrl || origin.endsWith(".vercel.app"))) {
          callback(null, true);
        } else {
          callback(new Error(`Origin ${origin} not allowed by CORS`));
        }
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());

// --------------------
// Health Check Route
// --------------------
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "AI-IGMS Backend API Server",
    timestamp: new Date().toISOString(),
  });
});

// --------------------
// API Routes
// --------------------
app.use("/api/auth", authRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/exams", submissionRoutes);

app.use("/api/schools", schoolRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/parents", parentRoutes);

app.use("/api/classes", classRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/student-parents", studentParentRoutes);

app.use("/api/attendance", attendanceRoutes);
app.use("/api/marks", markRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/holidays", holidayRoutes);
app.use("/api/ai", aiRoutes);

// --------------------
// Error Handling
// --------------------
app.use(notFound);
app.use(errorHandler);

// --------------------
// Database + Server Startup
// --------------------
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `🚀 AI-IGMS Backend Server running in ${
          process.env.NODE_ENV || "development"
        } mode on port ${PORT}`
      );
      console.log(`📡 Health check endpoint: http://0.0.0.0:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
