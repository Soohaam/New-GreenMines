const mongoose = require('mongoose');

const EvCalculationSchema = new mongoose.Schema({
  vehicleType: {
    type: String,
    required: true,
    enum: ['Dumper Truck', 'Excavator', 'Loader', 'Haul Truck', 'Drill Machine']
  },
  numberOfVehicles: {
    type: Number,
    required: true,
    min: 1
  },
  dailyHours: {
    type: Number,
    required: true,
    min: 1,
    max: 24
  },
  fuelType: {
    type: String,
    required: true,
    enum: ['Diesel', 'Petrol']
  },
  fuelPrice: {
    type: Number,
    required: true,
    min: 0
  },
  carbonCreditPrice: {
    type: Number,
    default: 20,
    min: 0
  },
  workingDaysPerYear: {
    type: Number,
    default: 250,
    min: 1
  },
  calculationResults: {
    emissionSavings: Number,
    percentageReduction: Number,
    dailyFuelCostSavings: Number,
    annualFuelCostSavings: Number,
    carbonCreditsEarned: Number,
    carbonCreditsRevenue: Number
  },
  calculationDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('EvCalculation', EvCalculationSchema);