const CarbonSink = require('../models/landRequired'); // Import Model

// Predefined Carbon Sequestration Rates
const CARBON_SEQUESTRATION_RATES = {
  forest: {
    tropical: { min: 5, max: 15, default: 10 },
    temperate: { min: 2, max: 8, default: 5 },
    boreal: { min: 1, max: 5, default: 3 }
  },
  mangrove: { min: 8, max: 20, default: 14 },
  grassland: { min: 1, max: 5, default: 3 },
  wetland: { min: 2, max: 6, default: 4 },
  agroforestry: { min: 3, max: 10, default: 6 }
};

/**
 * Carbon Sink Land Calculation Function
 * Input:
 *  - targetCarbonSequestration
 *  - landType
 *  - forestType (required for forest)
 *  - projectDuration
 *  - landSuitabilityFactor
 */
function calculateCarbonSinkLand(data) {
  let sequestrationRate;

  // Fetch predefined sequestration rates
  if (data.landType === 'forest') {
    sequestrationRate = CARBON_SEQUESTRATION_RATES.forest[data.forestType]?.default;
  } else {
    sequestrationRate = CARBON_SEQUESTRATION_RATES[data.landType]?.default;
  }

  // Validate the sequestration rate
  if (!sequestrationRate) {
    throw new Error('Invalid land type or forest type. Please check your inputs.');
  }

  const requiredLand = 
    data.targetCarbonSequestration / (sequestrationRate * data.landSuitabilityFactor);

  const totalCarbonSequestered = 
    requiredLand * sequestrationRate * data.landSuitabilityFactor * data.projectDuration;

  const landUtilizationEfficiency = 
    (totalCarbonSequestered / (data.targetCarbonSequestration * data.projectDuration)) * 100;

  return {
    requiredLand: Math.ceil(requiredLand),
    sequestrationRate,
    totalCarbonSequestered,
    landUtilizationEfficiency
  };
}

// Controller to Handle Request
exports.calculateCarbonSinkLand = async (req, res) => {
    try {
      const {
        targetCarbonSequestration,
        landType,
        forestType,
        projectDuration,
        soilCondition // Added input to determine suitability
      } = req.body;
  
      // Map soil conditions to land suitability factors
      const SOIL_SUITABILITY = {
        ideal: 1.0,
        moderately_suitable: 0.8,
        marginally_suitable: 0.5,
        unsuitable: 0.2
      };
  
      const landSuitabilityFactor = SOIL_SUITABILITY[soilCondition] || 1.0; // Default to 'ideal'
  
      const calculationData = {
        targetCarbonSequestration,
        landType,
        forestType,
        projectDuration: projectDuration || 20, // Default to 20 years
        landSuitabilityFactor
      };
  
      // Perform calculation
      const calculationResults = calculateCarbonSinkLand(calculationData);
  
      // Save to DB
      const newCarbonSink = new CarbonSink({
        ...calculationData,
        calculationResults
      });
  
      await newCarbonSink.save();
  
      res.status(200).json({
        message: 'Calculation Successful',
        soilEfficiency: landSuitabilityFactor,
        data: calculationResults
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error calculating carbon sink land',
        error: error.message
      });
    }
  };
  