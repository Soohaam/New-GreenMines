const mongoose = require('mongoose');

const fuelCombustionSchema = new mongoose.Schema({
  fuel: {
    type: String,
    required: true
  },
  quantityFuelConsumed: {
    type: Number,
    required: true
  },
  result: {
    type: Object,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const FuelCombustion = mongoose.model('FuelCombustion', fuelCombustionSchema);

module.exports = FuelCombustion;
