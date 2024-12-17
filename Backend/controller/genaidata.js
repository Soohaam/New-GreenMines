const Electricity = require("../models/Electricity");
const FuelCombustion = require("../models/FuelCombustion");
const Shipping = require("../models/Shipping");
const Explosion = require("../models/Explosion");

// Helper function to validate date format (YYYY-MM-DD)
const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/; // Regex for YYYY-MM-DD format
    if (!regex.test(dateString)) {
        return false;
    }
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
};



// Function to fetch data from a specific model
const fetchModelData = async (Model, startDate, endDate) => {
    const query = {
        createdAt: {}
    };

    if (startDate) {
        query.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
        query.createdAt.$lte = new Date(endDate);
    }

    return await Model.find(query).sort({ createdAt: 1 });
};

exports.fetchDateRangeDatagenai = async (req, res) => {
    try {
        const { startDate, endDate } = req.body || req.params;

        if (!isValidDate(startDate) || !isValidDate(endDate)) {
            return res.status(400).json({ error: "Invalid date format. Please use YYYY-MM-DD." });
        }

        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);

        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        if (start > end) {
            return res.status(400).json({ error: "Start date must be before or equal to end date." });
        }

        // Fetch data across all models for the given date range
        const [electricityData, fuelData, shippingData, explosionData] = await Promise.all([
            Electricity.find({ createdAt: { $gte: start, $lte: end } }).sort({ createdAt: 1 }),
            FuelCombustion.find({ createdAt: { $gte: start, $lte: end } }).sort({ createdAt: 1 }),
            Shipping.find({ createdAt: { $gte: start, $lte: end } }).sort({ createdAt: 1 }),
            Explosion.find({ createdAt: { $gte: start, $lte: end } }).sort({ createdAt: 1 }),
        ]);

        // Log the response before sending it
        console.log("Fetched emissions data:", { electricityData, fuelData, shippingData, explosionData });

        return {
            electricity: electricityData,
            fuelCombustion: fuelData,
            shipping: shippingData,
            explosion: explosionData,
        }; // Return the response object
    } catch (error) {
        console.error("Error fetching data:", error.message);
        throw new Error("Error fetching data");
    }
};





