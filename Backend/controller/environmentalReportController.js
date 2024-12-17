const { generateEnvironmentalReportContent } = require('../services/geminiReportService');
const Electricity = require("../models/Electricity");
const FuelCombustion = require("../models/FuelCombustion");
const Shipping = require("../models/Shipping");
const Explosion = require("../models/Explosion");
const Sink = require("../models/ExistingSink");
const ExistingSink = require("../models/ExistingSink");
const coalEmission = require('../models/coalEmission');


const calculateDateRange = (days) => {
    const now = new Date();
    const pastDate = new Date();
    pastDate.setDate(now.getDate() - days);
    return { startDate: pastDate, endDate: now };
};

const fetchDataForRange = async (startDate, endDate) => {
    const query = { createdAt: { $gte: startDate, $lte: endDate } };
    const [electricity, fuelCombustion, shipping, explosion, coal, sinks] = await Promise.all([
        Electricity.find(query).sort({ createdAt: 1 }),
        FuelCombustion.find(query).sort({ createdAt: 1 }),
        Shipping.find(query).sort({ createdAt: 1 }),
        Explosion.find(query).sort({ createdAt: 1 }),
        coalEmission.find(query).sort({ createdAt: 1 }),
        ExistingSink.find(query).sort({ createdAt: 1 })
    ]);

    
    // Calculate totals
    const calculateTotal = (data) => 
        data.reduce((sum, item) => sum + (item.emissions || 0), 0);

    const totalEmissions = {
        electricity: calculateTotal(electricity),
        explosion: calculateTotal(explosion),
        fuelCombustion: calculateTotal(fuelCombustion),
        shipping: calculateTotal(shipping),
        coal: calculateTotal(coal),
        total: 0
    };
// Calculate total emissions
totalEmissions.total = Object.values(totalEmissions).reduce((a, b) => a + b, 0);

const totalAbsorption = sinks.reduce((sum, item) => sum + (item.carbonAbsorbed || 0), 0);

return {
    electricity,
    explosion,
    fuelCombustion,
    shipping,
    coal,
    sinks,
    summary: {
        totalEmissions,
        totalAbsorption,
        netEmissions: totalEmissions.total - totalAbsorption
    }
};
};

exports.generateDailyEnvironmentalReport = async (req, res) => {
    try {
        const { startDate, endDate } = calculateDateRange(1);
        const data = await fetchDataForRange(startDate, endDate);
        const report = await generateEnvironmentalReportContent(data);
        
        res.status(200).json({
            success: true,
            range: "Daily",
            report,
            data,
            timestamp: new Date()
        });
    } catch (error) {
        console.error("Error generating daily environmental report:", error);
        res.status(500).json({
            success: false,
            error: "Failed to generate daily environmental report"
        });
    }
};

exports.generateWeeklyEnvironmentalReport = async (req, res) => {
    try {
        const { startDate, endDate } = calculateDateRange(7);
        const data = await fetchDataForRange(startDate, endDate);
        const report = await generateEnvironmentalReportContent(data);
        
        res.status(200).json({
            success: true,
            range: "Weekly",
            report,
            data,
            timestamp: new Date()
        });
    } catch (error) {
        console.error("Error generating weekly environmental report:", error);
        res.status(500).json({
            success: false,
            error: "Failed to generate weekly environmental report"
        });
    }
};

exports.generateMonthlyEnvironmentalReport = async (req, res) => {
    try {
        const { startDate, endDate } = calculateDateRange(30); // Adjusting to get the last month
        const data = await fetchDataForRange(startDate, endDate);
        const report = await generateEnvironmentalReportContent(data);
        
        res.status(200).json({
            success: true,
            range: "Monthly",
            report,
            data,
            timestamp: new Date()
        });
    } catch (error) {
        console.error("Error generating monthly environmental report:", error);
        res.status(500).json({
            success: false,
            error: "Failed to generate monthly environmental report"
        });
    }
};

exports.generateYearlyEnvironmentalReport = async (req, res) => {
    try {
        const now = new Date();
        const pastDate = new Date();
        pastDate.setFullYear(now.getFullYear() - 1); // Set to one year ago

        const startDate = pastDate;
        const endDate = now;

        const data = await fetchDataForRange(startDate, endDate);
        const report = await generateEnvironmentalReportContent(data);
        
        res.status(200).json({
            success: true,
            range: "Yearly",
            report,
            data,
            timestamp: new Date()
        });
    } catch (error) {
        console.error("Error generating yearly environmental report:", error);
        res.status(500).json({
            success: false,
            error: "Failed to generate yearly environmental report"
        });
    }
};