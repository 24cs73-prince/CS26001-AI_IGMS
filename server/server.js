import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { seedExamsIfEmpty } from "./config/seedExams.js";
import authRoutes from "./routes/authRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import { seedAllData } from "./config/seedAllData.js";
import { syncLocalToAtlas } from "./config/migrateLocalToAtlas.js";
import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas / Local MongoDB
connectDB().then(async () => {
  const atlasUri = process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI;
  if (atlasUri && !atlasUri.includes("<db_password>")) {
    await syncLocalToAtlas(atlasUri);
  }
  seedExamsIfEmpty();
  seedAllData();
});

const app = express();

// Middleware
app.use(express.json());
// Enable CORS for all local development origins (port 3000, 3001, 5000)
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());

// Healthcheck Route
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "AI-IGMS Backend API Server",
    timestamp: new Date().toISOString(),
  });
});

import schoolRoutes from "./routes/schoolRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import markRoutes from "./routes/markRoutes.js";
import noticeRoutes from "./routes/noticeRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/exams", submissionRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/marks", markRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);



// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 AI-IGMS Backend Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`📡 Health check endpoint: http://localhost:${PORT}/api/health`);
});
