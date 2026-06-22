const express = require("express");

console.log("✅ test.routes.js loaded");

const router = express.Router();

// Middleware
const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

// Controllers
const {
  candidateRoute,
  recruiterRoute,
  adminRoute,
} = require("../controllers/test.controller");

// Public Test Route
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Test Route Working",
  });
});

// Candidate Only
router.get(
  "/candidate",
  protect,
  authorizeRoles("candidate"),
  candidateRoute
);

// Recruiter Only
router.get(
  "/recruiter",
  protect,
  authorizeRoles("recruiter"),
  recruiterRoute
);

// Admin Only
router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  adminRoute
);

module.exports = router;