const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const jobRoutes = require("./routes/job.routes");
const applicationRoutes = require("./routes/application.routes");
const resumeRoutes = require("./routes/resume.routes");
const aiRoutes = require("./routes/ai.routes");
const interviewRoutes = require("./routes/interview.routes");
const notificationRoutes = require("./routes/notification.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  res.send("HireMind AI API Running");
});

// Health Check Route
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server Healthy",
  });
});

// Auth Routes
app.use("/api/v1/auth", authRoutes);

// User Routes
app.use("/api/v1/users", userRoutes);

// Job Routes
app.use("/api/v1/jobs", jobRoutes);

// Application Routes
app.use("/api/v1/applications", applicationRoutes);

// Resume Routes
app.use("/api/v1/resume", resumeRoutes);

// AI Routes
app.use("/api/v1/ai", aiRoutes);

// Interview Routes
app.use("/api/v1/interviews", interviewRoutes);

app.use("/api/v1/notifications", notificationRoutes);

app.use("/api/v1/analytics", analyticsRoutes);

app.use("/api/v1/dashboard", dashboardRoutes);

module.exports = app;
