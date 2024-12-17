const express = require("express");
const router = express.Router();
const reportController = require("../controller/reportController");

// Route for past day data
router.get("/past-day", reportController.fetchPastDayData);

// Route for past week data
router.get("/past-week", reportController.fetchPastWeekData);

module.exports = router;
