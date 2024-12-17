const EmissionCalculation = require('../models/evCalculations');

// Define constants directly in the controller
const VEHICLE_FUEL_CONSUMPTION = {
  'Dumper Truck': 20,    // litres/hour
  'Excavator': 15,       // litres/hour
  'Haul Truck': 25,      // litres/hour
  'Loader': 12,          // litres/hour
  'Drill Machine': 10    // litres/hour
};

const EMISSION_FACTORS = {
  diesel: 2.68,   // kg CO₂/litre
  petrol: 2.31,   // kg CO₂/litre
};

exports.calculateEmissionSavings = async (req, res) => {
  try {
    const { 
      vehicleType, 
      numberOfVehicles, 
      dailyHours, 
      fuelType,
      fuelPrice,
      carbonCreditPrice,
      workingDaysPerYear
    } = req.body;

    // Validate inputs
    if (!VEHICLE_FUEL_CONSUMPTION[vehicleType]) {
      return res.status(400).json({ error: 'Invalid vehicle type' });
    }

    // Get vehicle-specific fuel consumption
    const fuelConsumption = VEHICLE_FUEL_CONSUMPTION[vehicleType];

    // Determine emission factor based on fuel type
    const fuelEmissionFactor = EMISSION_FACTORS[fuelType.toLowerCase()] || EMISSION_FACTORS.diesel;

    // Calculate current emissions
    const currentEmissions = 
      fuelConsumption * 
      fuelEmissionFactor * 
      dailyHours * 
      numberOfVehicles;

    // Emission savings with renewable EVs (100% reduction)
    const emissionSavings = currentEmissions;

    // Calculate daily fuel cost savings
    const dailyFuelCostSavings = 
      fuelConsumption * 
      fuelPrice * 
      dailyHours * 
      numberOfVehicles;

    // Calculate annual fuel cost savings
    const annualFuelCostSavings = 
      dailyFuelCostSavings * 
      (workingDaysPerYear || 250); // Default to 250 working days if not provided

    // Calculate carbon credits
    const carbonCreditsEarned = emissionSavings / 1000; // 1 credit = 1000 kg CO₂

    // Calculate carbon credits revenue
    const carbonCreditsRevenue = 
      carbonCreditsEarned * 
      (carbonCreditPrice || 300); // Default to $20 per credit if not provided

    // Calculate percentage reduction
    const percentageReduction = 100;

    // Create and save calculation
    const calculation = new EmissionCalculation({
      vehicleType,
      numberOfVehicles,
      dailyHours,
      fuelType,
      fuelPrice,
      carbonCreditPrice,
      workingDaysPerYear,
      calculationResults: {
        emissionSavings,
        percentageReduction,
        dailyFuelCostSavings,
        annualFuelCostSavings,
        carbonCreditsEarned,
        carbonCreditsRevenue
      }
    });

    await calculation.save();

    res.json({
      message: 'Emission Savings Calculation Completed Successfully',
      data: calculation
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error Calculating Emissions', 
      error: error.message 
    });
  }
};