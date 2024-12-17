const mongoose = require('mongoose');

const ZoneSchema = new mongoose.Schema({
  name: String,
  description: String,
  coordinates: {
    type: {
      type: String,
      enum: ['Polygon'],
      required: true,
    },
    coordinates: {
      type: [[[Number]]], // Array of arrays of arrays of numbers
      required: true,
    },
  },
  degradationLevel: {
    type: Number,
    min: 0,
    max: 10,
  },
  recommendedActions: [{
    type: String,
    enum: ['Afforestation', 'Soil Restoration', 'Water Body Restoration', 'Native Species Introduction'],
  }],
  carbonSinkPotential: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Zone', ZoneSchema);
