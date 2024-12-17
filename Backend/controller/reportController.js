const Electricity = require("../models/Electricity");
const FuelCombustion = require("../models/FuelCombustion");
const Shipping = require("../models/Shipping");
const Explosion = require("../models/Explosion");

// Helper function to calculate date ranges
const calculateDateRange = (days) => {
    const now = new Date();
    const pastDate = new Date();
    pastDate.setDate(now.getDate() - days);
    return { startDate: pastDate, endDate: now };
};

// Fetch data for a specific range
const fetchDataForRange = async (startDate, endDate) => {
    const query = { createdAt: { $gte: startDate, $lte: endDate } };
    const [electricity, fuelCombustion, shipping, explosion] = await Promise.all([
        Electricity.find(query).sort({ createdAt: 1 }),
        FuelCombustion.find(query).sort({ createdAt: 1 }),
        Shipping.find(query).sort({ createdAt: 1 }),
        Explosion.find(query).sort({ createdAt: 1 }),
    ]);
    return { electricity, fuelCombustion, shipping, explosion };
};

// Fetch data for the past day
exports.fetchPastDayData = async (req, res) => {
    console.log("Fetching past day data...");
    try {
        const { startDate, endDate } = calculateDateRange(1);
        const data = await fetchDataForRange(startDate, endDate);
        res.status(200).json({ range: "Past Day", data });
    } catch (error) {
        console.error("Error fetching past day data:", error);
        res.status(500).json({ error: "Failed to fetch past day data." });
    }
};

// Fetch data for the past week
exports.fetchPastWeekData = async (req, res) => {
    console.log("Fetching past week data...");
    try {
        const { startDate, endDate } = calculateDateRange(7);
        const data = await fetchDataForRange(startDate, endDate);
        res.status(200).json({ range: "Past Week", data });
    } catch (error) {
        console.error("Error fetching past week data:", error);
        res.status(500).json({ error: "Failed to fetch past week data." });
    }
};
