const axios = require("axios");
const Electricity = require("../models/Electricity");
const FuelCombustion = require("../models/FuelCombustion");
const Shipping = require("../models/Shipping");
const Explosion=require("../models/Explosion")
const CoalEmission = require('../models/coalEmission');  // Import the model




exports.getElectricityConsumption = async (req, res) => {
  const { stateName, "values.EnergyperTime": energyPerTime, "values.Responsiblearea": responsibleArea, "values.Totalarea": totalArea } = req.query;

  try {
    const response = await axios.get(
      "https://api.carbonkit.net/3.6/categories/Electricity_India_By_State/calculation",
      {
        params: {
          stateName,
          "values.EnergyperTime": energyPerTime,
          "values.Responsiblearea": responsibleArea,
          "values.Totalarea": totalArea,
        },
        headers: {
          Accept: "application/json",
          Authorization: "Basic " + Buffer.from("sujal6990:sujal9867").toString("base64"),
        },
      }
    );

    const result = response.data.output.amounts.reduce((acc, curr) => {
      acc[curr.type] = {
        value: curr.value,
        unit: "kg/day", // Adding unit explicitly as per your logic
      };
      return acc;
    }, {});

    const electricityData = new Electricity({
      stateName,
      energyPerTime,
      responsibleArea,
      totalArea,
      result,
    });

    await electricityData.save();

    res.json({ result });
  } catch (error) {
    console.error(
      "Error fetching data from CarbonKit API:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

exports.getFuelCombustion = async (req, res) => {
  const { fuel, "values.Volume": Volume } = req.query;

  try {
    const response = await axios.get(
      "https://api.carbonkit.net/3.6/categories/DEFRA_transport_fuel_methodology/calculation",
      {
        params: {
          fuel,
          "values.Volume": Volume,
        },
        headers: {
          Accept: "application/json",
          Authorization: "Basic " + Buffer.from("sujal6990:sujal9867").toString("base64"),
        },
      }
    );

    const result = response.data.output.amounts.reduce((acc, curr) => {
      if (
        [
          "CO2",
          "nitrousOxideCO2e",
          "methaneCO2e",
          "totalDirectCO2e",
          "indirectCO2e",
          "lifeCycleCO2e",
        ].includes(curr.type)
      ) {
        acc[curr.type] = {
          value: curr.value,
          unit: curr.unit,
        };
      }
      return acc;
    }, {});

    const fuelCombustionData = new FuelCombustion({
      fuel,
      quantityFuelConsumed: Volume,
      result,
    });

    await fuelCombustionData.save();

    res.json({ result });
  } catch (error) {
    console.error(
      "Error fetching data from CarbonKit API:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

exports.calculateShippingEmissions = async (req, res) => {
  let { weight_unit, weight_value, distance_unit, distance_value, transport_method } = req.body;

  weight_value = parseFloat(weight_value);
  distance_value = parseFloat(distance_value);

  if (!weight_unit || !distance_unit || !transport_method || isNaN(weight_value) || isNaN(distance_value)) {
    return res.status(400).json({
      error: "Invalid input: Please ensure all fields are filled out correctly.",
    });
  }

  try {
    const response = await axios.post(
      "https://www.carboninterface.com/api/v1/estimates",
      {
        type: "shipping",
        weight_unit,
        weight_value,
        distance_unit,
        distance_value,
        transport_method,
      },
      {
        headers: {
          Authorization: `Bearer ZguQ1dBUb7qSLQhpZQV3KQ`,
          "Content-Type": "application/json",
        },
      }
    );

    const carbonData = response.data.data.attributes;
    const result = {
      distance: `${carbonData.distance_value} ${carbonData.distance_unit}`,
      weight: `${carbonData.weight_value} ${carbonData.weight_unit}`,
      carbonEmissions: {
        grams: `${carbonData.carbon_g} g`,
        kilograms: `${carbonData.carbon_kg} kg`,
        metricTonnes: `${carbonData.carbon_mt} mt`,
      },
    };

    const shippingData = new Shipping({
      weight_unit,
      weight_value,
      distance_unit,
      distance_value,
      transport_method,
      result,
    });

    await shippingData.save();

    res.json(result);
  } catch (error) {
    console.error(
      "Error fetching data from Carbon Interface API:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to fetch data" });
  }
};


exports.calculateExplosionEmissions = async (req, res) => {
  const { explosiveType, amount } = req.body;

  
  const emissionFactors = {
    'Black powder': { CO: 85, H2S: 12, CO2: 3100 },
    'Smokeless powder': { CO: 38, H2S: 10, CO2: 38 },
    'Dynamite, straight': { CO: 141, H2S: 3, CO2: 2320 },
    'Dynamite, ammonia': { CO: 32, H2S: 16, CO2: 32 },
    'Dynamite, gelatin': { CO: 52, NOx: 26, SO2: 1, CO2: 52 },
    'ANFO': { CO: 34, NOx: 8, SO2: 1, CO2: 34 },
    'TNT': { CO: 398, NH3: 14, HCN: 13, CO2: 1360 },
    'RDX': { CO: 98, NH3: 22, CO2: 1190 },
    'PETN': { CO: 149, NH3: 1.3, CO2: 696 }
  };

  try {
    if (!emissionFactors[explosiveType]) {
      return res.status(400).json({ error: "Invalid explosive type" });
    }

    const factors = emissionFactors[explosiveType];
    const emissions = {
      CO: (amount * factors.CO / 1e6).toFixed(4) + " tons",
      NOx: (amount * (factors.NOx || 0) / 1e6).toFixed(4) + " tons",
      NH3: (amount * (factors.NH3 || 0) / 1e6).toFixed(4) + " tons",
      HCN: (amount * (factors.HCN || 0) / 1e6).toFixed(4) + " tons",
      H2S: (amount * (factors.H2S || 0) / 1e6).toFixed(4) + " tons",
      SO2: (amount * (factors.SO2 || 0) / 1e6).toFixed(4) + " tons",
      CO2: (amount * factors.CO2 / 1e6).toFixed(4) + " tons",
    };


    const explosionData = new Explosion({
      explosiveType,
      amount,
      emissions,
    });

    await explosionData.save();

    res.json({ emissions, explosiveType, amount });
  } catch (error) {
    console.error("Error calculating emissions:", error.message);
    res.status(500).json({ error: "Failed to calculate emissions" });
  }
};


exports.coalEmission=async (req,res)=>{
  const EMISSION_FACTORS = {
    Lignite: 0.95, // Example value in the range 0.90–1.0
    'Sub-bituminous': 0.90, // Example value in the range 0.85–0.95
    Bituminous: 1.00, // Example value in the range 0.95–1.05
    Anthracite: 1.10 // Example value in the range 1.05–1.15
  };

  try {
    const { coalType, coalConsumption } = req.body;

    // Validate coal type
    if (!coalType || !coalConsumption) {
      return res.status(400).json({ error: 'Missing required parameters: coalType, coalConsumption' });
    }

    if (!EMISSION_FACTORS[coalType]) {
      return res.status(400).json({ error: 'Invalid coal type. Valid types are: Lignite, Sub-bituminous, Bituminous, Anthracite' });
    }

    const emissionFactor = EMISSION_FACTORS[coalType];
    const carbonOxidationFactor = 0.99; // Fixed at 99%

    // Calculate CO2 emissions
    const co2Emissions = coalConsumption * emissionFactor * carbonOxidationFactor;

    // Create a new document to save in the database
    const coalEmission = new CoalEmission({
      coalType,
      coalConsumption,
      emissionFactor,
      co2Emissions
    });

    // Save the document to the database
    await coalEmission.save();

    // Respond with the calculated emissions
    res.status(200).json({
      coalType,
      coalConsumption,
      emissionFactor,
      carbonOxidationFactor,
      co2Emissions
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}