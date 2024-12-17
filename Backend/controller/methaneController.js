const Methane = require('../models/Methane');

// Function to calculate emissions for both mining types
exports.calculateEmissions = async (req, res) => {
    try {
        const {
            miningType,
            surfaceCoalProduction,
            surfaceEmissionFactor,
            undergroundCoalProduction,
            undergroundEmissionFactor,
            ventilationEmissions,
            degasificationEmissions,
            atmosphericConditions
        } = req.body;

        let totalMethane;

        if (miningType === 'Surface') {
            totalMethane = calculateSurfaceMethane({
                surfaceCoalProduction,
                surfaceEmissionFactor,
                atmosphericConditions
            });

            // Save to database
            const newEntry = new Methane({
                miningType,
                surfaceCoalProduction,
                surfaceEmissionFactor,
                atmosphericConditions,
                totalMethane,
            });
            await newEntry.save();
        } else if (miningType === 'Underground') {
            totalMethane = calculateUndergroundMethane({
                undergroundCoalProduction,
                undergroundEmissionFactor,
                ventilationEmissions,
                degasificationEmissions,
                atmosphericConditions
            });

            // Save to database
            const newEntry = new Methane({
                miningType,
                undergroundCoalProduction,
                undergroundEmissionFactor,
                ventilationEmissions,
                degasificationEmissions,
                atmosphericConditions,
                totalMethane,
            });
            await newEntry.save();
        } else {
            return res.status(400).json({ success: false, error: 'Invalid mining type' });
        }

        return res.status(200).json({
            success: true,
            data: { totalMethane },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'An error occurred while calculating emissions',
        });
    }
};

// Function to calculate methane emissions for surface mining
const calculateSurfaceMethane = ({ surfaceCoalProduction, surfaceEmissionFactor, atmosphericConditions }) => {
    const { temperature, humidity, pressure } = atmosphericConditions;

    // Adjust the emission factor based on atmospheric conditions
    const adjustedEmissionFactor = surfaceEmissionFactor
        * (1 + (temperature - 25) * 0.01) // Adjust for temperature (example: 1% increase per degree above 25°C)
        * (1 + humidity * 0.005)          // Adjust for humidity (example: 0.5% increase per 1% humidity)
        * (1 + pressure * 0.0001);         // Adjust for pressure (example: 0.01% increase per 1 Pa pressure)

    // Final methane emissions for surface mining
    return surfaceCoalProduction * adjustedEmissionFactor;
};

// Function to calculate methane emissions for underground mining
const calculateUndergroundMethane = ({
    undergroundCoalProduction,
    undergroundEmissionFactor,
    ventilationEmissions,
    degasificationEmissions,
    atmosphericConditions
}) => {
    const { temperature, humidity, pressure } = atmosphericConditions;

    // Adjust the emission factor based on atmospheric conditions
    const adjustedEmissionFactor = undergroundEmissionFactor
        * (1 + (temperature - 25) * 0.01) // Adjust for temperature (example: 1% increase per degree above 25°C)
        * (1 + humidity * 0.005)          // Adjust for humidity (example: 0.5% increase per 1% humidity)
        * (1 + pressure * 0.0001);         // Adjust for pressure (example: 0.01% increase per 1 Pa pressure)

    // Final methane emissions for underground mining
    return (undergroundCoalProduction * adjustedEmissionFactor) + ventilationEmissions + degasificationEmissions;
};
