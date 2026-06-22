const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const testRoutes = require("./routes/test.routes");
const jobRoutes = require("./routes/job.routes");
const applicationRoutes = require("./routes/application.routes");
const resumeRoutes = require("./routes/resume.routes");
const aiRoutes = require("./routes/ai.routes");

console.log("✅ testRoutes imported");
console.log("✅ applicationRoutes imported");
console.log("✅ resumeRoutes imported");

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

// Test Routes
app.use("/api/v1/test", testRoutes);

// Job Routes
app.use("/api/v1/jobs", jobRoutes);

// Application Routes
app.use("/api/v1/applications", applicationRoutes);

// Resume Routes
app.use("/api/v1/resume", resumeRoutes);

app.use("/api/v1/ai", aiRoutes);

module.exports = app;