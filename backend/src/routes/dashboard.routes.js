const express = require("express");

const router = express.Router();

const protect = require(
  "../middleware/auth.middleware"
);

const authorizeRoles = require(
  "../middleware/role.middleware"
);

const {
  getDashboardStats,
} = require(
  "../controllers/dashboard.controller"
);

router.get(
  "/stats",
  protect,
  authorizeRoles(
    "admin",
    "recruiter"
  ),
  getDashboardStats
);

module.exports = router;