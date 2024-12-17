const express = require("express");
const router = express.Router();
const existingSinkController = require("../controller/existingSinkController");

// Route to fetch ExistingSink data for a specific date
router.get("/existingsinks/date/:date", existingSinkController.fetchExistingSinkByDate);

// Route to fetch ExistingSink data within a date range
router.get("/existingsinks/date-range/:startDate/:endDate", existingSinkController.fetchExistingSinkByDateRange);

// Route to delete an ExistingSink entry by ID
router.delete("/existingsinks/:id", existingSinkController.deleteExistingSinkById);

module.exports = router;
