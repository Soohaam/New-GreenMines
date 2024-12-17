const mongoose = require('mongoose');

const coalEmissionSchema = new mongoose.Schema({
  coalType: {
    type: String,
    required: true,
    enum: ['Lignite', 'Sub-bituminous', 'Bituminous', 'Anthracite']
  },
  coalConsumption: {
    type: Number,
    required: true
  },
  emissionFactor: {
    type: Number,
    required: true
  },
  carbonOxidationFactor: {
    type: Number,
    default: 0.99
  },
  co2Emissions: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const CoalEmission = mongoose.model('CoalEmission', coalEmissionSchema);

module.exports = CoalEmission;
