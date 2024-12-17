const ExistingSink = require("../models/ExistingSink"); // Assuming ExistingSink model is imported

// Helper function to validate date format (YYYY-MM-DD)
const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/; // Regex for YYYY-MM-DD format
    if (!regex.test(dateString)) {
        return false;
    }
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
};

// Function to fetch ExistingSink data for a specific date
exports.fetchExistingSinkByDate = async (req, res) => {
    try {
        const { date } = req.params;

        if (!isValidDate(date)) {
            return res.status(400).json({ error: "Invalid date format. Please use YYYY-MM-DD format." });
        }

        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        const existingSinkData = await ExistingSink.find({
            createdAt: { $gte: startDate, $lte: endDate },
        }).sort({ createdAt: 1 });

        res.status(200).json({
            date,
            existingSinkData,
        });
    } catch (error) {
        console.error("Error fetching ExistingSink data:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

// Function to fetch ExistingSink data within a date range
exports.fetchExistingSinkByDateRange = async (req, res) => {
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

        const existingSinkData = await ExistingSink.find({
            createdAt: { $gte: start, $lte: end },
        }).sort({ createdAt: 1 });

        res.status(200).json({
            startDate,
            endDate,
            existingSinkData,
        });
    } catch (error) {
        console.error("Error fetching ExistingSink data:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

// Function to delete an ExistingSink entry by ID (any date)
exports.deleteExistingSinkById = async (req, res) => {
    try {
        const { id } = req.params; // Get the ID from the URL parameter

        // Find and delete the ExistingSink entry by its ID
        const deletedEntry = await ExistingSink.findByIdAndDelete(id);

        // If no entry was found
        if (!deletedEntry) {
            return res.status(404).json({ error: "ExistingSink entry not found." });
        }

        // Return the success response with the deleted entry
        res.status(200).json({ message: "ExistingSink entry deleted successfully.", data: deletedEntry });
    } catch (error) {
        console.error("Error deleting ExistingSink entry:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};
