const mongoose = require('mongoose');

// Create a schema for the CCS data
const ccsSchema = new mongoose.Schema({
  mineName: {
    type: String,
    required: true
  },
  annualEmissions: {
    type: Number,
    required: true
  },
  mineSize: {
    type: String,
    required: true
  },
  ccsTechnology: {
    type: String,
    required: true
  },
  installationCostPerTon: {
    type: Number,
    required: true
  },
  annualMaintenanceCost: {
    type: Number,
    required: true
  },
  captureEfficiency: {
    type: Number,
    required: true
  },
  capturedCO2: {
    type: Number,
    required: true
  },
  installationCost: {
    type: Number,
    required: true
  },
  maintenanceCost: {
    type: Number,
    required: true
  },
  carbonCreditRevenue: {
    type: Number,
    required: true
  },
  totalCostForFirstYear: {
    type: Number,
    required: true
  },
  totalRevenueForFirstYear: {
    type: Number,
    required: true
  },
  netProfitForFirstYear: {
    type: Number,
    required: true
  },
  annualNetProfit: {
    type: Number,
    required: true
  },
  totalProfitForTenYears: {
    type: Number,
    required: true
  }
}, { timestamps: true });

// Create and export the CCS model
const CCS = mongoose.model('CCS', ccsSchema);
module.exports = CCS;
