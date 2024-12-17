const mongoose = require('mongoose');

const UndergroundMethaneSchema = new mongoose.Schema({
    miningType: { type: String, required: true },
    undergroundCoalProduction: { type: Number, required: true },
    undergroundEmissionFactor: { type: Number, required: true },
    ventilationEmissions: { type: Number, required: true },
    degasificationEmissions: { type: Number, required: true },
    atmosphericConditions: {
        temperature: { type: Number, required: true },
        humidity: { type: Number, required: true },
        pressure: { type: Number, required: true },
    },
    totalMethane: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('UndergroundMethane', UndergroundMethaneSchema);
