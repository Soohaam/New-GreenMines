const mongoose = require('mongoose');

const renewableSchema = new mongoose.Schema({
  solutionName: {
    type: String,
    required: true,
    unique: true,   // Ensuring no duplicate solution names
  },
  co2EmissionsPerDay: {
    type: Number,
    required: true,
  },
  selectedRenewable: {
    type: String,
    enum: ['Solar', 'Wind', 'Hydropower', 'HydrogenElectric'],
    required: true,
  },
  desiredReductionPercentage: {
    type: Number,
    required: true,
  },
  availableLand: {
    type: Number,   // Field to store available land in hectares
    required: true,
  },
  implementationCost: {
    type: Number,
  },
  targetCo2Reduction: {
    type: Number,
  },
  totalCo2ReductionPerDay: {
    type: Number,
  },
  landNeeded: {
    type: Number,
  },
  timeToAchieveNeutrality: {
    type: Number,
  },
  carbonCreditsSavedPerDay: {
    type: Number,
  },
  carbonCreditsSavedPerYear: {
    type: Number,
  },
  costOfCarbonCreditsSavedPerYear: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Renewable', renewableSchema);
