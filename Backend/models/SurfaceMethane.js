const mongoose = require('mongoose');

const SurfaceMethaneSchema = new mongoose.Schema({
    miningType: { type: String, required: true },
    surfaceCoalProduction: { type: Number, required: true },
    surfaceEmissionFactor: { type: Number, required: true },
    atmosphericConditions: {
        temperature: { type: Number, required: true },
        humidity: { type: Number, required: true },
        pressure: { type: Number, required: true },
    },
    totalMethane: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('SurfaceMethane', SurfaceMethaneSchema);
