const express = require("express");
const router = express.Router();
const environmentalReportController = require("../controller/environmentalReportController");

router.get("/daily", environmentalReportController.generateDailyEnvironmentalReport);
router.get("/weekly", environmentalReportController.generateWeeklyEnvironmentalReport);
router.get("/monthly", environmentalReportController.generateMonthlyEnvironmentalReport);
router.get("/yearly", environmentalReportController.generateYearlyEnvironmentalReport);

module.exports = router;