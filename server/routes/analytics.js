const express = require("express");
const { createDynamicLimiter } = require("../middleware/advancedRateLimiter");
const {
  recordPageView,
  getVisitorsSummary,
} = require("../controllers/analyticsController");

const router = express.Router();

const pageViewLimiter = createDynamicLimiter(
  60 * 1000, // 1 minute
  60,
  "Too many analytics requests, please slow down."
);

router.post("/page-view", pageViewLimiter, recordPageView);
router.get("/visitors-summary", pageViewLimiter, getVisitorsSummary);

module.exports = router;