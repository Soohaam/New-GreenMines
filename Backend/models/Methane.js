const mongoose = require('mongoose');

// Combined schema for both Surface and Underground methane data
const MethaneSchema = new mongoose.Schema({
    miningType: { type: String, required: true }, // 'Surface' or 'Underground'
    surfaceCoalProduction: { type: Number }, // Only for Surface
    surfaceEmissionFactor: { type: Number }, // Only for Surface
    undergroundCoalProduction: { type: Number }, // Only for Underground
    undergroundEmissionFactor: { type: Number }, // Only for Underground
    ventilationEmissions: { type: Number }, // Only for Underground
    degasificationEmissions: { type: Number }, // Only for Underground
    atmosphericConditions: {
        temperature: { type: Number, required: true },
        humidity: { type: Number, required: true },
        pressure: { type: Number, required: true },
    },
    totalMethane: { type: Number, required: true }, // Common to both
    createdAt: {
        type: Date,
        default: Date.now
      }
}, { timestamps: true });

module.exports = mongoose.model('Methane', MethaneSchema);
