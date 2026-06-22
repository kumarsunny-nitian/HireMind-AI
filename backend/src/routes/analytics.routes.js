const express =
 require("express");

const router =
 express.Router();

const protect =
 require(
 "../middleware/auth.middleware"
 );

const authorizeRoles =
 require(
 "../middleware/role.middleware"
 );

const {
 getDashboardSummary,
 getApplicationsPerJob,
 getHiringFunnel,
 getApplicationTrends
} = require(
 "../controllers/analytics.controller"
);

router.get(
 "/summary",
 protect,
 authorizeRoles(
  "recruiter",
  "admin"
 ),
 getDashboardSummary
);

router.get(
 "/applications-per-job",
 protect,
 authorizeRoles(
  "recruiter",
  "admin"
 ),
 getApplicationsPerJob
);

router.get(
 "/hiring-funnel",
 protect,
 authorizeRoles(
  "recruiter",
  "admin"
 ),
 getHiringFunnel
);

router.get(
 "/trends",
 protect,
 authorizeRoles(
  "recruiter",
  "admin"
 ),
 getApplicationTrends
);

module.exports = router;