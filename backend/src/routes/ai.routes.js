const express = require("express");

const router = express.Router();

const protect = require(
  "../middleware/auth.middleware"
);

const authorizeRoles =
  require(
    "../middleware/role.middleware"
  );

const {
  analyzeCandidate,
  getAnalysis,
} = require(
  "../controllers/ai.controller"
);

// Generate AI Analysis
router.post(
  "/analyze/:applicationId",
  protect,
  authorizeRoles(
    "recruiter",
    "admin"
  ),
  analyzeCandidate
);

// Get Saved AI Analysis
router.get(
  "/analysis/:applicationId",
  protect,
  authorizeRoles(
    "recruiter",
    "admin"
  ),
  getAnalysis
);

module.exports = router;