const express = require("express");
const router = express.Router();
const sinkController = require("../controller/sinkController"); // Import the controller

// Route to fetch sink data for a specific date
router.get("/sink/date/:date", sinkController.fetchSinkDataByDate);

// Route to fetch sink data within a date range
router.get("/sink/daterange/:startDate/:endDate", sinkController.fetchSinkDataByDateRange);

// Route to delete a sink entry by ID (only for the current day)
router.delete("/sink/:id", sinkController.deleteSinkById);

module.exports = router;
