import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas / Local MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

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

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/exams", submissionRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/marks", markRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/leave", leaveRoutes);



// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 AI-IGMS Backend Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`📡 Health check endpoint: http://localhost:${PORT}/api/health`);
});
