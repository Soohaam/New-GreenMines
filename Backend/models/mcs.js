const mongoose = require('mongoose');

const MCSSchema = new mongoose.Schema({
  mineName: { type: String, required: true },
  annualMethaneEmissions: { type: Number, required: true }, // Methane emissions in tons
  mineSize: { type: String, required: true },
  mcsTechnology: { type: String, required: true },
  captureEfficiency: { type: Number, required: true }, // Efficiency (e.g., 0.9 for 90%)
  capturedMethane: { type: Number, required: true }, // Captured methane in tons
  co2Equivalent: { type: Number, required: true }, // CO2 equivalent for carbon credit calculation
  installationCostPerTon: { type: Number, default: 3000 }, // ₹ per ton captured
  annualMaintenanceCost: { type: Number, default: 10000000 }, // Annual cost in ₹
  methaneMarketPrice: { type: Number, default: 500 }, // ₹ per ton of captured methane (sale of methane as gas)
  carbonCreditPrice: { type: Number, default: 1500 }, // ₹ per ton of carbon credits
  installationCost: { type: Number, required: true }, // Total installation cost
  maintenanceCost: { type: Number, required: true }, // Annual maintenance cost
  carbonCreditRevenue: { type: Number, required: true }, // Revenue from credits
  methaneRevenue: { type: Number, required: true }, // Revenue from selling captured methane
  totalCostForFirstYear: { type: Number, required: true }, // First-year total cost
  totalRevenue: { type: Number, required: true }, // Total revenue (credits + methane sales)
  netProfitForFirstYear: { type: Number, required: true }, // First-year profit/loss
  annualNetProfit: { type: Number, required: true }, // Annual net profit (after year 1)
  totalProfitForTenYears: { type: Number, required: true }, // 10-year total profit
});

module.exports = mongoose.model('MCS', MCSSchema);
