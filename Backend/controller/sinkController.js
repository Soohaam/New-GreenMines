const Sink = require("../models/Sink"); // Assuming a Sink model exists

// Helper function to validate date format (YYYY-MM-DD)
const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/; // Regex for YYYY-MM-DD format
    if (!regex.test(dateString)) {
        return false;
    }
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
};

// Function to fetch sink data for a specific date
exports.fetchSinkDataByDate = async (req, res) => {
    try {
        const { date } = req.params;

        if (!isValidDate(date)) {
            return res.status(400).json({ error: "Invalid date format. Please use YYYY-MM-DD format." });
        }

        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        const sinkData = await Sink.find({ createdAt: { $gte: startDate, $lte: endDate } }).sort({ createdAt: 1 });

        res.status(200).json({
            date,
            sinkData,
        });
    } catch (error) {
        console.error("Error fetching sink data:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

// Function to fetch sink data within a date range
exports.fetchSinkDataByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.params;

        if (!isValidDate(startDate) || !isValidDate(endDate)) {
            return res.status(400).json({ error: "Invalid date format. Please use YYYY-MM-DD format." });
        }

        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);

        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        if (start > end) {
            return res.status(400).json({ error: "Start date must be before or equal to end date." });
        }

        const sinkData = await Sink.find({ createdAt: { $gte: start, $lte: end } }).sort({ createdAt: 1 });

        res.status(200).json({
            startDate,
            endDate,
            sinkData,
        });
    } catch (error) {
        console.error("Error fetching sink data:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

// Function to delete a sink entry by ID (only if created on the current day)
exports.deleteSinkById = async (req, res) => {
    try {
        const { id } = req.params;

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const entry = await Sink.findOne({ _id: id, createdAt: { $gte: startOfDay, $lte: endOfDay } });

        if (!entry) {
            return res.status(404).json({ error: "Sink entry not found for the current day." });
        }

        const deletedEntry = await Sink.findByIdAndDelete(id);

        res.status(200).json({ message: "Sink entry deleted successfully.", data: deletedEntry });
    } catch (error) {
        console.error("Error deleting sink entry:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};
