const mongoose = require('mongoose');

// Mongoose Schema for Carbon Sink Calculation
const landRequiredSchema = new mongoose.Schema({
  targetCarbonSequestration: {
    type: Number,
    required: true,
    min: 0,
    description: 'Annual target carbon dioxide sequestration (tCO₂/year)'
  },
  landType: {
    type: String,
    enum: ['forest', 'mangrove', 'grassland', 'wetland', 'agroforestry'],
    required: true
  },
  forestType: {
    type: String,
    enum: ['tropical', 'temperate', 'boreal'],
    required: function () { return this.landType === 'forest'; }
  },
  projectDuration: {
    type: Number,
    default: 20,
    min: 1,
    description: 'Project duration in years'
  },
  landSuitabilityFactor: {
    type: Number,
    default: 1,
    min: 0,
    max: 1,
    description: 'Land productivity and suitability factor (0-1)'
  },
  calculationResults: {
    requiredLand: Number,
    totalCarbonSequestered: Number,
    landUtilizationEfficiency: Number
  },
  calculationDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('landRequired', landRequiredSchema);
